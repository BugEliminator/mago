import styled from "@emotion/styled";
import {
  cosmicBackgroundViewportCss,
  COSMIC_BACKGROUND_BASE,
} from "./cosmicBackgroundViewport";

/**
 * 야간/우주 풀스크린 배경 — 뷰포트 전체 고정
 */

export const SpaceLayerRoot = styled.div`
  ${cosmicBackgroundViewportCss}
  overflow: hidden;
`;

export const BaseFill = styled.div`
  position: absolute;
  inset: 0;
  background: ${COSMIC_BACKGROUND_BASE};
`;

export const DeepAuraLayer = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    #111827 0%,
    #05070a 45%,
    #000000 100%
  );
`;

export const StarfieldRoot = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

export const StarDot = styled.div<{
  $size: number;
  $top: number;
  $left: number;
  $duration: number;
  $delay: number;
}>`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  top: ${({ $top }) => $top}%;
  left: ${({ $left }) => $left}%;
  animation: spaceStarPulse 1.5s ease-in-out infinite;
  animation-duration: ${({ $duration }) => $duration}s;
  animation-delay: ${({ $delay }) => $delay}s;

  @keyframes spaceStarPulse {
    0%,
    100% {
      opacity: 0.35;
    }
    50% {
      opacity: 1;
    }
  }
`;
