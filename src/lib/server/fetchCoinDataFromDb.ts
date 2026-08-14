import { formatCoinHistoryDateLabel } from "@/lib/coin/coinKst";
import { isCoinHistoryType } from "@/lib/coin/coinRewards";
import {
  COIN_HISTORY_API_MAX_LIMIT,
  COIN_HISTORY_INITIAL_SERVER_LIMIT,
} from "@/lib/mypage/coins/coinHistoryPaginationConstants";
import { hasCheckedInTodayForUser } from "@/lib/server/hasCheckedInTodayForUser";
import { createSupabaseAdmin } from "@/lib/supabase/supabaseAdmin";
import type {
  CoinHistoriesPageData,
  CoinHistoryItem,
  CoinPageInitialData,
} from "@/types/coin";

type CoinHistoryRow = {
  id: string;
  title: string;
  amount: number;
  type: string;
  created_at: string;
};

export type FetchCoinHistoriesPageOptions = {
  offset: number;
  limit: number;
};

const COIN_HISTORY_SELECT = "id, title, amount, type, created_at";

const EMPTY_HISTORIES_PAGE: CoinHistoriesPageData = {
  histories: [],
  totalCount: 0,
};

function mapHistoryRow(row: CoinHistoryRow): CoinHistoryItem | null {
  if (!isCoinHistoryType(row.type)) return null;
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    amount: row.amount,
    createdAt: row.created_at,
    dateLabel: formatCoinHistoryDateLabel(row.created_at),
  };
}

/** offset·limit 유효성 — API·서버 공용 */
export function normalizeCoinHistoriesPagination(
  offsetRaw: unknown,
  limitRaw: unknown,
): { ok: true; offset: number; limit: number } | { ok: false; message: string } {
  const offset =
    typeof offsetRaw === "number"
      ? offsetRaw
      : typeof offsetRaw === "string"
        ? Number.parseInt(offsetRaw, 10)
        : Number.NaN;
  const limit =
    typeof limitRaw === "number"
      ? limitRaw
      : typeof limitRaw === "string"
        ? Number.parseInt(limitRaw, 10)
        : Number.NaN;

  if (!Number.isFinite(offset) || offset < 0) {
    return { ok: false, message: "offset은 0 이상의 정수여야 합니다." };
  }
  if (!Number.isFinite(limit) || limit < 1 || limit > COIN_HISTORY_API_MAX_LIMIT) {
    return {
      ok: false,
      message: `limit은 1~${COIN_HISTORY_API_MAX_LIMIT} 사이 정수여야 합니다.`,
    };
  }

  return { ok: true, offset: Math.floor(offset), limit: Math.floor(limit) };
}

/**
 * coin_histories 목록 페이지 조회 (최신순)
 * 엽전 충전소·GET /api/coins/histories 공용
 */
export async function fetchCoinHistoriesPageFromDb(
  userId: string,
  options: FetchCoinHistoriesPageOptions,
): Promise<CoinHistoriesPageData> {
  const normalized = normalizeCoinHistoriesPagination(
    options.offset,
    options.limit,
  );
  if (!normalized.ok) {
    return EMPTY_HISTORIES_PAGE;
  }

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch {
    return EMPTY_HISTORIES_PAGE;
  }

  const { offset, limit } = normalized;
  const rangeEnd = offset + limit - 1;

  const { data, error, count } = await admin
    .from("coin_histories")
    .select(COIN_HISTORY_SELECT, { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, rangeEnd);

  if (error != null) {
    console.error("[fetchCoinHistoriesPageFromDb]", error.message);
    return EMPTY_HISTORIES_PAGE;
  }

  const histories = (data ?? [])
    .map((row) => mapHistoryRow(row as CoinHistoryRow))
    .filter((item): item is CoinHistoryItem => item != null);

  return {
    histories,
    totalCount: count ?? 0,
  };
}

/**
 * 엽전 충전소 — profiles.coin + coin_histories 초기 목록 + 오늘 출석 여부
 * profile / histories / 출석 조회를 Promise.all로 병렬 실행
 */
export async function fetchCoinDataFromDb(
  userId: string,
): Promise<CoinPageInitialData> {
  const empty: CoinPageInitialData = {
    balance: 0,
    histories: [],
    historyTotalCount: 0,
    hasCheckedInToday: false,
  };

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch {
    return empty;
  }

  const [profileResult, historiesPage, hasCheckedInToday] = await Promise.all([
    admin.from("profiles").select("coin").eq("id", userId).maybeSingle(),
    fetchCoinHistoriesPageFromDb(userId, {
      offset: 0,
      limit: COIN_HISTORY_INITIAL_SERVER_LIMIT,
    }),
    hasCheckedInTodayForUser(userId),
  ]);

  const { data: profile, error: profileError } = profileResult;

  if (profileError != null || profile == null) {
    console.error("[fetchCoinDataFromDb] profile", profileError?.message);
    return empty;
  }

  const balance =
    typeof profile.coin === "number" ? profile.coin : Number(profile.coin ?? 0);

  return {
    balance,
    histories: historiesPage.histories,
    historyTotalCount: historiesPage.totalCount,
    hasCheckedInToday,
  };
}
