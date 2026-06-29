import { applyCoinTransaction } from "@/lib/server/applyCoinTransaction";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ApplyReferrerRewardResult =
  | { ok: true; applied: true; newBalance: number }
  | { ok: true; applied: false }
  | { ok: false; code: "ENV_MISSING" | "DB_ERROR"; message: string };

/**
 * 가입 시 추천인 코드 처리 — 유효하지 않으면 가입은 유지하고 보상만 스킵 (옵션 A)
 * 성공 시 신규·추천인 각 +20, profiles.referrer_code 저장
 */
export async function applyReferrerReward(
  userId: string,
  referrerCodeRaw: string,
): Promise<ApplyReferrerRewardResult> {
  const referrerCode = referrerCodeRaw.trim();
  if (referrerCode.length === 0) {
    return { ok: true, applied: false };
  }

  if (!UUID_RE.test(referrerCode)) {
    return { ok: true, applied: false };
  }

  if (referrerCode === userId) {
    return { ok: true, applied: false };
  }

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase Admin 설정 오류";
    return { ok: false, code: "ENV_MISSING", message };
  }

  const { data: selfProfile, error: selfError } = await admin
    .from("profiles")
    .select("referrer_code")
    .eq("id", userId)
    .maybeSingle();

  if (selfError != null || selfProfile == null) {
    return {
      ok: false,
      code: "DB_ERROR",
      message: "프로필을 찾을 수 없습니다.",
    };
  }

  if (selfProfile.referrer_code != null) {
    return { ok: true, applied: false };
  }

  const { data: referrerProfile, error: referrerError } = await admin
    .from("profiles")
    .select("id")
    .eq("id", referrerCode)
    .maybeSingle();

  if (referrerError != null) {
    return {
      ok: false,
      code: "DB_ERROR",
      message: `추천인 조회 실패: ${referrerError.message}`,
    };
  }

  if (referrerProfile == null) {
    return { ok: true, applied: false };
  }

  const { data: updated, error: updateError } = await admin
    .from("profiles")
    .update({ referrer_code: referrerCode })
    .eq("id", userId)
    .is("referrer_code", null)
    .select("id")
    .maybeSingle();

  if (updateError != null) {
    return {
      ok: false,
      code: "DB_ERROR",
      message: `추천인 등록 실패: ${updateError.message}`,
    };
  }

  if (updated == null) {
    return { ok: true, applied: false };
  }

  const newUserReward = await applyCoinTransaction({
    userId,
    type: "EARN_REFERRER",
  });

  if (!newUserReward.ok) {
    await admin
      .from("profiles")
      .update({ referrer_code: null })
      .eq("id", userId);
    return {
      ok: false,
      code: "DB_ERROR",
      message: newUserReward.message,
    };
  }

  const referrerReward = await applyCoinTransaction({
    userId: referrerCode,
    type: "EARN_REFERRER",
  });

  if (!referrerReward.ok) {
    return {
      ok: false,
      code: "DB_ERROR",
      message: referrerReward.message,
    };
  }

  return {
    ok: true,
    applied: true,
    newBalance: newUserReward.newBalance,
  };
}
