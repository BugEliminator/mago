import styled from "@emotion/styled";
import Image from "next/image";
import {
  CARD_BORDER_GOLD,
  CARD_BORDER_HOVER,
  CARD_FACE_FRAME_CLASS,
  TarotCardFaceFrame,
  tarotCardFaceOuterCss,
} from "./TarotCardFaceShell.style";
import { DESKTOP_MIN_WIDTH } from "@/lib/layout";

/** z-index(맨 앞) 순과 맞게: 먼저 움직이는 쪽(큰 index)이 짧은 딜레이 */
const STAGGER_S = 0.1;

const CARD_BORDER_GLOW = "234, 184, 101";

export { CARD_FACE_FRAME_CLASS };
export { TarotCardFaceFrame as CardFaceFrame };

const spreadShadow = ($isSpread: boolean) =>
  $isSpread
    ? `0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 0 12px rgba(${CARD_BORDER_GLOW}, 0.3), inset 0 0 0 1px rgba(255, 242, 220, 0.2)`
    : `2px 0 5px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 242, 220, 0.16)`;

const spreadShadowHover = ($isSpread: boolean) =>
  $isSpread
    ? `0 10px 25px -5px rgba(0, 0, 0, 0.8),
          0 0 16px rgba(${CARD_BORDER_GLOW}, 0.4),
          inset 0 0 0 1px rgba(255, 248, 230, 0.28),
          0 0 18px rgba(255, 255, 255, 0.45),
          0 0 32px rgba(255, 255, 255, 0.18)`
    : `2px 0 5px rgba(0, 0, 0, 0.6),
          inset 0 0 0 1px rgba(255, 248, 230, 0.24),
          0 0 16px rgba(255, 255, 255, 0.4),
          0 0 28px rgba(255, 255, 255, 0.15)`;

/**
 * 뒷면 표시 + 가로 스프레드(겹침) — 부모가 `spreadStepPx`를 넘겨 전체 덱 너비 제어
 */
export const CardRoot = styled.div<{
  $isFace: boolean;
  $isSpread: boolean;
  $index: number;
  $isTop: boolean;
  $spreadStepPx: number;
  $stackStepPx: number;
  $deckCount: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 8.125rem; /* 130px — 모바일 */
  height: 13.75rem; /* 220px */
  border-radius: 0.75rem;
  box-sizing: border-box;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    width: 9.75rem; /* 156px */
    height: 16.5rem; /* 264px */
  }

  /* 앞면: 흰 패딩 → 내부 금색 보더 / 뒷면: 바깥 금색 보더 */
  ${({ $isFace }) =>
    $isFace
      ? tarotCardFaceOuterCss
      : `
    border: 1.5px solid ${CARD_BORDER_GOLD};
    background: #0a0e1a;
  `}

  box-shadow: ${({ $isSpread }) => spreadShadow($isSpread)};
  cursor: pointer;
  overflow: hidden;
  transform: ${({ $isSpread, $index, $isTop, $spreadStepPx, $stackStepPx }) => {
    const step = $isSpread ? $spreadStepPx : $stackStepPx;
    const direction = $isTop ? -1 : 1;
    return `translateX(${$index * step * direction}px)`;
  }};
  transition: ${({ $index, $deckCount }) => {
    const lastIndex = $deckCount - 1;
    const delay = (lastIndex - $index) * STAGGER_S;
    return `transform 1.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, box-shadow 0.32s ease, border-color 0.32s ease`;
  }};
  transform-origin: ${({ $isTop }) => ($isTop ? "bottom right" : "top left")};
  z-index: ${({ $index }) => $index};

  &:hover {
    box-shadow: ${({ $isSpread }) => spreadShadowHover($isSpread)};

    ${({ $isFace }) => (!$isFace ? `border-color: ${CARD_BORDER_HOVER};` : "")}

    .${CARD_FACE_FRAME_CLASS} {
      border-color: ${CARD_BORDER_HOVER};
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      box-shadow: ${({ $isSpread }) =>
        $isSpread
          ? `0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 0 12px rgba(${CARD_BORDER_GLOW}, 0.35), inset 0 0 0 1px rgba(255, 248, 230, 0.25), 0 0 12px rgba(255, 255, 255, 0.25)`
          : `2px 0 5px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 248, 230, 0.2), 0 0 10px rgba(255, 255, 255, 0.22)`};
    }
  }
`;

export const CardImageFill = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const CardBackImage = styled(Image)`
  object-fit: cover;
`;

/** 앞면 일러스트 — 금색 프레임 안을 채움 */
export const CardFaceImage = styled(Image)`
  object-fit: cover;
`;
