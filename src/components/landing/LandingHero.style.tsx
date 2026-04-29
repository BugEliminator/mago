import styled from "@emotion/styled";
import Link from "next/link";
import { LAYOUT_CONTENT_MAX_WIDTH } from "@/lib/layout";

/**
 * `Header` 와 동일한 가로 콘텐츠 폭 (`LAYOUT_CONTENT_MAX_WIDTH`)
 * — 카드 덱이 이 박스 좌/우 끝에 맞게 퍼짐
 */
export const HEADER_ALIGNED_FRAME_CSS = {
  width: "calc(100% - 4rem)",
  maxWidth: LAYOUT_CONTENT_MAX_WIDTH,
} as const;

/**
 * CTA 쉬인: component selector 는 @emotion/babel-plugin / swc plugin 없이 쓰면 런타임 에러가 남
 * — 부모에서 `.mago-landing-cta-shine` 으로만 타깃
 */
/** CTA 쉬인 요소 class — CtaButton 의 &:hover .${…}와 동일한 문자열이어야 함 */
export const CTA_SHINE_CLASS = "mago-landing-cta-shine" as const;

/** 전체 랜딩 루트 — 배경은 `WarpSpeedBackground` (맨 앞 absolute 레이어) */
export const LandingRoot = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  color: #e2e8f0;
`;

/** 메인 콘텐츠 — 워프 배경(z-0) 위에 쌓임 */
export const HeroMain = styled.main`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 7rem;
  padding-bottom: 2rem;
`;

/** 중앙 카피 + CTA */
export const HeroCopy = styled.div<{ $visible: boolean }>`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 1rem;
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
  font-size: clamp(1.5rem, 4.5vw, 3.25rem);
  font-weight: 300;
  line-height: 1.2;
  margin: 0 0 2rem;
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

export const CtaButton = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-decoration: none;
  color: #ffffff;
  overflow: hidden;
  background: linear-gradient(90deg, #d4af37 0%, #b45309 100%);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;

  &:hover {
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.6);
    transform: scale(1.05);
  }

  &:hover .${CTA_SHINE_CLASS} {
    transform: skewX(-12deg) translateX(100%);
  }
`;

export const CtaShine = styled.span`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.2);
  transform: skewX(-12deg) translateX(-100%);
  transition: transform 0.7s ease;
  pointer-events: none;
`;

/** 덱·피벗 배치: 헤더와 같은 폭의 열 */
export const HeroDeckFrame = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: ${HEADER_ALIGNED_FRAME_CSS.width};
  max-width: ${HEADER_ALIGNED_FRAME_CSS.maxWidth};
  transform: translateX(-50%);
  z-index: 0;
  pointer-events: none;
`;

/** 상단·하단 덱 앵커 — 프레임 오른쪽/왼쪽 끝에 붙여 행이 헤더 횡끝에 맞도록 */
export const DeckAnchor = styled.div<{ $placement: "top" | "bottom" }>`
  position: absolute;
  z-index: 0;
  width: 5.625rem;
  height: 9.375rem;
  pointer-events: auto;
  ${({ $placement }) =>
    $placement === "top"
      ? `
    top: 20%;
    right: 0;
  `
      : `
    bottom: 10%;
    left: 0;
  `}

  @media (min-width: 640px) {
    width: 8.125rem;
    height: 13.75rem;
  }
`;
