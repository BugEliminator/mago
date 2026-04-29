import styled from "@emotion/styled";

/**
 * 랜딩 전용 워프 캔버스 — `SpaceBackground`와 동일한 슬롯(absolute, z-0, 비포인터)
 */
export const WarpLayerRoot = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: #05070a;
`;

export const WarpCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
`;
