/** signUp 1단계 — 이미 가입된 이메일(인증 완료) */
export const SIGNUP_EMAIL_ALREADY_REGISTERED_TOAST =
  "이미 가입하신 이메일입니다.";

/** 탈퇴 후 14일 재가입 쿨다운 */
export const SIGNUP_WITHDRAW_COOLDOWN_TOAST_TITLE =
  "탈퇴 후 14일이 지나야 재가입할 수 있습니다.";

export function formatSignupWithdrawCooldownDescription(
  daysUntilEligible: number,
): string {
  const days = Math.max(1, daysUntilEligible);
  return `이전에 탈퇴한 이력이 있습니다.`;
}

type SignUpUserIdentities = {
  identities?: readonly { id: string }[] | null;
};

/**
 * signUp이 error 없이 성공했지만 실제로는 기가입 이메일인 경우
 * (Supabase 열거 방지 — identities 빈 배열, 메일·users row 없음)
 */
export function isSignupObfuscatedExistingUser(
  user: SignUpUserIdentities | null | undefined,
): boolean {
  if (user == null) return false;
  const identities = user.identities;
  return Array.isArray(identities) && identities.length === 0;
}

/**
 * Supabase signUp 에러 메시지가 이미 등록된 이메일인지 판별
 */
export function isSignupEmailAlreadyRegisteredMessage(
  message: string,
): boolean {
  const m = message.trim();
  return (
    /already registered/i.test(m) ||
    /already been registered/i.test(m) ||
    /email address has already been registered/i.test(m) ||
    /user already registered/i.test(m) ||
    /user already exists/i.test(m)
  );
}

export type SignupAuthErrorAction =
  | { kind: "toast"; message: string; description?: string }
  | { kind: "banner"; message: string };

/**
 * signUp 실패 메시지 → 토스트 또는 배너 표시 방식
 * null이면 원문을 배너에 그대로 표시
 */
export function resolveSignupAuthError(
  message: string,
): SignupAuthErrorAction | null {
  const trimmed = message.trim();
  if (trimmed.length === 0) return null;

  if (isSignupEmailAlreadyRegisteredMessage(trimmed)) {
    return { kind: "toast", message: SIGNUP_EMAIL_ALREADY_REGISTERED_TOAST };
  }

  if (
    /rate limit/i.test(trimmed) ||
    /too many requests/i.test(trimmed) ||
    /over_email_send_rate_limit/i.test(trimmed)
  ) {
    return {
      kind: "toast",
      message: "요청이 너무 많습니다.",
      description: "잠시 후 다시 시도해 주세요.",
    };
  }

  if (
    /invalid email/i.test(trimmed) ||
    /unable to validate email/i.test(trimmed)
  ) {
    return { kind: "toast", message: "올바른 이메일 형식이 아닙니다." };
  }

  return null;
}
