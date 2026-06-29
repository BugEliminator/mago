import styled from "@emotion/styled";
import {
  DESKTOP_MIN_WIDTH,
  LAYOUT_CONTENT_MAX_WIDTH,
  LAYOUT_PAGE_HORIZONTAL_PADDING,
} from "@/lib/layout";

/** 전체 랜딩 루트 — 배경은 `WarpSpeedBackground`가 뷰포트 전체 fixed, 높이는 콘텐츠 기준 */
export const LandingRoot = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  color: #e2e8f0;
  z-index: 1;
`;

/**
 * 메인 콘텐츠 — 세로 스택(상단 카드 → 텍스트 → 하단 카드) 래퍼
 */
export const HeroMain = styled.main`
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 7rem ${LAYOUT_PAGE_HORIZONTAL_PADDING} 2rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding-top: 3rem;
    padding-bottom: 2.5rem;
  }
`;

/**
 * 헤더와 같은 폭의 세로 열 — 상단 카드 / 텍스트 / 하단 카드 순서
 */
export const HeroDeckFrame = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: ${LAYOUT_CONTENT_MAX_WIDTH};
  margin: 0 auto;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    gap: 2.5rem;
  }
`;

/** 중앙 카피 */
export const HeroCopy = styled.div<{ $visible: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 56rem;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(20px)"};
  transition:
    opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const HeroTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  /* 모바일: 고정 1.5rem, 데스크톱: 고정 3.25rem — vw 제거로 리사이즈 뭉개짐 방지 */
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.2;
  margin: 0;
  word-break: keep-all;
  overflow-wrap: break-word;

  @media (min-width: 641px) {
    font-size: 3.25rem;
    margin-bottom: 0;
  }
`;

export const Highlight = styled.span`
  font-weight: 600;
  color: transparent;
  background-image: linear-gradient(
    90deg,
    #fde047 0%,
    #d4af37 45%,
    #b45309 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.3));
`;

/**
 * 덱 피벗 — 상단은 프레임 오른쪽, 하단은 왼쪽 끝
 * 카드 스프레드는 내부 absolute + translateX 유지
 */
export const DeckAnchor = styled.div<{ $placement: "top" | "bottom" }>`
  position: relative;
  flex-shrink: 0;
  width: 8.125rem; /* 130px — 모바일 */
  height: 13.75rem; /* 220px */

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    width: 9.75rem; /* 156px */
    height: 16.5rem; /* 264px */
  }

  ${({ $placement }) =>
    $placement === "top"
      ? `
    align-self: flex-end;
  `
      : `
    align-self: flex-start;
  `}
`;
