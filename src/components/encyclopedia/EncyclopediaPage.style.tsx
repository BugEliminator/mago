import styled from "@emotion/styled";
import {
  DESKTOP_MIN_WIDTH,
  LAYOUT_CONTENT_MAX_WIDTH,
  LAYOUT_PAGE_HORIZONTAL_PADDING,
} from "@/lib/layout/layout";
import { HEADER_BAR_HEIGHT_MOBILE } from "@/components/layout/Header.style";

/** 패널 상단 타이틀·서브타이틀 */
export const EncyclopediaPanelHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  margin: 0 0 1.25rem;
  padding: 0 0.25rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    margin: 0 0 1.75rem;
    gap: 0.625rem;
  }
`;

export const EncyclopediaPanelTitle = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1.4;
  word-break: keep-all;
  color: transparent;
  background-image: linear-gradient(
    90deg,
    #fde047 0%,
    #d4af37 45%,
    #b45309 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 1.5rem;
  }
`;

export const EncyclopediaPanelSubtitle = styled.p`
  margin: 0;
  max-width: 36rem;
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.neutral.silver};
  word-break: keep-all;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 1rem;
  }
`;

/** 네뷸라 위 본문 레이어 */
export const EncyclopediaRoot = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100dvh;
  box-sizing: border-box;
  padding: calc(${HEADER_BAR_HEIGHT_MOBILE} + 1.5rem)
    ${LAYOUT_PAGE_HORIZONTAL_PADDING} 2rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    min-height: auto;
    padding: 2rem 0 3rem;
  }
`;

export const EncyclopediaMain = styled.main`
  width: 100%;
  max-width: ${LAYOUT_CONTENT_MAX_WIDTH};
  margin: 0 auto;
  overflow: clip;
  overflow-clip-margin: 3rem;
`;

/** 상단 묶음에만 쓰는 좌우 패딩 — 아래 그리드는 이 폭을 갭으로 씀 */
export const ENCYCLOPEDIA_PANEL_PAD_X_MOBILE = "1rem";
export const ENCYCLOPEDIA_PANEL_PAD_X_DESKTOP = "2.5rem";

/** 네뷸라가 비치는 본문 섹션 — 패널 배경 없음 */
export const EncyclopediaPanel = styled.section`
  width: 100%;
  box-sizing: border-box;
  padding: 1.5rem 0 1.75rem;
  background: transparent;
  overflow: visible;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 2rem 0 2.25rem;
  }
`;

/** 타이틀·상단 묶음만 좌우 여백 */
export const EncyclopediaPanelInset = styled.div`
  padding: 0 ${ENCYCLOPEDIA_PANEL_PAD_X_MOBILE};

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 0 ${ENCYCLOPEDIA_PANEL_PAD_X_DESKTOP};
  }
`;

/** 데스크톱 5열 / 모바일 가로 스크롤 */
export const CardBundleRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 640px) {
    justify-content: flex-start;
    align-items: flex-end;
    gap: 1.25rem;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x proximity;
    padding: 0.25rem 0.125rem 0.5rem;

    & > * {
      scroll-snap-align: start;
    }
  }
`;
