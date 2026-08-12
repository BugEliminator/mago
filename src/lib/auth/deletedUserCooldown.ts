/** 탈퇴 후 동일 이메일 재가입 대기 기간(일) */
export const DELETED_USER_SIGNUP_COOLDOWN_DAYS = 14;

export const DELETED_USER_SIGNUP_COOLDOWN_MS =
  DELETED_USER_SIGNUP_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

/** 가입·해시용 이메일 정규화 */
export function normalizeSignupEmail(email: string): string {
  return email.trim().toLowerCase();
}
