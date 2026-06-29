/**
 * 헤더·랜딩 카드 덱 등 "메인 가로 박스"의 최대 너비
 * — 1400px대에서 약간 줄이면 동일한 12장 스프레드에서 step이 줄어 겹침이 늘어남
 */
export const LAYOUT_CONTENT_MAX_WIDTH = "1240px";

/** 페이지 본문 좌우 gutter — 결과·메인·마이페이지 공통 */
export const LAYOUT_PAGE_HORIZONTAL_PADDING = "1rem";

/** 1240 고정 셸·데스크톱 스프레드 계산용 px 값 */
export const LAYOUT_CONTENT_WIDTH_PX = 1240;

/** 랜딩 덱 카드 가로 px — ≤640px (8.125rem) */
export const LAYOUT_MOBILE_CARD_WIDTH_PX = 130;

/** 랜딩 덱 카드 가로 px — ≥641px (9.75rem, 13:22 비율) */
export const LAYOUT_DESKTOP_CARD_WIDTH_PX = 156;

/** 덱 스프레드 step(px) — 프레임 너비·카드 수 기준 (floor: 마지막 카드 border·글로우 클리핑 방지) */
export function calcLandingSpreadStepPx(
  frameWidthPx: number,
  cardWidthPx: number,
  deckCount: number,
): number {
  if (deckCount <= 1) return 0;
  return Math.floor(Math.max(0, (frameWidthPx - cardWidthPx) / (deckCount - 1)));
}

/** 12장·1240px 프레임 기준 고정 스프레드 step */
export const LAYOUT_DESKTOP_SPREAD_STEP_PX = calcLandingSpreadStepPx(
  LAYOUT_CONTENT_WIDTH_PX,
  LAYOUT_DESKTOP_CARD_WIDTH_PX,
  12,
);

/**
 * 마이페이지 본문 상단 offset — 고정 헤더 하단 + 간격
 * 헤더: top 2rem + (padding 1rem + 콘텐츠 2rem + padding 1rem) + gap 1.5rem
 */
export const MYPAGE_BELOW_HEADER_OFFSET = "calc(2rem + 4rem + 1.5rem)";

/** ≤640px : 모바일 레이아웃 */
export const MOBILE_MAX_PX = 640;
export const MOBILE_MAX_WIDTH = "640px";

/** ≥641px : 데스크톱 레이아웃 */
export const DESKTOP_MIN_PX = 641;
export const DESKTOP_MIN_WIDTH = "641px";
