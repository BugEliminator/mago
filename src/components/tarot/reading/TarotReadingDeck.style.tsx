import styled from "@emotion/styled";
import Image from "next/image";
import { css, keyframes } from "@emotion/react";
import { RefreshCw } from "lucide-react";
import { MOBILE_MAX_WIDTH } from "@/lib/layout";

const GOLD = "#EAB865";
const GOLD_SOFT = "#F2CC88";
const INK = "#0A0B0E";

/** 덱 모드 모바일 — 남는 세로 공간만 차지(버튼 영역과 flex로 분배) */
const DECK_MODE_MOBILE_STAGE_LAYOUT = css`
  flex: 1 1 0;
  width: 100%;
  min-height: 17.9375rem;
  max-height: 46.875rem;
  height: auto;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/** 덱 무대 + 하단 액션 버튼 래퍼 */
export const DeckOuter = styled.div<{ $spreadViewportFill?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: ${({ $spreadViewportFill }) =>
    $spreadViewportFill ? "0" : "1.25rem"};
  ${({ $spreadViewportFill }) =>
    $spreadViewportFill
      ? `
    flex: 1 1 0;
    align-self: stretch;
    min-height: 0;
    padding-bottom: 0;
  `
      : `
    @media (max-width: ${MOBILE_MAX_WIDTH}) {
      flex: 1 1 0;
      align-self: stretch;
      min-height: 0;
      justify-content: flex-end;
      gap: 0.5rem;
      padding-bottom: max(0.5rem, env(safe-area-inset-bottom, 0px));
      box-sizing: border-box;
    }

    @media (max-width: ${MOBILE_MAX_WIDTH}) and (max-height: 700px) {
      gap: 0.375rem;
      padding-bottom: max(0.375rem, env(safe-area-inset-bottom, 0px));
    }
  `}
`;

/**
 * 스프레드 전용 — 세로로 남는 공간까지 확장해 네이티브 가로 스크롤바가 영역 최하단에 붙습니다.
 * 카드가 매우 길면 세로도 같은 컨테이너에서 스크롤합니다.
 */
export const SpreadScrollArea = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  overflow-y: auto;
  overscroll-behavior-x: auto;
  overscroll-behavior-y: auto;
  -webkit-overflow-scrolling: touch;
`;

/** 가로 스크롤 폭 = 덱 무대 폭, 아래는 빈 세로 공간으로 채움 */
export const SpreadScrollBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 0;
  width: max-content;
  min-width: 100%;
`;

/** 무대를 가로 중앙 정렬 */
export const SpreadDeckAlign = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
`;

/** 스크롤바 위까지 빈 세로 구역 — 스크롤바를 시각적 하단으로 밀어 올림 */
export const SpreadScrollTail = styled.div`
  flex: 1 1 auto;
  min-height: 0;
`;

export const DeckStage = styled.div<{
  $isDeckMode: boolean;
  $spreadMinHeightPx: number;
  $spreadMinWidthPx: number;
}>`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  ${({ $isDeckMode, $spreadMinHeightPx, $spreadMinWidthPx }) =>
    $isDeckMode
      ? css`
          height: 46.875rem;
          min-height: 46.875rem;

          @media (max-width: ${MOBILE_MAX_WIDTH}) {
            ${DECK_MODE_MOBILE_STAGE_LAYOUT}
          }
        `
      : css`
          min-height: ${$spreadMinHeightPx}px;
          min-width: ${$spreadMinWidthPx}px;
          height: auto;
          padding-bottom: 0;
        `}
`;

/**
 * 스프레드 진입 시 무대 높이가 덱보다 커져도 카드 덩어리가 같은 화면 높이에 머무르도록
 * 짧게 위로 올렸다가(`$spreadLiftPx`) 해제합니다.
 */
export const CardsLayer = styled.div<{
  $spreadLiftPx: number;
  /** true면 리프트 해제 시 transform 전환 적용 */
  $spreadLiftMotion: boolean;
}>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform: translateY(${({ $spreadLiftPx }) => `${-$spreadLiftPx}px`});
  transition: ${({ $spreadLiftMotion }) =>
    $spreadLiftMotion
      ? "transform 1050ms cubic-bezier(0.22, 1, 0.36, 1)"
      : "none"};
`;

/** 스프레드에서 선택 가능할 때 pose duration 무시하고 쓰는 호버 전환(ms) */
const SPREAD_INTERACTION_TRANSITION_MS = 220;

export const CardSlot = styled.button<{
  $x: number;
  $y: number;
  $rotateDeg: number;
  $scale: number;
  $zIndex: number;
  $durationMs: number;
  $delayMs: number;
  $isDisabled: boolean;
  /** 스프레드에서 탐색 호버 */
  $spreadHover: boolean;
  /** 모달 확인 후 — 호버와 같은 밝기·리프트로 스프레드에 고정 표시 */
  $committedPick: boolean;
  /** 스프레드 레이아웃일 때 터치 스크롤이 카드 버튼에 막히지 않도록 */
  $spreadPanScroll: boolean;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10.625rem; /* 170px */
  height: 17.9375rem; /* 287px */
  border-radius: 0.75rem;
  border: 1.5px solid ${GOLD};
  background: transparent;
  padding: 0;
  margin: 0;
  appearance: none;
  transform: ${({ $x, $y, $rotateDeg, $scale }) =>
    `translate3d(calc(-50% + ${$x}px), calc(-50% + ${$y}px), 0) rotate(${$rotateDeg}deg) scale(${$scale})`};
  transition-property: transform, box-shadow, border-color, filter;
  transition-duration: ${({ $durationMs, $spreadHover }) =>
    $spreadHover ? `${SPREAD_INTERACTION_TRANSITION_MS}ms` : `${$durationMs}ms`};
  transition-delay: ${({ $delayMs, $spreadHover }) =>
    $spreadHover ? `0ms` : `${$delayMs}ms`};
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  z-index: ${({ $zIndex }) => $zIndex};
  pointer-events: ${({ $isDisabled, $committedPick }) =>
    $isDisabled || $committedPick ? "none" : "auto"};
  cursor: ${({ $isDisabled, $committedPick }) =>
    $isDisabled || $committedPick ? "default" : "pointer"};
  ${({ $spreadPanScroll }) =>
    $spreadPanScroll
      ? `
    touch-action: manipulation;
  `
      : ""}

  box-shadow: none;

  ${({ $committedPick, $x, $y, $rotateDeg, $scale }) =>
    $committedPick
      ? `
    border-color: ${GOLD_SOFT};
    filter: brightness(1.05);
    box-shadow:
      0 10px 25px -5px #0A0A0A,
      0 0 12px #EAB865,
      inset 0 0 0 1px #FFF8E6,
      0 0 20px #FFFFFF,
      0 0 40px #F0F0F0;
    transform: translate3d(calc(-50% + ${$x}px), calc(-50% + ${$y}px - 10px), 0) rotate(${$rotateDeg}deg) scale(${$scale});
  `
      : ""}

  &:focus-visible {
    outline: 2px solid ${GOLD_SOFT};
    outline-offset: 3px;
  }

  &:hover:not(:disabled) {
    ${({
      $spreadHover,
      $committedPick,
      $x,
      $y,
      $rotateDeg,
      $scale,
    }) =>
      $spreadHover && !$committedPick
        ? `
      transition:
        transform ${SPREAD_INTERACTION_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow ${SPREAD_INTERACTION_TRANSITION_MS}ms ease,
        border-color ${SPREAD_INTERACTION_TRANSITION_MS}ms ease,
        filter ${SPREAD_INTERACTION_TRANSITION_MS}ms ease;
      transform: translate3d(calc(-50% + ${$x}px), calc(-50% + ${$y}px - 10px), 0) rotate(${$rotateDeg}deg) scale(${$scale});
      border-color: ${GOLD_SOFT};
      filter: brightness(1.05);
      box-shadow:
        0 10px 25px -5px #0A0A0A,
        0 0 12px #EAB865,
        inset 0 0 0 1px #FFF8E6,
        0 0 20px #FFFFFF,
        0 0 40px #F0F0F0;
    `
        : `
      border-color: ${GOLD_SOFT};
      filter: brightness(1.03);
    `}
  }

  @media (prefers-reduced-motion: reduce) {
    ${({ $committedPick, $x, $y, $rotateDeg, $scale }) =>
      $committedPick
        ? `
      transform: translate3d(calc(-50% + ${$x}px), calc(-50% + ${$y}px), 0) rotate(${$rotateDeg}deg) scale(${$scale});
    `
        : ""}

    &:hover:not(:disabled) {
      ${({ $spreadHover, $committedPick, $x, $y, $rotateDeg, $scale }) =>
        $spreadHover && !$committedPick
          ? `
        transition: box-shadow ${SPREAD_INTERACTION_TRANSITION_MS}ms ease, border-color ${SPREAD_INTERACTION_TRANSITION_MS}ms ease, filter ${SPREAD_INTERACTION_TRANSITION_MS}ms ease;
        transform: translate3d(calc(-50% + ${$x}px), calc(-50% + ${$y}px), 0) rotate(${$rotateDeg}deg) scale(${$scale});
        border-color: ${GOLD_SOFT};
        filter: brightness(1.05);
        box-shadow:
          0 10px 25px -5px #0A0A0A,
          0 0 12px #EAB865,
          inset 0 0 0 1px #FFF8E6,
          0 0 20px #FFFFFF,
          0 0 40px #F0F0F0;
      `
          : `
        border-color: ${GOLD_SOFT};
        filter: brightness(1.03);
      `}
    }
  }

  &:disabled {
    opacity: 1;
  }
`;

export const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  background: ${INK};
`;

export const CardBackImage = styled(Image)`
  object-fit: cover;
`;

export const CardBackSurface = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(/image/cards/classic/back.png);
  background-size: cover;
  background-position: center;
`;

/** Lucide 아이콘은 알 수 없는 prop을 svg로 그대로 넘기므로 `$isShuffling`은 DOM으로 전달되면 안 됨 */
export const StyledRefreshIcon = styled(RefreshCw, {
  shouldForwardProp: (prop) => prop !== "$isShuffling",
})<{ $isShuffling: boolean }>`
  ${({ $isShuffling }) =>
    $isShuffling
      ? css`
          animation: ${spin} 1s linear infinite;
        `
      : css`
          animation: none;
        `}
`;

export const CardGoldFrame = styled.div`
  position: absolute;
  inset: 0.25rem;
  border: 1px solid #3D321E;
  border-radius: 0.625rem;
  pointer-events: none;
`;

export const CardSheen = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #FFFFFF 0%, #000000 70%);
  opacity: 0.06;
  pointer-events: none;
`;

export const DeckActions = styled.div`
  position: relative;
  flex-shrink: 0;
  display: flex;
  gap: 1.25rem;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  z-index: 30;
  margin-bottom: 0;
  padding-bottom: 0;

  @media (max-width: ${MOBILE_MAX_WIDTH}) {
    width: 100%;
    gap: 0.625rem;
    flex-wrap: nowrap;
    padding: 0 0.5rem;
    box-sizing: border-box;
  }

  @media (max-width: ${MOBILE_MAX_WIDTH}) and (max-height: 700px) {
    gap: 0.5rem;
    padding: 0 0.375rem;
  }
`;

export const ActionButton = styled.button<{ $isPrimary?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.875rem 1.5rem;
  border-radius: 999px;
  background: ${({ $isPrimary }) => ($isPrimary ? "#151829" : "transparent")};
  border: 1px solid ${({ $isPrimary }) => ($isPrimary ? GOLD : "#3D321E")};
  color: ${GOLD};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    transform 120ms ease,
    border-color 150ms ease,
    filter 150ms ease;

  &:hover:not(:disabled) {
    border-color: ${GOLD_SOFT};
    filter: brightness(1.04);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  @media (max-width: ${MOBILE_MAX_WIDTH}) {
    flex: 1 1 0;
    min-width: 0;
    padding: 1rem;
    font-size: 0.725rem;
    letter-spacing: 0.2em;
  }
`;

export const ActionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  text-align: center;
`;

export const SelectionHint = styled.div`
  margin-top: 0.75rem;
  color: #DCC9A8;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  text-align: center;
  opacity: 0.9;
`;

