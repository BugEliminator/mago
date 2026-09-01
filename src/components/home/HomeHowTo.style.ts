import styled from "@emotion/styled";
import Image from "next/image";
import {
  DESKTOP_MIN_WIDTH,
  LAYOUT_CONTENT_MAX_WIDTH,
  LAYOUT_PAGE_HORIZONTAL_PADDING,
} from "@/lib/layout/layout";
import { COSMIC_BACKGROUND_BASE } from "@/components/common/background/cosmicBackgroundViewport";

/** 히어로 아래 사용법 섹션 — 워프 배경 위에 단색 패널 */
export const HowToRoot = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
  background-color: ${COSMIC_BACKGROUND_BASE};
  padding: 4rem ${LAYOUT_PAGE_HORIZONTAL_PADDING} 5rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 5.5rem 0 6rem;
  }
`;

export const HowToInner = styled.div`
  display: grid;
  width: 100%;
  max-width: ${LAYOUT_CONTENT_MAX_WIDTH};
  margin: 0 auto;
  grid-template-columns: minmax(0, 1fr) auto auto;
  grid-template-areas:
    "title prev next"
    "viewport viewport viewport";
  align-items: center;
  column-gap: 0.5rem;
  row-gap: 1.5rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      "title title title"
      "prev viewport next";
    column-gap: 1rem;
    row-gap: 2.75rem;
  }
`;

export const HowToHeader = styled.header`
  grid-area: title;
  min-width: 0;
`;

/** 섹션 제목 — 히어로 「신비로운」과 같은 골드 그라데이션 (문장 전체 1회) */
export const HowToHeading = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.35;
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

export const HowToViewport = styled.div`
  grid-area: viewport;
  overflow: hidden;
  width: 100%;
  min-width: 0;
`;

export const HowToTrack = styled.ol`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  touch-action: pan-y pinch-zoom;
  user-select: none;
`;

export const HowToItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-sizing: border-box;
  flex: 0 0 100%;
  min-width: 0;
  padding: 0rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: 3rem;
    align-items: center;
    padding: 0rem;
  }
`;

/** 캡처 자리 — 홈 스크린샷(~2:1)에 맞춘 비율, 찌그러짐 없이 여백 없음 */
export const HowToMedia = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 1;
  border-radius: 12px;
  // background-color: #0b132b;
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
  gap: 0.5rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    gap: 0.75rem;
  }
`;

export const HowToStepIndex = styled.span`
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.accent.gold};
`;

export const HowToStepTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
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
  margin: 0.25rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

export const HowToNavButton = styled.button<{ $side: "prev" | "next" }>`
  grid-area: ${({ $side }) => $side};
  justify-self: end;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.accent.gold};
  background-color: #0b132b;
  color: ${({ theme }) => theme.colors.accent.gold};

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }

  &:hover {
    background-color: #121a33;
  }

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    justify-self: center;
    width: 2.75rem;
    height: 2.75rem;

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
`;
