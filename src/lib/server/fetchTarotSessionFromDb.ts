import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdmin } from "@/lib/supabase/supabaseAdmin";
import { mapTarotSessionDbToResultPage } from "@/lib/tarot/map/mapTarotSessionDbToResultPage";
import type { TarotReadingQueryData } from "@/lib/tarot/reading/tarotReadingQuery";
import type {
  TarotSessionCardRow,
  TarotSessionRow,
} from "@/types/tarotSessionDb";

export type FetchedTarotSession = {
  session: TarotSessionRow;
  cards: TarotSessionCardRow[];
};

const TAROT_SESSION_SELECT =
  "id, user_id, card_count, main_category, detail_category, fortune_score, user_situation, user_question, summary_line, final_advice, has_reviewed, rating, review_content";

const TAROT_SESSION_SELECT_WITH_DELETED_AT = `${TAROT_SESSION_SELECT}, deleted_at`;

/** deleted_at 컬럼이 아직 없을 때 PostgREST/Postgres 오류 */
function isMissingDeletedAtColumn(error: {
  code?: string;
  message?: string;
}): boolean {
  const message = error.message ?? "";
  return (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    /deleted_at/i.test(message)
  );
}

/**
 * 세션 마스터 조회 — 없거나 소프트 삭제면 null
 * deleted_at 컬럼이 없으면 필터 없이 재시도합니다.
 */
async function fetchLiveTarotSessionRow(
  admin: SupabaseClient,
  readingId: string,
): Promise<TarotSessionRow | null> {
  const withDeletedAt = await admin
    .from("tarot_sessions")
    .select(TAROT_SESSION_SELECT_WITH_DELETED_AT)
    .eq("id", readingId)
    .is("deleted_at", null)
    .maybeSingle();

  if (withDeletedAt.error != null && isMissingDeletedAtColumn(withDeletedAt.error)) {
    const fallback = await admin
      .from("tarot_sessions")
      .select(TAROT_SESSION_SELECT)
      .eq("id", readingId)
      .maybeSingle();

    if (fallback.error != null || fallback.data == null) {
      return null;
    }

    return fallback.data as TarotSessionRow;
  }

  if (withDeletedAt.error != null || withDeletedAt.data == null) {
    return null;
  }

  const session = withDeletedAt.data as TarotSessionRow;
  if (session.deleted_at != null) {
    return null;
  }

  return session;
}

/**
 * readingId로 tarot_sessions / tarot_session_cards 조회 (service role)
 * — UUID를 아는 누구나 결과 본문을 볼 수 있습니다. 소유자 여부는 호출 측에서 판별합니다.
 * — 없거나 deleted_at이 있으면 null (호출 측에서 notFound).
 */
export async function fetchTarotSessionFromDb(
  readingId: string,
): Promise<FetchedTarotSession | null> {
  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch {
    return null;
  }

  const sessionData = await fetchLiveTarotSessionRow(admin, readingId);
  if (sessionData == null) {
    return null;
  }

  const { data: cardsData, error: cardsError } = await admin
    .from("tarot_session_cards")
    .select(
      "id, session_id, order_index, card_id, card_name_en, is_reversed, phase_label, one_liner, paragraphs",
    )
    .eq("session_id", readingId)
    .order("order_index", { ascending: true });

  if (cardsError != null) {
    return null;
  }

  return {
    session: sessionData,
    cards: (cardsData ?? []) as TarotSessionCardRow[],
  };
}

/** DB 조회 + UI mapper — Server prefetch / GET API 공용 */
export async function getTarotReadingQueryData(
  readingId: string,
  viewerUserId?: string | null,
): Promise<TarotReadingQueryData | null> {
  const fetched = await fetchTarotSessionFromDb(readingId);
  if (fetched == null) return null;

  const mapped = mapTarotSessionDbToResultPage(fetched.session, fetched.cards);
  return {
    ...mapped,
    isOwner:
      viewerUserId != null && viewerUserId === fetched.session.user_id,
  };
}
