import styled from "@emotion/styled";
import { motion } from "framer-motion";
import {
  CARD_FACE_FRAME_CLASS,
  tarotCardFaceOuterCss,
} from "@/components/common/card/TarotCardFaceShell.style";
import { DESKTOP_MIN_WIDTH } from "@/lib/layout/layout";

const FAN_EASE = "cubic-bezier(0.6, -0.05, 0.01, 0.99)";

/** 백과사전 묶음 카드 가로 — 170:287 비율 유지 */
export const CARD_BUNDLE_CARD_WIDTH_MOBILE = "7rem";
export const CARD_BUNDLE_CARD_WIDTH_DESKTOP = "8.5rem";

/** 카드 한 묶음 — 라벨 + 팬 */
export const CardBundleRoot = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  padding: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  flex: 1 1 0;
  min-width: 0;
  user-select: none;
  font-family: inherit;
  color: inherit;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent.gold};
    outline-offset: 4px;
    border-radius: 0.75rem;
  }

  @media (max-width: 640px) {
    flex: 0 0 auto;
  }
`;

export const CardBundleLabel = styled.span`
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral.silver};
  letter-spacing: 0.04em;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 1rem;
  }
`;

/** 카드 높이에 맞춘 스테이지 — 펼침 시에만 가로를 넓힘 */
export const CardBundleStage = styled.div<{ $expanded: boolean }>`
  position: relative;
  width: ${({ $expanded }) => ($expanded ? "10.75rem" : "7.75rem")};
  height: calc(${CARD_BUNDLE_CARD_WIDTH_MOBILE} * 287 / 170);
  transition: width 0.45s ${FAN_EASE};

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    width: ${({ $expanded }) => ($expanded ? "12.5rem" : "9.25rem")};
    height: calc(${CARD_BUNDLE_CARD_WIDTH_DESKTOP} * 287 / 170);
  }
`;

export const CardBundleCardMotion = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 50%;
  width: ${CARD_BUNDLE_CARD_WIDTH_MOBILE};
  aspect-ratio: 170 / 287;
  margin-left: calc(${CARD_BUNDLE_CARD_WIDTH_MOBILE} / -2);
  border-radius: 0.75rem;
  overflow: hidden;
  ${tarotCardFaceOuterCss}
  box-shadow: ${({ theme }) => theme.shadows.md};
  transform-origin: 50% 100%;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    width: ${CARD_BUNDLE_CARD_WIDTH_DESKTOP};
    margin-left: calc(${CARD_BUNDLE_CARD_WIDTH_DESKTOP} / -2);
  }

  &:hover .${CARD_FACE_FRAME_CLASS} {
    border-color: #f2cc88;
  }
`;
