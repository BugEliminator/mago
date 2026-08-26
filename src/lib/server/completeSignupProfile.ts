import { applyCoinTransaction } from "@/lib/server/applyCoinTransaction";
import { createSupabaseAdmin } from "@/lib/supabase/supabaseAdmin";
import { DEFAULT_SOCIAL_NICKNAME } from "@/lib/auth/socialNickname";

export type CompleteSignupProfileResult =
  | { ok: true }
  | { ok: false; code: "ENV_MISSING" | "DB_ERROR"; message: string };

/**
 * 가입 완료 후 profiles 생성 + 가입 축하 보상(EARN_SIGNUP)
 * — 이메일 OTP·카카오 첫 로그인 공용.
 * — 카카오 가입은 email을 넣지 않는다(합치기는 마이페이지 연동만).
 * — 이미 있으면 보상만 idempotent 확인
 */
export async function completeSignupProfile(input: {
  userId: string;
  email: string | null;
  nickname: string;
  /** true면 프로필이 있을 때 닉네임·메일을 덮어쓰지 않는다(카카오 콜백) */
  createIfMissing?: boolean;
}): Promise<CompleteSignupProfileResult> {
  const { userId, email, nickname, createIfMissing } = input;
  const trimmedEmail = email?.trim() ?? "";
  const emailToStore = trimmedEmail.length > 0 ? trimmedEmail : null;
  const trimmedNickname = nickname.trim() || DEFAULT_SOCIAL_NICKNAME;

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase Admin 설정 오류";
    return { ok: false, code: "ENV_MISSING", message };
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

  if (existingProfile != null && createIfMissing === true) {
    return { ok: true };
  }

  if (existingProfile == null) {
    const { error: insertError } = await admin.from("profiles").insert({
      id: userId,
      email: emailToStore,
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
    const profilePatch: { nickname: string; email?: string } = {
      nickname: trimmedNickname,
    };
    if (emailToStore != null) {
      profilePatch.email = emailToStore;
    }
    const { error: updateError } = await admin
      .from("profiles")
      .update(profilePatch)
      .eq("id", userId);

    if (updateError != null) {
      return {
        ok: false,
        code: "DB_ERROR",
        message: `프로필 갱신 실패: ${updateError.message}`,
      };
    }
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
