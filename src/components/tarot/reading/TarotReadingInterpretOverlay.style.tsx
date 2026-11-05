import styled from "@emotion/styled";
import { motion } from "framer-motion";

/** 문구 길이가 달라져도 프로그레스바 위치가 움직이지 않게 합니다. */
export const StageMessageViewport = styled.span`
  min-height: 3.3em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StageMessage = styled(motion.span)`
  display: block;
`;

export const ProgressWrap = styled.div`
  width: min(20rem, 72vw);
  margin-top: 1.25rem;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 0.375rem;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.accent.gold} 18%,
    transparent
  );
  box-shadow: inset 0 0 0 1px
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.accent.gold} 12%,
      transparent
    );
`;

export const ProgressFill = styled(motion.div)`
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.accent.gold},
    #ffc34d
  );
  box-shadow:
    0 0 0.625rem
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.accent.gold} 70%,
        transparent
      ),
    0 0 1.125rem
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.accent.gold} 35%,
        transparent
      );
`;
