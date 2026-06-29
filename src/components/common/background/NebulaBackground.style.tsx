import styled from "@emotion/styled";
import { cosmicBackgroundViewportCss } from "./cosmicBackgroundViewport";

/**
 * 리딩 전용 성운 — 뷰포트 전체 고정
 */
export const NebulaLayerRoot = styled.div`
  ${cosmicBackgroundViewportCss}
  overflow: hidden;
  background-color: #000103;
  background-repeat: no-repeat;
`;
