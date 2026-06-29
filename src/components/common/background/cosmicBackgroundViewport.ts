import { css } from "@emotion/react";

/**
 * 1240px 고정 셸·중앙 정렬 안에서도 우주 배경이 뷰포트 전체를 덮도록 함
 * — position: fixed 로 가로 여백(흰 띠) 방지
 */
export const cosmicBackgroundViewportCss = css`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

/** 우주 배경 베이스 톤 — 셸 바깥 여백·스크롤 트랙과 맞춤 */
export const COSMIC_BACKGROUND_BASE = "#05070a";
