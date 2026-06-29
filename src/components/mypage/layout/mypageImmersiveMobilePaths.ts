/** 마이페이지 모바일 풀크림 셸(우주 배경 숨김) 대상 경로 */
export const MYPAGE_IMMERSIVE_MOBILE_PATHS = new Set([
  "/mypage/history",
  "/mypage/profile",
  "/mypage/coins",
  "/mypage/inventory",
  "/mypage/inquiry",
  "/mypage/support",
]);

export function isMypageImmersiveMobilePath(pathname: string): boolean {
  return MYPAGE_IMMERSIVE_MOBILE_PATHS.has(pathname);
}
