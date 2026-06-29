import styled from "@emotion/styled";
import { tarotCardFaceOuterCss } from "@/components/common/card/TarotCardFaceShell.style";

/** 플립 씬 바깥 — TarotCardBackShell과 동일한 폭 제약 */
export const FlipOuterWrap = styled.div<{
  $fluid?: boolean;
  $frameMaxWidth?: string;
}>`
  width: 100%;
  max-width: ${({ $fluid, $frameMaxWidth }) =>
    $fluid || $frameMaxWidth == null ? "none" : $frameMaxWidth};
  margin-left: ${({ $fluid, $frameMaxWidth }) =>
    $fluid || $frameMaxWidth == null ? "0" : "auto"};
  margin-right: ${({ $fluid, $frameMaxWidth }) =>
    $fluid || $frameMaxWidth == null ? "0" : "auto"};
`;

/** 3D 플립 — 카드 한 장 분량 */
export const FlipScene = styled.div`
  width: 100%;
  aspect-ratio: 170 / 287;
  perspective: 900px;
`;

export const FlipInner = styled.div<{ $flipped: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.75s cubic-bezier(0.6, -0.05, 0.01, 0.99);
  transform: rotateY(${({ $flipped }) => ($flipped ? "180deg" : "0deg")});
`;

export const FlipFaceBack = styled.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: rotateY(0deg);
`;

/** 3D 플립 앞면 — SpreadTarotCard와 동일한 흰 패딩·내부 금테 */
export const FlipFaceFront = styled.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: rotateY(180deg);
  border-radius: 0.75rem;
  overflow: hidden;
  ${tarotCardFaceOuterCss}

  img {
    object-fit: cover;
  }
`;

/** 역방향 카드 — 앞면 이미지만 180° 회전 */
export const FlipFaceImageInner = styled.div<{ $isReversed: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transform: rotate(${({ $isReversed }) => ($isReversed ? "180deg" : "0deg")});
`;
