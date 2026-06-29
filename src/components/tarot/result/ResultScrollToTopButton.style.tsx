import styled from "@emotion/styled";
import { DESKTOP_MIN_WIDTH } from "@/lib/layout";

/** 결과 페이지 — 우하단 맨 위로 이동 FAB */
export const ScrollToTopButton = styled.button`
  position: fixed;
  right: 1rem;
  bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral.white};
  background: ${({ theme }) => theme.colors.primary.blue};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition:
    opacity ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast},
    filter ${({ theme }) => theme.transitions.fast};

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    right: 1.5rem;
    bottom: 1.5rem;
    width: 3.25rem;
    height: 3.25rem;
  }

  &:hover {
    filter: brightness(1.08);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent.gold};
    outline-offset: 3px;
  }

  &:active {
    transform: scale(0.96);
  }
`;
