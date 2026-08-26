import { normalizeSignupEmail } from "@/lib/auth/deletedUserCooldown";

/** 소셜 프로필에 이름이 없을 때 MAGO 기본 닉네임 */
export const DEFAULT_SOCIAL_NICKNAME = "신비로운 타로선생";

/** profiles.nickname 최대 길이 — 회원가입·프로필과 동일 */
export const SOCIAL_NICKNAME_MAX_LENGTH = 20;

export type SocialIdentity = {
  provider: string;
  identity_data?: Record<string, unknown> | null;
};

/** 문자열 후보 중 비어 있지 않은 첫 값 */
function firstNonEmptyString(values: readonly unknown[]): string | null {
  for (const value of values) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return null;
}

/** 카카오 identity가 하나라도 있는지 */
export function userHasKakaoIdentity(
  identities: ReadonlyArray<{ provider: string }> | null | undefined,
): boolean {
  return identities?.some((identity) => identity.provider === "kakao") === true;
}

/**
 * 카카오 로그인 이메일 — user.email이 비어 있으면 identity·메타데이터에서 읽는다.
 */
export function resolveKakaoEmail(input: {
  userEmail?: string | null;
  userMetadata?: Record<string, unknown> | null;
  identities?: ReadonlyArray<SocialIdentity> | null;
}): string | null {
  const kakaoIdentity = input.identities?.find(
    (identity) => identity.provider === "kakao",
  );
  const identityData = kakaoIdentity?.identity_data ?? {};
  const metadata = input.userMetadata ?? {};
  const picked = firstNonEmptyString([
    input.userEmail,
    identityData.email,
    metadata.email,
  ]);
  if (picked == null) return null;
  return normalizeSignupEmail(picked);
}

/** 이메일·비밀번호 identity가 있는지 — 소셜 전용 회원은 비밀번호 UI를 숨긴다 */
export function userHasEmailIdentity(
  identities: ReadonlyArray<{ provider: string }> | null | undefined,
): boolean {
  return identities?.some((identity) => identity.provider === "email") === true;
}

/**
 * 소셜 user_metadata·identity_data에서 MAGO 닉네임 후보를 고른다.
 * 없으면 기본 닉네임, 길면 20자로 자른다.
 */
export function resolveSocialNickname(input: {
  userMetadata: Record<string, unknown>;
  identities?: ReadonlyArray<SocialIdentity> | null;
}): string {
  const kakaoIdentity = input.identities?.find(
    (identity) => identity.provider === "kakao",
  );
  const identityData = kakaoIdentity?.identity_data ?? {};
  const picked = firstNonEmptyString([
    input.userMetadata.full_name,
    input.userMetadata.name,
    input.userMetadata.nickname,
    identityData.nickname,
    identityData.name,
  ]);
  if (picked == null) {
    return DEFAULT_SOCIAL_NICKNAME;
  }
  return picked.slice(0, SOCIAL_NICKNAME_MAX_LENGTH);
}
