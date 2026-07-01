import { getKstDayBoundsUtc } from "@/lib/coinKst";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * KST 기준 당일 EARN_ATTENDANCE 여부 — GET status API + fetchCoinDataFromDb 공용
 */
export async function hasCheckedInTodayForUser(
  userId: string,
): Promise<boolean> {
  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch {
    return false;
  }

  const { startIso, endIso } = getKstDayBoundsUtc();
  const { count, error } = await admin
    .from("coin_histories")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("type", "EARN_ATTENDANCE")
    .gte("created_at", startIso)
    .lt("created_at", endIso);

  if (error != null) return false;
  return (count ?? 0) > 0;
}
