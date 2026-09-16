import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { DESKTOP_MIN_WIDTH } from "@/lib/layout/layout";

/** 헤더·하단탭(100) 위, 룬 로딩(200) 아래 */
export const CARD_DETAIL_OVERLAY_Z = 160;

export const CardDetailLayer = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: ${CARD_DETAIL_OVERLAY_Z};
`;

export const CardDetailBackdrop = styled.button`
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  border: none;
  background: #030407;
  opacity: 0.9;
  cursor: pointer;
`;

export const CardDetailStage = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const CARD_DETAIL_CHROME_PAD_TOP_DESKTOP = "4.5rem";
const CARD_DETAIL_CLOSE_TOP_MOBILE = "1rem";
const CARD_DETAIL_CLOSE_TOP_DESKTOP = "1.5rem";

/** 화살표는 여기에 두고, 카드·설명만 안쪽에서 슬라이드한다 */
export const CardDetailChrome = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    gap: 3rem;
    padding: ${CARD_DETAIL_CHROME_PAD_TOP_DESKTOP} 6rem 3rem;
  }
`;

/** 데스크톱에서 X와 다음 화살표를 한 열에 둔다 */
export const CardDetailRightRail = styled.div`
  display: contents;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    width: 3.5rem;
  }
`;

/** 슬라이드가 움직이는 영역 — 너비는 카드+설명을 따른다 */
export const CardDetailViewport = styled.div`
  position: relative;
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    max-width: 72rem;
  }
`;

/** 슬라이드 레이아웃 — motion은 아래에서 감싼다 */
const CardDetailSlideBase = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  box-sizing: border-box;
  padding: 4.5rem 1rem 2rem;
  overflow: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 2rem 1.5rem;
  }
`;

/** styled(motion) 대신 motion(styled) — AnimatePresence exit가 바로 언마운트되지 않게 */
export const CardDetailSlide = motion(CardDetailSlideBase);

export const CardDetailClose = styled.button`
  position: absolute;
  top: ${CARD_DETAIL_CLOSE_TOP_MOBILE};
  right: 1rem;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.accent.gold};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent.gold};
    outline-offset: 3px;
  }

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    top: calc(
      ${CARD_DETAIL_CLOSE_TOP_DESKTOP} - ${CARD_DETAIL_CHROME_PAD_TOP_DESKTOP}
    );
    right: auto;
    left: 50%;
    width: 3.25rem;
    height: 3.25rem;
    transform: translateX(-50%);
  }
`;

export const CardDetailNav = styled.button<{
  $side: "prev" | "next";
  $placement: "cluster" | "figure";
}>`
  z-index: 2;
  display: ${({ $placement }) => ($placement === "figure" ? "flex" : "none")};
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.accent.gold};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent.gold};
    outline-offset: 3px;
  }

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    display: ${({ $placement }) =>
      $placement === "cluster" ? "flex" : "none"};
    align-self: center;
    width: 3.5rem;
    height: 3.5rem;
  }
`;

/** Lucide 아이콘 크기 — 버튼 hit area와 분리 */
export const CardDetailIcon = styled.span`
  display: flex;
  pointer-events: none;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    svg {
      width: 1.75rem;
      height: 1.75rem;
    }
  }
`;

/** 카드와 설명 */
export const CardDetailCluster = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  min-width: 0;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    flex-direction: row;
    align-items: flex-start;
    gap: 3rem;
    width: 100%;
  }
`;

/** 모바일에서 카드와 화살표를 한 줄로 묶는다 */
export const CardDetailFigureRow = styled.div`
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 12.5rem) 2.75rem;
  justify-content: center;
  align-items: center;
  column-gap: 2.5rem;
  width: 100%;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    display: contents;
  }
`;

/** 전환 중 카드 너비를 유지하는 빈 칸 */
export const CardDetailFigureNavSlot = styled.div`
  width: 2.75rem;
  height: 2.75rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    display: none;
  }
`;

export const CardDetailFigureRoot = styled.div`
  flex: 0 0 auto;
  width: 100%;
  aspect-ratio: 170 / 287;
  overflow: visible;
  z-index: 1;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    width: 16.5rem;
  }
`;

export const CardDetailCopyRoot = styled.div`
  width: 100%;
  max-width: 28rem;
  min-width: 0;
  color: ${({ theme }) => theme.colors.neutral.silver};

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    flex: 1 1 auto;
    max-width: none;
  }
`;

export const CardDetailCopyTitle = styled.h2`
  margin: 0 0 1.25rem;
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.neutral.white};
  word-break: keep-all;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 1.5rem;
  }
`;

export const CardDetailSection = styled.section`
  margin: 0 0 1.5rem;
`;

export const CardDetailSectionLabel = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.accent.gold};
  word-break: keep-all;
`;

export const CardDetailChipList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
  padding: 0;
  list-style: none;
`;

export const CardDetailChip = styled.li`
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.625rem;
  border: 1px solid ${({ theme }) => theme.colors.accent.gold};
  border-radius: 999px;
  background: #1a1d27;
  color: ${({ theme }) => theme.colors.neutral.silver};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1.3;
  word-break: keep-all;
`;

export const CardDetailCopyBody = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1.7;
  word-break: keep-all;
`;

export const CardDetailPinLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

export const CardDetailPin = styled.span<{
  $x: number;
  $y: number;
}>`
  position: absolute;
  left: ${({ $x }) => `${$x}%`};
  top: ${({ $y }) => `${$y}%`};
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  transform: translate(-50%, -50%);
  border: 1.5px solid #eab865;
  border-radius: 999px;
  background: #030407;
  color: #eab865;
  font-size: 0.625rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1;
`;

export const CardDetailPinList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const CardDetailPinItem = styled.li`
  color: ${({ theme }) => theme.colors.neutral.silver};
`;

export const CardDetailPinHeading = styled.h3`
  margin: 0 0 0.375rem;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1.4;
  color: inherit;
  word-break: keep-all;
`;
