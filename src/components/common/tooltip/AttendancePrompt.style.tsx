import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import Link from "next/link";

/**
 * translateX(-50%)를 keyframe에도 포함해야 애니메이션 종료 후 transform이 유지됨.
 * to에서 translateY(0)만 쓰면 정적 translateX(-50%)가 덮어씌워짐.
 */
const fadeSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

/** 칩을 감싸는 relative 래퍼 */
export const PromptWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
`;

/** 말풍선 — 칩 아래 중앙 정렬 */
export const PromptBubble = styled(Link)`
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  white-space: nowrap;
  background: #212121;
  color: #fde047;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  text-decoration: none;
  z-index: 200;
  animation: ${fadeSlideIn} 300ms ease forwards;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: box-shadow 280ms ease;

  /* 위쪽 삼각형 — 중앙 */
  &::before {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 7px solid #212121;
  }

  &:hover {
    color: #fde047;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.4),
      0 0 14px rgba(234, 184, 101, 0.45),
      0 0 28px rgba(234, 184, 101, 0.2),
      0 0 18px rgba(255, 255, 255, 0.3);
  }

  &:active {
    color: #fde047;
  }
`;
