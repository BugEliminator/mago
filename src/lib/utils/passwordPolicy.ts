/**
 * MAGO 공통 비밀번호 정책
 * — 회원가입·비밀번호 재설정·프로필 변경 모두 이 규칙을 따름
 */
export const PASSWORD_MIN_LENGTH = 8;

/** 영문 + 숫자 둘 다 포함 여부 검사 */
export function isPasswordStrong(pw: string): boolean {
  return pw.length >= PASSWORD_MIN_LENGTH && /[A-Za-z]/.test(pw) && /\d/.test(pw);
}

/** 사용자에게 보여줄 규칙 설명 문구 */
export const PASSWORD_POLICY_DESC =
  `${PASSWORD_MIN_LENGTH}자 이상의 영문과 숫자를 함께 포함해야 합니다.`;
