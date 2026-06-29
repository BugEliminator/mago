import styled from "@emotion/styled";

/** TarotCardBackShell과 동일한 팔레트 */
const GOLD = "#EAB865";
const INK = "#0A0B0E";

/** 카드팩 컨테이너 — 카드 장 수에 따라 너비 가변 */
export const MiniCardStackRoot = styled.div<{ $count: number }>`
  position: relative;
  z-index: 0;
  height: calc(1.5rem * 287 / 170);
  width: ${({ $count }) => ($count <= 3 ? "2.5" : $count <= 5 ? "3" : "3.5")}rem;
  flex-shrink: 0;
`;

/**
 * 개별 미니 카드 — TarotCardBackShell 비주얼(금테·어두운 배경·쉔)을 축소 재현
 * next/image 오버헤드 없이 CSS만으로 처리
 */
export const MiniCardItem = styled.div<{
  $index: number;
  $rotateDeg: number;
  $leftPx: number;
}>`
  position: absolute;
  width: 1.5rem;
  height: calc(1.5rem * 287 / 170);
  border-radius: 0.25rem;
  background: ${INK};
  border: 1.5px solid ${GOLD};
  transform: rotate(${({ $rotateDeg }) => $rotateDeg}deg);
  transform-origin: bottom center;
  left: ${({ $leftPx }) => $leftPx}px;
  z-index: ${({ $index }) => $index + 1};
  transition: border-color 300ms ease-in-out;

  /* 쉔 — TarotCardBackShell.Sheen과 동일 */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #ffffff 0%, #000000 70%);
    opacity: 0.06;
    border-radius: inherit;
    pointer-events: none;
  }

  /* 이중 테두리 안쪽 라인 */
  &::after {
    content: "";
    position: absolute;
    inset: 2px;
    border: 0.5px solid #3a2f18;
    border-radius: 0.125rem;
    pointer-events: none;
  }
`;
