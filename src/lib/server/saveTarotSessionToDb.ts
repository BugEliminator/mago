import { getIntentCategoryBadgeLabel } from "@/components/tarot/setup/setupIntentCatalog";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import type { MagoLlmReadingItem } from "@/types/magoResult";
import type { TarotCategory } from "@/types/tarot";
import type {
  SaveTarotSessionInput,
  SaveTarotSessionResult,
  TarotSessionCardInsert,
  TarotSessionInsert,
} from "@/types/tarotSessionDb";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type CardMasterRow = {
  id: number;
  name_en: string;
};

/** cards.name_en → cards.id 일괄 조회 */
async function resolveCardIdsByNameEn(
  readings: readonly MagoLlmReadingItem[],
): Promise<Map<string, number> | SaveTarotSessionResult> {
  if (readings.length === 0) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "저장할 카드 해석(res_readings)이 없습니다.",
    };
  }

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase Admin 설정 오류";
    return { ok: false, code: "ENV_MISSING", message };
  }

  const names = [...new Set(readings.map((r) => r.card_name_en))];
  const { data, error } = await admin
    .from("cards")
    .select("id, name_en")
    .in("name_en", names);

  if (error != null) {
    return {
      ok: false,
      code: "CARD_LOOKUP",
      message: `카드 마스터 조회 실패: ${error.message}`,
    };
  }

  const idByName = new Map<string, number>();
  for (const row of (data ?? []) as CardMasterRow[]) {
    idByName.set(row.name_en, row.id);
  }

  const missing = names.filter((name) => !idByName.has(name));
  if (missing.length > 0) {
    return {
      ok: false,
      code: "CARD_LOOKUP",
      message: `cards.name_en 매칭 실패: ${missing.join(", ")}`,
    };
  }

  return idByName;
}

/** setup + LLM → tarot_sessions INSERT 행 */
function buildSessionInsert(
  input: SaveTarotSessionInput,
): TarotSessionInsert | SaveTarotSessionResult {
  const { sessionId, userId, setup, llm } = input;

  if (!UUID_RE.test(sessionId)) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "sessionId는 유효한 UUID여야 합니다.",
    };
  }
  if (!UUID_RE.test(userId)) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "userId는 유효한 UUID여야 합니다.",
    };
  }
  if (setup.category == null || setup.cardCount == null) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "setup.category 또는 setup.cardCount가 비어 있습니다.",
    };
  }
  if (llm.res_readings.length !== setup.cardCount) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "LLM 카드 수와 setup.cardCount가 일치하지 않습니다.",
    };
  }

  const categoryId: TarotCategory = setup.category;
  const fortuneScore = Math.min(100, Math.max(0, Math.round(llm.res_score)));

  return {
    id: sessionId,
    user_id: userId,
    card_count: setup.cardCount,
    main_category: getIntentCategoryBadgeLabel(categoryId),
    detail_category: setup.detailTag,
    fortune_score: fortuneScore,
    user_situation: setup.situation,
    user_question: setup.question,
    summary_line: llm.res_theme,
    final_advice: llm.res_mago_advice.summary,
  };
}

/** LLM res_readings → tarot_session_cards bulk INSERT 행 */
function buildSessionCardInserts(
  sessionId: string,
  readings: readonly MagoLlmReadingItem[],
  idByName: Map<string, number>,
): TarotSessionCardInsert[] {
  return readings.map((reading, idx) => ({
    session_id: sessionId,
    order_index: idx + 1,
    card_id: idByName.get(reading.card_name_en)!,
    card_name_en: reading.card_name_en,
    is_reversed: reading.is_reversed,
    phase_label: reading.label,
    one_liner: reading.one_liner,
    paragraphs: reading.paragraphs,
  }));
}

/**
 * 타로 리딩 결과를 Supabase에 2단계 INSERT
 * 1) tarot_sessions → session UUID 확보
 * 2) tarot_session_cards bulk insert (실패 시 session 롤백 delete)
 */
export async function saveTarotSessionToDb(
  input: SaveTarotSessionInput,
): Promise<SaveTarotSessionResult> {
  const sessionRow = buildSessionInsert(input);
  if ("ok" in sessionRow) return sessionRow;

  const cardLookup = await resolveCardIdsByNameEn(input.llm.res_readings);
  if ("ok" in cardLookup) return cardLookup;

  const cardRows = buildSessionCardInserts(
    input.sessionId,
    input.llm.res_readings,
    cardLookup,
  );

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase Admin 설정 오류";
    return { ok: false, code: "ENV_MISSING", message };
  }

  const { data: insertedSession, error: sessionError } = await admin
    .from("tarot_sessions")
    .insert(sessionRow)
    .select("id")
    .single();

  if (sessionError != null) {
    const isDuplicate = sessionError.code === "23505";
    return {
      ok: false,
      code: isDuplicate ? "DUPLICATE_SESSION" : "SESSION_INSERT",
      message: isDuplicate
        ? "이미 저장된 리딩 세션 ID입니다."
        : `tarot_sessions 저장 실패: ${sessionError.message}`,
    };
  }

  const sessionId = insertedSession?.id as string | undefined;
  if (sessionId == null) {
    return {
      ok: false,
      code: "SESSION_INSERT",
      message: "tarot_sessions INSERT 후 id를 받지 못했습니다.",
    };
  }

  const { error: cardsError } = await admin
    .from("tarot_session_cards")
    .insert(cardRows);

  if (cardsError != null) {
    await admin.from("tarot_sessions").delete().eq("id", sessionId);
    return {
      ok: false,
      code: "CARDS_INSERT",
      message: `tarot_session_cards 저장 실패(세션 롤백): ${cardsError.message}`,
    };
  }

  return { ok: true, sessionId };
}
