import { formatCoinHistoryDateLabel } from "@/lib/coin/coinKst";
import { isCoinHistoryType } from "@/lib/coin/coinRewards";
import { createSupabaseAdmin } from "@/lib/supabase/supabaseAdmin";
import { hasCheckedInTodayForUser } from "@/lib/server/hasCheckedInTodayForUser";
import type { CoinHistoryItem, CoinPageInitialData } from "@/types/coin";

type CoinHistoryRow = {
  id: string;
  title: string;
  amount: number;
  type: string;
  created_at: string;
};

const HISTORY_LIMIT = 50;

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

/**
 * 엽전 충전소 — profiles.coin + coin_histories 목록 + 오늘 출석 여부
 * profile / histories / 출석 조회를 Promise.all로 병렬 실행
 */
export async function fetchCoinDataFromDb(
  userId: string,
): Promise<CoinPageInitialData> {
  const empty: CoinPageInitialData = {
    balance: 0,
    histories: [],
    hasCheckedInToday: false,
  };

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch {
    return empty;
  }

  const [profileResult, historyResult, hasCheckedInToday] = await Promise.all([
    admin.from("profiles").select("coin").eq("id", userId).maybeSingle(),
    admin
      .from("coin_histories")
      .select("id, title, amount, type, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(HISTORY_LIMIT),
    hasCheckedInTodayForUser(userId),
  ]);

  const { data: profile, error: profileError } = profileResult;

  if (profileError != null || profile == null) {
    console.error("[fetchCoinDataFromDb] profile", profileError?.message);
    return empty;
  }

  const balance =
    typeof profile.coin === "number" ? profile.coin : Number(profile.coin ?? 0);

  const { data: historyRows, error: historyError } = historyResult;

  if (historyError != null) {
    console.error("[fetchCoinDataFromDb] histories", historyError.message);
  }

  const histories = (historyRows ?? [])
    .map((row) => mapHistoryRow(row as CoinHistoryRow))
    .filter((item): item is CoinHistoryItem => item != null);

  return {
    balance,
    histories,
    hasCheckedInToday,
  };
}
