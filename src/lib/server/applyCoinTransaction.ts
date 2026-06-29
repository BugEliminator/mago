import {
  COIN_HISTORY_TITLES,
  getCoinAmountForType,
} from "@/lib/coinRewards";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import type {
  ApplyCoinTransactionResult,
  CoinHistoryType,
} from "@/types/coin";

export type ApplyCoinTransactionInput = {
  userId: string;
  type: CoinHistoryType;
  /** 결제 연동 전까지 null */
  sessionId?: string | null;
};

/**
 * coin_histories INSERT + profiles.coin 갱신
 * 소모 시 잔액 부족이면 INSUFFICIENT_BALANCE 반환
 */
export async function applyCoinTransaction(
  input: ApplyCoinTransactionInput,
): Promise<ApplyCoinTransactionResult> {
  const { userId, type, sessionId = null } = input;
  const amount = getCoinAmountForType(type);
  const title = COIN_HISTORY_TITLES[type];

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase Admin 설정 오류";
    return { ok: false, code: "ENV_MISSING", message };
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("coin")
    .eq("id", userId)
    .maybeSingle();

  if (profileError != null || profile == null) {
    return {
      ok: false,
      code: "DB_ERROR",
      message: "프로필을 찾을 수 없습니다.",
    };
  }

  const currentCoin =
    typeof profile.coin === "number" ? profile.coin : Number(profile.coin ?? 0);
  const nextCoin = currentCoin + amount;

  if (amount < 0 && nextCoin < 0) {
    return {
      ok: false,
      code: "INSUFFICIENT_BALANCE",
      message: "엽전이 부족합니다.",
    };
  }

  const { data: inserted, error: insertError } = await admin
    .from("coin_histories")
    .insert({
      user_id: userId,
      title,
      amount,
      type,
      session_id: sessionId,
    })
    .select("id")
    .single();

  if (insertError != null || inserted == null) {
    return {
      ok: false,
      code: "DB_ERROR",
      message: `코인 내역 저장 실패: ${insertError?.message ?? "unknown"}`,
    };
  }

  const { error: updateError } = await admin
    .from("profiles")
    .update({ coin: nextCoin })
    .eq("id", userId);

  if (updateError != null) {
    await admin.from("coin_histories").delete().eq("id", inserted.id);
    return {
      ok: false,
      code: "DB_ERROR",
      message: `잔액 갱신 실패: ${updateError.message}`,
    };
  }

  return {
    ok: true,
    newBalance: nextCoin,
    historyId: inserted.id as string,
  };
}
