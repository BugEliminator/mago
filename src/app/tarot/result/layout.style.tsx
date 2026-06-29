import styled from "@emotion/styled";
import { COSMIC_BACKGROUND_BASE } from "@/components/common/background/cosmicBackgroundViewport";
import {
  HEADER_BAR_HEIGHT_MOBILE,
} from "@/components/layout/Header.style";
import { DESKTOP_MIN_WIDTH, LAYOUT_CONTENT_MAX_WIDTH } from "@/lib/layout";
import { theme } from "@/lib/theme";

const { typography, colors } = theme;

/**
 * 타로 결과 세그먼트 루트 — 배경·헤더·본문을 한 스택에서 관리
 * ≤640px: 세로 스크롤만 / ≥641px: 1240 고정 + 가로 스크롤 (메인 AppLayoutShell과 동일)
 */
export const TarotResultChrome = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: ${COSMIC_BACKGROUND_BASE};
  font-family: ${typography.fontFamily.primary};
  color: ${colors.neutral.black};

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    overflow-x: auto;
  }
`;

/** ≥641px: 1240px 고정 — 컴포넌트가 줄어들지 않음 */
export const TarotResultFixedFrame = styled.div`
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

/** SpaceBackground(z-index 0) 위에 헤더·본문 */
export const TarotResultStack = styled.div`
  position: relative;
  z-index: 1;
`;

/** fixed 스마트 헤더 아래 본문이 가려지지 않도록 (모바일 전용) */
export const ResultHeaderSpacer = styled.div`
  height: ${HEADER_BAR_HEIGHT_MOBILE};
  flex-shrink: 0;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    display: none;
  }
`;
