import {
  getIntentCategoryBadgeLabel,
  resolveReadingDetailCategory,
} from "@/components/tarot/setup/setupIntentCatalog";
import { createSupabaseAdmin } from "@/lib/supabase/supabaseAdmin";
import { getTarotSpreadPositionMeta } from "@/lib/tarot/spread/tarotSpreadPositionMeta";
import type { TarotReadingLlmPayload } from "@/lib/tarot/reading/tarotReadingLlmPayload";
import type {
  TarotReadingPickedCardRequest,
  ValidatedTarotReadingRequest,
} from "@/types/tarotReadingRequest";

type ProfileRow = {
  nickname: string | null;
  gender: string | null;
  birth_date: string | null;
};

type CardRow = {
  id: number;
  name_en: string | null;
};

type CardMeaningRow = {
  card_id: number;
  is_upright: boolean;
  keywords: string[] | null;
  description: string | null;
};

export type BuildTarotReadingLlmPayloadResult =
  | { ok: true; payload: TarotReadingLlmPayload }
  | {
      ok: false;
      code:
        | "ENV_MISSING"
        | "PROFILE_QUERY"
        | "CARD_QUERY"
        | "MEANING_QUERY"
        | "REFERENCE_MISSING"
        | "POSITION_MISSING";
      message: string;
    };

type TarotReadingPayloadEntry = {
  pickedCard: TarotReadingPickedCardRequest;
  slotIndex: number;
};

type SupabaseQueryError = {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
};

type SupabaseQueryResult = {
  error: SupabaseQueryError | null;
};

type SupabaseQueryTarget = "profiles" | "cards" | "card_meanings";

const SUPABASE_RETRY_DELAY_MS = 250;
const TRANSIENT_SUPABASE_ERROR_MARKERS = [
  "ENOTFOUND",
  "EAI_AGAIN",
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "FETCH FAILED",
] as const;

/**
 * 인증된 사용자 ID와 브라우저의 최소 요청을 기반으로 LLM 입력을 서버에서 조립합니다.
 * 프로필·카드명·방향별 키워드는 브라우저 값을 신뢰하지 않고 DB에서 다시 조회합니다.
 */
export async function buildTarotReadingLlmPayload(
  userId: string,
  request: ValidatedTarotReadingRequest,
  now = new Date(),
): Promise<BuildTarotReadingLlmPayloadResult> {
  return buildTarotReadingLlmPayloadForEntries(
    userId,
    request,
    request.pickedCards.map((pickedCard, slotIndex) => ({
      pickedCard,
      slotIndex,
    })),
    now,
  );
}

/** 카드 선택 직후 해당 슬롯 한 장만 선행 해석할 입력을 조립합니다. */
export async function buildTarotCardDraftLlmPayload(
  userId: string,
  request: ValidatedTarotReadingRequest,
  slotIndex: number,
  now = new Date(),
): Promise<BuildTarotReadingLlmPayloadResult> {
  const pickedCard = request.pickedCards[0];
  if (pickedCard == null) {
    return {
      ok: false,
      code: "REFERENCE_MISSING",
      message: "선택한 카드 정보를 찾지 못했습니다.",
    };
  }

  return buildTarotReadingLlmPayloadForEntries(
    userId,
    request,
    [{ pickedCard, slotIndex }],
    now,
  );
}

async function buildTarotReadingLlmPayloadForEntries(
  userId: string,
  request: ValidatedTarotReadingRequest,
  entries: readonly TarotReadingPayloadEntry[],
  now: Date,
): Promise<BuildTarotReadingLlmPayloadResult> {
  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (error) {
    console.error("[MAGO][타로 리딩] Supabase Admin 초기화 실패", error);
    return {
      ok: false,
      code: "ENV_MISSING",
      message: "서버 환경 설정이 올바르지 않습니다.",
    };
  }

  const cardIds = entries.map(({ pickedCard }) => pickedCard.cardId);
  const [profileResult, cardsResult, meaningsResult] = await Promise.all([
    runSupabaseQueryWithTransientRetry("profiles", () =>
      admin
        .from("profiles")
        .select("nickname,gender,birth_date")
        .eq("id", userId)
        .maybeSingle(),
    ),
    runSupabaseQueryWithTransientRetry("cards", () =>
      admin.from("cards").select("id,name_en").in("id", cardIds),
    ),
    runSupabaseQueryWithTransientRetry("card_meanings", () =>
      admin
        .from("card_meanings")
        .select("card_id,is_upright,keywords,description")
        .in("card_id", cardIds),
    ),
  ]);

  if (profileResult.error != null) {
    console.error(
      "[MAGO][타로 리딩] 프로필 조회 실패",
      profileResult.error,
    );
    return {
      ok: false,
      code: "PROFILE_QUERY",
      message: "프로필 정보를 불러오지 못했습니다.",
    };
  }
  if (cardsResult.error != null) {
    console.error("[MAGO][타로 리딩] 카드 조회 실패", cardsResult.error);
    return {
      ok: false,
      code: "CARD_QUERY",
      message: "카드 정보를 불러오지 못했습니다.",
    };
  }
  if (meaningsResult.error != null) {
    console.error(
      "[MAGO][타로 리딩] 카드 의미 조회 실패",
      meaningsResult.error,
    );
    return {
      ok: false,
      code: "MEANING_QUERY",
      message: "카드 해석 정보를 불러오지 못했습니다.",
    };
  }

  const profile = (profileResult.data ?? null) as ProfileRow | null;
  const cards = (cardsResult.data ?? []) as CardRow[];
  const meanings = (meaningsResult.data ?? []) as CardMeaningRow[];
  const cardMap = new Map(cards.map((card) => [card.id, card]));
  const meaningMap = new Map(
    meanings.map((meaning) => [
      `${meaning.card_id}:${meaning.is_upright}`,
      meaning,
    ]),
  );

  const readings: TarotReadingLlmPayload["readings"] = [];
  for (const { pickedCard, slotIndex } of entries) {
    const card = cardMap.get(pickedCard.cardId);
    const meaning = meaningMap.get(
      `${pickedCard.cardId}:${!pickedCard.isReversed}`,
    );
    if (card == null || meaning == null) {
      console.error("[MAGO][타로 리딩] 카드 기준 데이터 누락", {
        cardId: pickedCard.cardId,
        isReversed: pickedCard.isReversed,
      });
      return {
        ok: false,
        code: "REFERENCE_MISSING",
        message: "선택한 카드의 기준 정보를 찾지 못했습니다.",
      };
    }

    const position = getTarotSpreadPositionMeta(
      request.setup.cardCount,
      request.setup.category,
      slotIndex,
      request.setup.detailTag,
    );
    if (position == null) {
      return {
        ok: false,
        code: "POSITION_MISSING",
        message: "카드 해석 위치 정보를 찾지 못했습니다.",
      };
    }

    const cardName = card.name_en?.trim() || `Card #${pickedCard.cardId}`;
    readings.push({
      position_label: position.label,
      position_desc: position.desc,
      card_name_en: cardName,
      is_reversed: pickedCard.isReversed,
      keywords: meaning.keywords ?? [],
      meaning: meaning.description?.trim() ?? "",
    });
  }

  const local = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Asia/Seoul",
  }).format(now);

  return {
    ok: true,
    payload: {
      schema_version: 2,
      timestamp: {
        local,
      },
      user: {
        nickname: profile?.nickname ?? "",
        gender: profile?.gender ?? "",
        age: calculateAgeInKorea(profile?.birth_date ?? null, now),
      },
      consultation: {
        main_category: getIntentCategoryBadgeLabel(request.setup.category),
        detail_category: resolveReadingDetailCategory(
          request.setup.category,
          request.setup.detailTag,
        ),
        situation: request.setup.situation,
        question: request.setup.question,
      },
      readings,
    },
  };
}

/** DNS 등 일시적인 네트워크 오류일 때 실패한 조회만 한 번 다시 실행합니다. */
async function runSupabaseQueryWithTransientRetry<
  TResult extends SupabaseQueryResult,
>(
  target: SupabaseQueryTarget,
  runQuery: () => PromiseLike<TResult>,
): Promise<TResult> {
  const firstResult = await runQuery();
  const reason = getTransientSupabaseErrorReason(firstResult.error);
  if (reason == null) return firstResult;

  console.warn("[MAGO][타로 리딩] Supabase 일시 오류로 조회 재시도", {
    target,
    reason,
    retryDelayMs: SUPABASE_RETRY_DELAY_MS,
  });

  await wait(SUPABASE_RETRY_DELAY_MS);
  return runQuery();
}

function getTransientSupabaseErrorReason(
  error: SupabaseQueryError | null,
): (typeof TRANSIENT_SUPABASE_ERROR_MARKERS)[number] | null {
  if (error == null) return null;

  const errorText = [error.code, error.message, error.details, error.hint]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toUpperCase();

  return (
    TRANSIENT_SUPABASE_ERROR_MARKERS.find((marker) =>
      errorText.includes(marker),
    ) ?? null
  );
}

function wait(durationMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

/** YYYY-MM-DD 생년월일을 요청 시점의 한국 표준시 기준 만 나이로 변환 */
function calculateAgeInKorea(
  birthDate: string | null,
  now: Date,
): number | null {
  if (birthDate == null) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate.trim());
  if (match == null) return null;

  const birthYear = Number(match[1]);
  const birthMonth = Number(match[2]);
  const birthDay = Number(match[3]);
  const normalizedBirthDate = new Date(
    Date.UTC(birthYear, birthMonth - 1, birthDay),
  );
  if (
    normalizedBirthDate.getUTCFullYear() !== birthYear ||
    normalizedBirthDate.getUTCMonth() + 1 !== birthMonth ||
    normalizedBirthDate.getUTCDate() !== birthDay
  ) {
    return null;
  }

  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const currentYear = Number(
    dateParts.find(({ type }) => type === "year")?.value,
  );
  const currentMonth = Number(
    dateParts.find(({ type }) => type === "month")?.value,
  );
  const currentDay = Number(
    dateParts.find(({ type }) => type === "day")?.value,
  );
  if (
    !Number.isInteger(currentYear) ||
    !Number.isInteger(currentMonth) ||
    !Number.isInteger(currentDay) ||
    birthYear > currentYear
  ) {
    return null;
  }

  const birthdayHasPassed =
    currentMonth > birthMonth ||
    (currentMonth === birthMonth && currentDay >= birthDay);
  const age = currentYear - birthYear - (birthdayHasPassed ? 0 : 1);
  return age >= 0 ? age : null;
}
