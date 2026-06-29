import styled from "@emotion/styled";
import {
  cosmicBackgroundViewportCss,
  COSMIC_BACKGROUND_BASE,
} from "./cosmicBackgroundViewport";

/**
 * 랜딩 전용 워프 캔버스 — 뷰포트 전체 고정
 */
export const WarpLayerRoot = styled.div`
  ${cosmicBackgroundViewportCss}
  overflow: hidden;
  background: ${COSMIC_BACKGROUND_BASE};
`;

export const WarpCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
`;
