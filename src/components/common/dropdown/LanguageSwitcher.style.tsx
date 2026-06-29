import styled from "@emotion/styled";
import { motion } from "framer-motion";

export type LangSwitcherVariant = "header" | "form";

/** 드롭다운 기준점 (relative) */
export const LangSwitcherWrap = styled.div<{ $variant: LangSwitcherVariant }>`
  position: relative;
  width: ${({ $variant }) => ($variant === "form" ? "100%" : "auto")};
  flex-shrink: ${({ $variant }) => ($variant === "header" ? 0 : 1)};
`;

/** 트리거 버튼 — header: compact / form: full-width 다크 인풋 */
export const LangTriggerButton = styled.button<{
  $open: boolean;
  $variant: LangSwitcherVariant;
}>`
  width: ${({ $variant }) => ($variant === "form" ? "100%" : "auto")};
  height: ${({ $variant }) => ($variant === "form" ? "auto" : "2rem")};
  padding: ${({ $variant }) =>
    $variant === "form" ? "0.75rem" : "0 0.75rem"};
  border-radius: ${({ $variant }) =>
    $variant === "form" ? "0.5rem" : "0.625rem"};
  display: flex;
  align-items: center;
  justify-content: ${({ $variant }) =>
    $variant === "form" ? "space-between" : "flex-start"};
  gap: 0.375rem;
  border: 1px solid
    ${({ $open, $variant }) => {
      if ($variant === "form") {
        return $open ? "#3949ab" : "#1d2040";
      }
      return $open ? "#c5cae9" : "#e0e0e0";
    }};
  background: ${({ $open, $variant }) => {
    if ($variant === "form") return "#14172f";
    return $open ? "#e8eaf6" : "#ffffff";
  }};
  color: ${({ $open, $variant }) => {
    if ($variant === "form") return "#e2e4f0";
    return $open ? "#1a237e" : "#212121";
  }};
  font-size: ${({ $variant }) =>
    $variant === "form" ? "0.8125rem" : "0.6875rem"};
  font-weight: ${({ $variant }) => ($variant === "form" ? 400 : 600)};
  font-family: inherit;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
  box-shadow: ${({ $open, $variant }) =>
    $variant === "form" && $open ? "0 0 0 2px #3949ab22" : "none"};
  flex-shrink: ${({ $variant }) => ($variant === "header" ? 0 : 1)};
  white-space: ${({ $variant }) => ($variant === "header" ? "nowrap" : "normal")};
  transition:
    background 150ms ease,
    border-color 150ms ease,
    color 150ms ease,
    box-shadow 150ms ease;

  & > span {
    white-space: nowrap;
    flex-shrink: 0;
  }

  & > svg {
    flex-shrink: 0;
  }

  &:hover {
    ${({ $variant }) =>
      $variant === "form"
        ? `
      border-color: #3949ab;
    `
        : `
      background: #e8eaf6;
      border-color: #9fa8da;
      color: #1a237e;
    `}
  }
`;

/** 드롭다운 패널 — header: 아래 / form: 위 */
export const LangDropdownPanel = styled(motion.div)<{
  $variant: LangSwitcherVariant;
}>`
  position: absolute;
  right: ${({ $variant }) => ($variant === "form" ? "0" : "0")};
  left: ${({ $variant }) => ($variant === "form" ? "0" : "auto")};
  width: ${({ $variant }) => ($variant === "form" ? "100%" : "14rem")};
  ${({ $variant }) =>
    $variant === "form"
      ? `
    bottom: calc(100% + 0.5rem);
  `
      : `
    top: calc(100% + 0.5rem);
  `}
  background: #16182c;
  border: 1px solid #2c2f48;
  border-radius: 1rem;
  box-shadow: 0 8px 32px #000000;
  padding: 0.5rem;
  z-index: 200;
`;

export const LangDropdownHeader = styled.div`
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #25283c;
  margin-bottom: 0.375rem;
`;

export const LangDropdownLabel = styled.span`
  font-size: 0.5625rem;
  font-weight: 800;
  color: #5c5e72;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

/** 5개 언어 → max-height + 커스텀 스크롤 */
export const LangDropdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  max-height: 10.5rem;
  overflow-y: auto;
  padding-right: 0.375rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #2c2918;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #3d3820;
  }
`;

export const LangOptionButton = styled.button<{
  $active: boolean;
  $available: boolean;
}>`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.71875rem;
  font-weight: 500;
  font-family: inherit;
  border: none;
  cursor: ${({ $available }) => ($available ? "pointer" : "not-allowed")};
  background: ${({ $active }) => ($active ? "#222447" : "transparent")};
  color: ${({ $active, $available }) =>
    $active ? "#ffffff" : $available ? "#9e9e9e" : "#5c5e72"};
  transition:
    background 120ms ease,
    color 120ms ease;

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? "#222447" : "#1e203b")};
    color: #ffffff;
  }
`;

export const LangOptionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

/** 활성 인디케이터 도트 */
export const LangActiveDot = styled.span<{ $active: boolean }>`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#818cf8" : "transparent")};
  flex-shrink: 0;
`;

/** 준비 중 언어명 취소선 */
export const LangNameText = styled.span<{ $strikethrough: boolean }>`
  text-decoration: ${({ $strikethrough }) =>
    $strikethrough ? "line-through" : "none"};
`;

/** 준비 중 배지 */
export const LangComingSoonBadge = styled.span`
  font-size: 0.5312rem;
  font-weight: 800;
  color: #8f7a30;
  background: #1a1914;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  border: 1px solid #2a2718;
  letter-spacing: 0.02em;
`;
