import { applyCoinTransaction } from "@/lib/server/applyCoinTransaction";
import { getKstDayBoundsUtc } from "@/lib/coinKst";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import type { ApplyCoinTransactionResult } from "@/types/coin";

export type ClaimAttendanceRewardResult =
  | (ApplyCoinTransactionResult & { ok: true })
  | {
      ok: false;
      code: "ALREADY_CHECKED_IN" | "ENV_MISSING" | "DB_ERROR";
      message: string;
    };

/**
 * 출석 보상 — KST 당일 EARN_ATTENDANCE 중복 방지 후 +20
 */
export async function claimAttendanceReward(
  userId: string,
): Promise<ClaimAttendanceRewardResult> {
  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase Admin 설정 오류";
    return { ok: false, code: "ENV_MISSING", message };
  }

  const { startIso, endIso } = getKstDayBoundsUtc();
  const { count, error: countError } = await admin
    .from("coin_histories")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("type", "EARN_ATTENDANCE")
    .gte("created_at", startIso)
    .lt("created_at", endIso);

  if (countError != null) {
    return {
      ok: false,
      code: "DB_ERROR",
      message: `출석 조회 실패: ${countError.message}`,
    };
  }

  if ((count ?? 0) > 0) {
    return {
      ok: false,
      code: "ALREADY_CHECKED_IN",
      message: "오늘은 이미 출석 보상을 받았습니다.",
    };
  }

  const result = await applyCoinTransaction({
    userId,
    type: "EARN_ATTENDANCE",
  });

  if (result.ok) {
    return result;
  }

  return {
    ok: false,
    code:
      result.code === "ENV_MISSING" ? "ENV_MISSING" : "DB_ERROR",
    message: result.message,
  };
}
