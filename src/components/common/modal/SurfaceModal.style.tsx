import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";

/** 상단 아이콘 글로우 — 연속적인 일렁임(최소~최대 폭을 좁혀 끊김 완화), 색은 `--icon-glow` */
const iconGlowBreath = keyframes`
  0% {
    box-shadow: 0 0 6px 0 var(--icon-glow), 0 0 22px 2px var(--icon-glow);
    animation-timing-function: ease-in-out;
  }
  25% {
    box-shadow: 0 0 7px 0 var(--icon-glow), 0 0 26px 3px var(--icon-glow);
    animation-timing-function: ease-in-out;
  }
  50% {
    box-shadow: 0 0 9px 1px var(--icon-glow), 0 0 31px 4px var(--icon-glow);
    animation-timing-function: ease-in-out;
  }
  75% {
    box-shadow: 0 0 7px 0 var(--icon-glow), 0 0 26px 3px var(--icon-glow);
    animation-timing-function: ease-in-out;
  }
  100% {
    box-shadow: 0 0 6px 0 var(--icon-glow), 0 0 22px 2px var(--icon-glow);
  }
`;

export const ModalLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
`;

export const ModalBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background: #000000;
  opacity: 0.78;
  backdrop-filter: blur(6px);
  cursor: pointer;
`;

const ModalPanelBase = styled.div`
  position: relative;
  width: min(100%, 22.5rem);
  padding: 2rem;
  border: 1px solid #6d5817;
  border-radius: 2rem;
  background: #1c2238;
  box-shadow: 0 1.5rem 4rem #030407;
  box-sizing: border-box;
  cursor: default;
`;

export const ModalPanel = motion(ModalPanelBase);

export const ModalTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
`;

/** `$accentColor` — 스텝 카테고리 포인트 컬러 등(없으면 기본 골드 테두리·아이콘·글로우) */
export const IconCircle = styled.div<{ $accentColor?: string }>`
  position: relative;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border: 1px solid
    ${({ $accentColor }) => ($accentColor != null ? $accentColor : "#6d5817")};
  border-radius: 50%;
  background: #252a3a;
  color: ${({ $accentColor }) => ($accentColor != null ? $accentColor : "#d4af37")};
  --icon-glow: ${({ $accentColor }) => ($accentColor != null ? $accentColor : "#d4af37")};
  /* 후광 숨쉬기 — 구간을 나눠 보간이 덜 각지게, 폭 차는 작게 유지 */
  animation: ${iconGlowBreath} 3.5s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    box-shadow: 0 0 6px 0 var(--icon-glow), 0 0 22px 2px var(--icon-glow);
  }
`;

export const ModalTitle = styled.h2`
  margin: 0 0 0.625rem;
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.35;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

/** 제목·본문 후반 구절 — 좁은 너비에서도 한 줄로 유지 */
export const ModalTitlePhrase = styled.span`
  white-space: nowrap;
`;

export const ModalDescription = styled.p`
  margin: 0;
  color: #a8b0c4;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.65;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

export const ModalBody = styled.div`
  margin-bottom: 1.875rem;
`;

export const NoticeBox = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1.125rem;
  border: 1px solid #353c50;
  border-radius: 1rem;
  background: #252d42;
  box-sizing: border-box;
`;

export const NoticeIcon = styled.div`
  flex: 0 0 auto;
  margin-top: 0.125rem;
  color: #d4af37;
`;

export const NoticeTextWrap = styled.div`
  min-width: 0;
`;

export const NoticeTitle = styled.p`
  margin: 0 0 0.375rem;
  color: #f5f6fa;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.55;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

export const NoticeDescription = styled.p`
  margin: 0;
  color: #858da3;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

export const CoinAmount = styled.strong`
  color: #d4af37;
  font-size: 0.9375rem;
  font-weight: 800;
`;

export const ActionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PrimaryButtonBase = styled.button`
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  border-radius: 1rem;
  background: linear-gradient(135deg, #1a237e 0%, #3f51b5 100%);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 0.75rem 1.75rem #12182f;
  transition:
    opacity 150ms ease,
    box-shadow 200ms ease;

  &:hover:not(:disabled) {
    box-shadow: 0 1rem 2.25rem #1a2250;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    box-shadow: none;
  }
`;

export const PrimaryButton = motion(PrimaryButtonBase);

const SecondaryButtonBase = styled.button`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid #3e475e;
  border-radius: 1rem;
  background: #252d42;
  color: #c8cdd8;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    border-color 200ms ease,
    color 200ms ease,
    opacity 150ms ease;

  &:hover:not(:disabled) {
    border-color: #d4af37;
    color: #ffffff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const SecondaryButton = motion(SecondaryButtonBase);
