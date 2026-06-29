/** 하단 nav 숨김 — 풀스크린·몰입 플로우 */
const HIDE_BOTTOM_NAV_EXACT = new Set([
  "/login",
  "/signup",
  "/forget-password",
  "/reset-password",
  "/auth/callback",
  "/tarot/setup",
  "/tarot/reading",
]);

const HIDE_BOTTOM_NAV_PREFIXES = ["/tarot/result/"] as const;

/**
 * 모바일 하단 nav 표시 여부
 */
export function shouldShowBottomNav(pathname: string): boolean {
  if (HIDE_BOTTOM_NAV_EXACT.has(pathname)) return false;
  if (HIDE_BOTTOM_NAV_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return false;
  }
  return true;
}
