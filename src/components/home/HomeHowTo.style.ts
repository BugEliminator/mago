import styled from "@emotion/styled";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  DESKTOP_MIN_WIDTH,
  LAYOUT_CONTENT_MAX_WIDTH,
  LAYOUT_PAGE_HORIZONTAL_PADDING,
} from "@/lib/layout/layout";

/** 히어로 아래 사용법 섹션 — 배경은 히어로 워프가 비치게 둔다 */
export const HowToRoot = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
  padding: 4rem ${LAYOUT_PAGE_HORIZONTAL_PADDING} 5rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 5.5rem 0 6rem;
  }
`;

export const HowToInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${LAYOUT_CONTENT_MAX_WIDTH};
  margin: 0 auto;
  gap: 1.5rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    gap: 2.75rem;
  }
`;

export const HowToHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  min-width: 0;
`;

/** 섹션 제목 — 히어로 「신비로운」과 같은 골드 그라데이션 (문장 전체 1회) */
export const HowToHeading = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.35;
  text-align: center;
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
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.3));

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 2rem;
  }
`;

export const HowToLead = styled.p`
  margin: 0 auto;
  max-width: 38rem;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.neutral.silver};
  word-break: keep-all;
  text-align: center;
`;

export const HowToTabList = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  gap: 0.125rem;
  max-width: 100%;
  margin: 0.5rem auto 0;
  padding: 0.25rem;
  overflow-x: auto;
  border-radius: 0.75rem;
  background-color: #121a33;
  border: 1px solid #243044;
  box-sizing: border-box;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    justify-content: center;
    margin-top: 0.75rem;
  }
`;

export const HowToTab = styled.button<{ $active: boolean }>`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.75rem;
  background-color: ${({ $active }) => ($active ? "#0b132b" : "transparent")};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accent.gold : theme.colors.neutral.silver};
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  word-break: keep-all;
  cursor: pointer;

  svg {
    flex-shrink: 0;
    width: 1.125rem;
    height: 1.125rem;
  }

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;

    svg {
      width: 1.125rem;
      height: 1.125rem;
    }
  }
`;

/** 모바일에서 숨고 데스크톱에서만 보이는 칩 텍스트 */
export const HowToTabLabel = styled.span`
  display: none;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    display: inline;
  }
`;

/** 슬라이드 전환 영역 — motion 레이어가 겹쳐 재생 */
export const HowToSlideArea = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

/** 슬라이드를 겹쳐 쌓고, 가장 높은 패널 높이를 유지 */
export const HowToSlideStack = styled.div`
  display: grid;
  width: 100%;

  & > * {
    grid-area: 1 / 1;
    min-width: 0;
  }
`;

/** 이미지 + 텍스트를 한 덩어리로 배치 */
export const HowToSlidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: 3rem;
    align-items: center;
  }
`;

/** 슬라이드 전환 레이어 — stack grid 셀 안에서 opacity/x만 전환 */
const HowToSlideMotionBase = styled.div`
  width: 100%;
`;

export const HowToSlideMotion = motion(HowToSlideMotionBase);

/** 캡처 자리 — 홈 스크린샷(~2:1)에 맞춘 비율 */
export const HowToMedia = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 1;
  border-radius: 12px;
  border: 2px solid #243044;
  box-sizing: border-box;
  overflow: hidden;
`;

export const HowToMediaImage = styled(Image)`
  object-fit: cover;
`;

export const HowToCopy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    gap: 1rem;
  }
`;

/** 슬라이드 내 아이콘+라벨 배지 */
export const HowToStepBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;

  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent.gold};
  line-height: 1.2;

  svg {
    flex-shrink: 0;
    width: 1.125rem;
    height: 1.125rem;
  }
`;

/** Dot Indicator 컨테이너 */
export const HowToDotList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1.5rem 0 0;
  padding: 0;
`;

export const HowToDot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "2rem" : "0.5rem")};
  height: 0.5rem;
  border: none;
  border-radius: 999px;
  padding: 0;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.accent.gold : "#243044"};
  cursor: ${({ $active }) => ($active ? "default" : "pointer")};
  transition:
    width 0.3s ease,
    background-color 0.3s ease;

  &:hover:not([data-active="true"]) {
    background-color: #4a3a1a;
  }
`;

export const HowToCtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.accent.gold};
  color: #0b0e1a;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 0.9375rem;
    padding: 0.75rem 1.5rem;
  }
`;

export const HowToStepTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.neutral.white};
  word-break: keep-all;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 1.5rem;
  }
`;

export const HowToStepBody = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.neutral.silver};
  word-break: keep-all;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 1rem;
  }
`;

export const HowToDetailList = styled.ul`
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const HowToDetailItem = styled.li`
  position: relative;
  padding-left: 0.875rem;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.neutral.silver};
  word-break: keep-all;

  &::before {
    content: "";
    position: absolute;
    top: 0.5em;
    left: 0;
    width: 0.3125rem;
    height: 0.3125rem;
    border-radius: 999px;
    background-color: ${({ theme }) => theme.colors.accent.gold};
  }

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 0.875rem;
  }
`;
