import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { TAROT_CLASSIC_BACK_IMAGE_PATH } from "@/types/tarot";

/** AppLayoutShell 모바일 기준과 동일 — 이 이하에서 풀스크린 패널 */
const SETUP_MOBILE_MAX = "640px";

const setupMobileViewportHeight = `
  min-height: 100vh;
  min-height: 100dvh;
  height: 100vh;
  height: 100dvh;
`;

/** 우주 배경 래퍼 — 데스크톱·모바일 공통 (스텝 전환 시 배경 노출) */
export const SetupSpaceBackdrop = styled.div``;

/** 타로 설정 페이지 루트 — SpaceBackground 기준점 */
export const SetupPageRoot = styled.main`
  position: relative;
  min-height: 100vh;
  overflow: hidden;

  @media (max-width: ${SETUP_MOBILE_MAX}) {
    ${setupMobileViewportHeight}
  }
`;

/** 콘텐츠 레이어 — 카드 중앙 */
export const SetupContentLayer = styled.section`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: ${SETUP_MOBILE_MAX}) {
    ${setupMobileViewportHeight}
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0;
    padding-left: 0;
    align-items: center;
    justify-content: stretch;
    box-sizing: border-box;
  }
`;

/** 3D perspective 스테이지 */
export const CardStage = styled.div`
  position: relative;
  width: min(28rem, 86vw);
  height: min(44.8rem, 86vh);
  perspective: 2500px;
  overflow: visible;

  @media (max-width: ${SETUP_MOBILE_MAX}) {
    width: 100%;
    max-width: 28rem;
    height: 100%;
    max-height: 700px;
    margin-left: auto;
    margin-right: auto;
  }
`;

/** AnimatePresence용 카드 래퍼(슬라이드) */
const CardSlideBase = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

export const CardSlideShell = motion(CardSlideBase);

/** 앞·뒤 면 공통 — preserve-3d 자식 */
const CardFlipInnerBase = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
`;

export const CardFlipInner = motion(CardFlipInnerBase);

/** 카드 면 공통 — 노란 외곽 프레임 */
const CardFaceBase = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 1.125rem;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  padding: 0.75rem;
  border: 1.5px solid #eab865;
  box-sizing: border-box;

  @media (max-width: ${SETUP_MOBILE_MAX}) {
    padding: 0.5rem;
  }
`;

/** 앞면 외곽 프레임 */
export const CardFaceFront = styled(CardFaceBase)`
  background: #1c2238;
`;

/** 앞면 실제 패널 — 회색 내부 프레임
 * $visible: false일 때 opacity·pointer-events를 즉시 끄고,
 * true가 되면 플립 중간(330ms 지연)에 맞춰 부드럽게 나타납니다.
 * iOS backface-visibility 버그로 스텝바가 비치는 현상을 방지합니다. */
export const CardFrontPanel = styled.div<{ $visible?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  background: #1c2238;
  border: 1px solid #3d455c;
  border-radius: 0.75rem;
  box-sizing: border-box;
  overflow: hidden;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transition: ${({ $visible }) =>
    $visible ? "opacity 180ms ease 330ms" : "none"};

  @media (max-width: ${SETUP_MOBILE_MAX}) {
    padding: 1.25rem;
  }
`;

/** 스텝 본문 스크롤 영역 */
export const SetupStepScrollArea = styled.div`
  width: 100%;
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding-right: 0.125rem;

  &::-webkit-scrollbar {
    width: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #3d455c;
    border-radius: 999px;
  }
`;

/** 스텝 하단 고정 버튼 영역 */
export const SetupStepFooter = styled.div`
  flex-shrink: 0;
  width: 100%;
  padding-top: 0.75rem;
`;

/** 뒷면 외곽 프레임 */
export const CardFaceBack = styled(CardFaceBase)`
  transform: rotateY(180deg);
  background: #1b1b19;
  box-shadow: 0 32px 64px #030407;
`;

/** 뒷면 실제 패널 — 클래식 덱 이미지 */
export const CardBackPanel = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000000;
  background-image: url(${TAROT_CLASSIC_BACK_IMAGE_PATH});
  background-size: cover;
  background-position: center;
  border: 1px solid #4a3c24;
  border-radius: 0.75rem;
  box-sizing: border-box;
`;

/** 주요 액션 버튼 */
const ConfirmButtonBase = styled.button`
  width: 100%;
  max-width: 11.25rem;
  padding: 0.9375rem 1.25rem;
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  border: none;
  border-radius: 0.75rem;
  color: #f5f6fa;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 0 4px 20px #12182f;
  transition:
    opacity 150ms ease,
    box-shadow 200ms ease;

  &:hover:not(:disabled) {
    box-shadow: 0 6px 28px #1a2250;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    box-shadow: none;
  }
`;

export const ConfirmButton = motion(ConfirmButtonBase);

/** 단계 하단 액션 버튼 묶음 */
export const SetupActionRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const BackButtonBase = styled.button`
  width: 100%;
  max-width: 11.25rem;
  padding: 0.9375rem 1rem;
  background: #252d42;
  border: 1px solid #3e475e;
  border-radius: 0.75rem;
  color: #a8b0c4;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    border-color 200ms ease,
    color 200ms ease,
    opacity 150ms ease;

  &:hover:not(:disabled) {
    border-color: #d4af37;
    color: #f5f6fa;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const BackButton = motion(BackButtonBase);
