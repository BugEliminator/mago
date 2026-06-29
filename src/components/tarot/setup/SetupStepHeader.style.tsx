import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { motion } from "framer-motion";

/* --- 상단 고정: 닫기 + 스텝퍼 --- */

/** X(위) + 스텝퍼(아래) 세로 배치 */
export const StepHeaderFixedZone = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-shrink: 0;
  gap: 0.625rem;
  overflow: visible;
`;

/** 메인으로 나가기 — Lucide X */
export const StepHeaderCloseButton = styled.button`
  flex: none;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0.125rem 0;
  border: none;
  background: transparent;
  color: #a8b0c4;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover:not(:disabled) {
    color: #f5f6fa;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

/* --- 스텝퍼 --- */

/** 트랙·프로gress 풀 width + 라벨 여유 공간 */
export const StepperShell = styled.div`
  position: relative;
  width: 100%;
  margin: 0 0 1.625rem;
  overflow: visible;
`;

/** 원·라벨 — 좌우 inset으로 STEP 1·3 잘림 방지 */
export const StepperRow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: clamp(0.75rem, 4vw, 1.125rem);
  box-sizing: border-box;
`;

/** 첫·마지막 원 중심 사이 — 바깥 삐져나온 선 제거 */
export const StepperLineWrap = styled.div`
  position: absolute;
  left: calc(clamp(0.75rem, 4vw, 1.125rem) + 0.4375rem);
  right: calc(clamp(0.75rem, 4vw, 1.125rem) + 0.4375rem);
  top: 50%;
  height: 2px;
  transform: translateY(-50%);
  pointer-events: none;
`;

export const StepperTrack = styled.div`
  position: absolute;
  inset: 0;
  background: #31384d;
`;

export const StepperProgress = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #d4af37;
  box-shadow: 0 0 8px #6d5817;
`;

export const StepperItem = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const stepperActivePulse = keyframes`
  0%,
  100% {
    opacity: 0.35;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.2);
  }
`;

export const StepperDot = styled.div<{ $active: boolean; $complete: boolean }>`
  position: relative;
  width: ${({ $active }) => ($active ? "1.125rem" : "0.875rem")};
  height: ${({ $active }) => ($active ? "1.125rem" : "0.875rem")};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid
    ${({ $active, $complete }) =>
      $active || $complete ? "#d4af37" : "#5a6175"};
  border-radius: 50%;
  background: ${({ $active, $complete }) =>
    $active || $complete ? "#d4af37" : "#1a1d23"};
  transition:
    width 250ms ease,
    height 250ms ease,
    background 250ms ease,
    border-color 250ms ease;

  ${({ $active }) =>
    $active &&
    css`
      &::after {
        content: "";
        position: absolute;
        inset: -0.3125rem;
        border-radius: 50%;
        border: 1px solid #d4af37;
        pointer-events: none;
        animation: ${stepperActivePulse} 1.8s ease-in-out infinite;
      }
    `}

  span {
    position: relative;
    z-index: 1;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background: #000000;
  }
`;

export const StepperLabel = styled.span<{ $active: boolean }>`
  position: absolute;
  top: 1.75rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: ${({ $active }) => ($active ? "#d4af37" : "#71798e")};
  white-space: nowrap;

  @media (max-width: 360px) {
    font-size: 0.5625rem;
    letter-spacing: 0.06em;
  }
`;

/* --- 헤더 문구 (고정 영역) --- */

export const StepHeaderRoot = styled.header`
  text-align: center;
  margin-bottom: 0.625rem;
  flex-shrink: 0;
`;

export const StepHeaderEyebrow = styled.p`
  margin: 0;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: #d4af37;
`;

export const StepHeaderTitle = styled.h2`
  margin: 0;
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #f5f6fa;
  word-break: keep-all;
  overflow-wrap: break-word;

  @media (max-width: 640px) {
    font-size: 1.125rem;
  }
`;

export const StepHeaderDescription = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.45;
  color: #a8b0c4;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

/** 설명 후반 구절 — 좁은 너비에서도 한 줄로 유지 */
export const StepHeaderDescriptionPhrase = styled.span`
  white-space: nowrap;
`;
