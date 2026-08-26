/** OAuth 콜백에서만 허용하는 복귀 경로 — 오픈 리다이렉트 방지 */
const ALLOWED_OAUTH_NEXT_PATHS: ReadonlySet<string> = new Set([
  "/mypage/profile",
]);

/**
 * `next` 쿼리를 안전한 앱 내부 경로만 통과시킨다.
 * 쿼리·외부 URL·프로토콜 상대 경로는 버린다.
 */
export function parseOAuthCallbackNext(raw: string | null): string | null {
  if (raw == null || raw.trim().length === 0) return null;

  let decoded = raw.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return null;
  }

  if (!decoded.startsWith("/") || decoded.startsWith("//")) return null;
  if (decoded.includes("://")) return null;

  const pathOnly = decoded.split("?")[0]?.split("#")[0] ?? "";
  if (!ALLOWED_OAUTH_NEXT_PATHS.has(pathOnly)) return null;
  return pathOnly;
}
