import styled from "@emotion/styled";
import { DESKTOP_MIN_WIDTH, LAYOUT_CONTENT_MAX_WIDTH } from "@/lib/layout";
import { COSMIC_BACKGROUND_BASE } from "@/components/common/background/cosmicBackgroundViewport";

/**
 * ≥641px: 뷰포트보다 좁을 때 가로 스크롤 허용
 * ≤640px: 모바일 — 세로 스크롤만
 */
export const AppScrollRoot = styled.div`
  width: 100%;
  overflow-x: hidden;
  background-color: ${COSMIC_BACKGROUND_BASE};

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    overflow-x: auto;
  }
`;

/**
 * ≥641px: 1240px 고정 폭 — 컴포넌트가 줄어들지 않음
 * ≤640px: 100% 유동 (모바일 반응형)
 */
export const AppFixedFrame = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  min-width: 0;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    width: ${LAYOUT_CONTENT_MAX_WIDTH};
    min-width: ${LAYOUT_CONTENT_MAX_WIDTH};
    margin: 0 auto;
  }
`;
