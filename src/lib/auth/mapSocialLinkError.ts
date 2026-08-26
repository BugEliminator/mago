/** linkIdentity·콜백 실패 메시지를 마이페이지용 한국어로 바꾼다 */
export function mapSocialLinkErrorMessage(message: string): string {
  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return "소셜 계정 연결에 실패했습니다.";
  }
  if (/manual linking/i.test(trimmed) || /linking is not enabled/i.test(trimmed)) {
    return "카카오 연동이 아직 허용되지 않았습니다.";
  }
  if (
    /identity_already_exists/i.test(trimmed) ||
    /already.{0,40}linked/i.test(trimmed) ||
    /already been registered/i.test(trimmed) ||
    /identity.*already/i.test(trimmed)
  ) {
    return "이미 다른 MAGO 계정에 연결된 카카오입니다.";
  }
  if (/access_denied/i.test(trimmed)) {
    return "카카오 연결을 취소했습니다.";
  }
  return trimmed;
}

/**
 * 주소창 search·hash에서 OAuth 실패 사유를 읽는다.
 * identity_already_exists는 해시로만 오는 경우가 많다.
 */
export function readBrowserOAuthError(): string | null {
  const href = window.location.href;
  const search = new URLSearchParams(window.location.search);
  const hashRaw = window.location.hash.replace(/^#/, "");
  const hash = new URLSearchParams(hashRaw);

  if (
    /identity_already_exists/i.test(href) ||
    /already linked to another user/i.test(href)
  ) {
    return "이미 다른 MAGO 계정에 연결된 카카오입니다.";
  }

  const searchError = search.get("error")?.trim() ?? "";
  if (searchError.length > 0 && /[가-힣]/.test(searchError)) {
    return searchError;
  }

  const hashError = hash.get("error")?.trim() ?? "";
  if (hashError.length > 0 && /[가-힣]/.test(hashError)) {
    return hashError;
  }

  const raw = [
    search.get("error_code"),
    search.get("error_description"),
    searchError,
    hash.get("error_code"),
    hash.get("error_description"),
    hashError,
    hashRaw,
  ]
    .filter((value): value is string => value != null && value.trim().length > 0)
    .join(" ");

  if (raw.trim().length === 0) return null;
  return mapSocialLinkErrorMessage(raw);
}

/**
 * OAuth 에러·연동 성공 쿼리/해시를 주소창에서 제거한다.
 * 같은 경로 router.replace는 해시를 안 지우는 경우가 있어 history를 쓴다.
 */
export function clearOAuthFeedbackFromUrl(): void {
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.delete("error");
  url.searchParams.delete("error_code");
  url.searchParams.delete("error_description");
  url.searchParams.delete("linked");
  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
}
