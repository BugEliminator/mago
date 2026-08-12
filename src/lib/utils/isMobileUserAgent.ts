/**
 * User-Agent 기준 모바일 여부 — 서버에서 /mypage 허브 노출 분기용
 * (뷰포트는 클라이언트 matchMedia로 보완)
 */
export function isMobileUserAgent(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
    userAgent,
  );
}
