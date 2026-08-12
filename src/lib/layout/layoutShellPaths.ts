/** 1240 고정 셸 없이 풀스크린·자체 레이아웃을 쓰는 경로 */

const FULLSCREEN_EXACT_PATHS = new Set([
  "/login",
  "/signup",
  "/forget-password",
  "/reset-password",
  "/auth/callback",
  "/tarot/setup",
  "/tarot/reading",
]);

const NESTED_LAYOUT_PREFIXES = ["/tarot/result/"] as const;

/**
 * ≥641px 1240 고정 셸(AppLayoutShell) 적용 여부
 */
export function shouldUseFixedLayoutShell(pathname: string): boolean {
  if (FULLSCREEN_EXACT_PATHS.has(pathname)) return false;
  if (NESTED_LAYOUT_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return false;
  }
  return true;
}
