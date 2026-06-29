import { formatCoinHistoryDateLabel, getKstDayBoundsUtc } from "@/lib/coinKst";
import { isCoinHistoryType } from "@/lib/coinRewards";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
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

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("coin")
    .eq("id", userId)
    .maybeSingle();

  if (profileError != null || profile == null) {
    console.error("[fetchCoinDataFromDb] profile", profileError?.message);
    return empty;
  }

  const balance =
    typeof profile.coin === "number" ? profile.coin : Number(profile.coin ?? 0);

  const { data: historyRows, error: historyError } = await admin
    .from("coin_histories")
    .select("id, title, amount, type, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(HISTORY_LIMIT);

  if (historyError != null) {
    console.error("[fetchCoinDataFromDb] histories", historyError.message);
  }

  const histories = (historyRows ?? [])
    .map((row) => mapHistoryRow(row as CoinHistoryRow))
    .filter((item): item is CoinHistoryItem => item != null);

  const { startIso, endIso } = getKstDayBoundsUtc();
  const { count, error: checkinError } = await admin
    .from("coin_histories")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("type", "EARN_ATTENDANCE")
    .gte("created_at", startIso)
    .lt("created_at", endIso);

  if (checkinError != null) {
    console.error("[fetchCoinDataFromDb] checkin", checkinError.message);
  }

  return {
    balance,
    histories,
    hasCheckedInToday: (count ?? 0) > 0,
  };
}
