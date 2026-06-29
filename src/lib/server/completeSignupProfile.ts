import { applyCoinTransaction } from "@/lib/server/applyCoinTransaction";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export type CompleteSignupProfileResult =
  | { ok: true }
  | { ok: false; code: "ENV_MISSING" | "DB_ERROR"; message: string };

/**
 * OTP 인증 완료 후 profiles 생성 + 가입 축하 보상(EARN_SIGNUP)
 * — auth.users INSERT 트리거 대신 앱에서 1회 처리 (이미 있으면 보상만 idempotent 확인)
 */
export async function completeSignupProfile(input: {
  userId: string;
  email: string;
  nickname: string;
}): Promise<CompleteSignupProfileResult> {
  const { userId, email, nickname } = input;
  const trimmedEmail = email.trim();
  const trimmedNickname = nickname.trim() || "신비로운 타로선생";

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase Admin 설정 오류";
    return { ok: false, code: "ENV_MISSING", message };
  }

  const { count: signupBonusCount, error: bonusCheckError } = await admin
    .from("coin_histories")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("type", "EARN_SIGNUP");

  if (bonusCheckError != null) {
    return {
      ok: false,
      code: "DB_ERROR",
      message: `가입 보상 조회 실패: ${bonusCheckError.message}`,
    };
  }

  if ((signupBonusCount ?? 0) > 0) {
    return { ok: true };
  }

  const { data: existingProfile, error: profileFetchError } = await admin
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (profileFetchError != null) {
    return {
      ok: false,
      code: "DB_ERROR",
      message: `프로필 조회 실패: ${profileFetchError.message}`,
    };
  }

  if (existingProfile == null) {
    const { error: insertError } = await admin.from("profiles").insert({
      id: userId,
      email: trimmedEmail,
      nickname: trimmedNickname,
      coin: 0,
    });

    if (insertError != null) {
      return {
        ok: false,
        code: "DB_ERROR",
        message: `프로필 생성 실패: ${insertError.message}`,
      };
    }
  } else {
    const { error: updateError } = await admin
      .from("profiles")
      .update({
        email: trimmedEmail,
        nickname: trimmedNickname,
      })
      .eq("id", userId);

    if (updateError != null) {
      return {
        ok: false,
        code: "DB_ERROR",
        message: `프로필 갱신 실패: ${updateError.message}`,
      };
    }
  }

  const coinResult = await applyCoinTransaction({
    userId,
    type: "EARN_SIGNUP",
  });

  if (!coinResult.ok) {
    return {
      ok: false,
      code: "DB_ERROR",
      message: coinResult.message,
    };
  }

  return { ok: true };
}
