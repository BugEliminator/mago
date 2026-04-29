import styled from "@emotion/styled";
import Image from "next/image";
import { SPREAD_DECK_VISIBLE_COUNT } from "@/types/tarot";

/** z-index(맨 앞) 순과 맞게: 먼저 움직이는 쪽(큰 index)이 짧은 딜레이 */
const STAGGER_S = 0.1;
const lastIndex = SPREAD_DECK_VISIBLE_COUNT - 1;

/** 카드 둘레(금) — PNG 테두리 대체 */
const CARD_BORDER_GOLD = "#EAB865";
const CARD_BORDER_GLOW = "234, 184, 101";
const CARD_BORDER_HOVER = "#F2CC88";

/**
 * 뒷면 표시 + 가로 스프레드(겹침) — 부모가 `spreadStepPx`를 넘겨 전체 덱 너비 제어
 */
export const CardRoot = styled.div<{
  $isSpread: boolean;
  $index: number;
  $isTop: boolean;
  $spreadStepPx: number;
  $stackStepPx: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 5.625rem; /* 90px */
  height: 9.375rem; /* 150px, 약 2:3.33 */
  border-radius: 0.75rem;
  /* 뒷면 이미지에서 금 테를 잘랐을 때: 바깥 링 + 안쪽 하이라이트 */
  border: 1.5px solid ${CARD_BORDER_GOLD};
  box-shadow: ${({ $isSpread }) =>
    $isSpread
      ? `0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 0 12px rgba(${CARD_BORDER_GLOW}, 0.3), inset 0 0 0 1px rgba(255, 242, 220, 0.2)`
      : `2px 0 5px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 242, 220, 0.16)`};
  cursor: pointer;
  overflow: hidden;
  background: #0a0e1a;
  transform: ${({ $isSpread, $index, $isTop, $spreadStepPx, $stackStepPx }) => {
    const step = $isSpread ? $spreadStepPx : $stackStepPx;
    const direction = $isTop ? -1 : 1;
    return `translateX(${$index * step * direction}px)`;
  }};
  /* transform 만 스태거 — box-shadow 는 딜레이 없이(호버 글로우 즉시 반응) */
  transition: ${({ $index }) => {
    const delay = (lastIndex - $index) * STAGGER_S;
    return `transform 1.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, box-shadow 0.32s ease`;
  }};
  transform-origin: ${({ $isTop }) => ($isTop ? "bottom right" : "top left")};
  /* 상·하 덱 모두: index 클수록 펼쳐진 쪽(덱 '맨 위' 카드)이 앞에 오도록 */
  z-index: ${({ $index }) => $index};

  @media (min-width: 640px) {
    width: 8.125rem; /* 130px */
    height: 13.75rem; /* 220px */
  }

  &:hover {
    border-color: ${CARD_BORDER_HOVER};
    box-shadow: ${({ $isSpread }) =>
      $isSpread
        ? `0 10px 25px -5px rgba(0, 0, 0, 0.8),
          0 0 16px rgba(${CARD_BORDER_GLOW}, 0.4),
          inset 0 0 0 1px rgba(255, 248, 230, 0.28),
          0 0 18px rgba(255, 255, 255, 0.45),
          0 0 32px rgba(255, 255, 255, 0.18)`
        : `2px 0 5px rgba(0, 0, 0, 0.6),
          inset 0 0 0 1px rgba(255, 248, 230, 0.24),
          0 0 16px rgba(255, 255, 255, 0.4),
          0 0 28px rgba(255, 255, 255, 0.15)`};
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
