import styled from "@emotion/styled";

/** TarotReadingDeck `CardSlot` / 내부 레이어와 동일 팔레트 */
const GOLD = "#EAB865";
const INK = "#0A0B0E";

/** 바깥 금테와 안쪽 클립 호를 맞추기 위한 공통 값 */
const CARD_CORNER_RADIUS = "0.75rem";
const CARD_BORDER_WIDTH = "1.5px";

/** 리딩 덱 카드 실폭과 동일 */
export const TAROT_CARD_BACK_SHELL_WIDTH_DECK = "10.625rem";

/** 결과 상세 등에서 같은 비율로 확대 표시 */
export const TAROT_CARD_BACK_SHELL_WIDTH_DETAIL = "15.5rem";

export const ShellRoot = styled.div<{
  $fluid?: boolean;
  /** 비(fluid 아닐 때) 카드 박스 최대 가로 — 덱·상세 등 구분 */
  $frameMaxWidth?: string;
}>`
  position: relative;
  width: 100%;
  max-width: ${({ $fluid, $frameMaxWidth }) =>
    $fluid ? "none" : ($frameMaxWidth ?? TAROT_CARD_BACK_SHELL_WIDTH_DECK)};
  margin-left: ${({ $fluid }) => ($fluid ? "0" : "auto")};
  margin-right: ${({ $fluid }) => ($fluid ? "0" : "auto")};
  aspect-ratio: 170 / 287;
  border-radius: ${CARD_CORNER_RADIUS};
  border: ${CARD_BORDER_WIDTH} solid ${GOLD};
  /* 투명 시 모서리 안티앨리어싱으로 페이지 배경이 비침 → INK로 메움 */
  background: ${INK};
  box-sizing: border-box;
  transition:
    box-shadow 220ms ease,
    border-color 220ms ease,
    filter 220ms ease,
    transform 220ms ease;
`;

export const Inner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: calc(${CARD_CORNER_RADIUS} - ${CARD_BORDER_WIDTH});
  /* 금테 안쪽 호와 클립 반경 정렬 */
  overflow: hidden;
  background: ${INK};
`;

export const ImageLayer = styled.div`
  position: absolute;
  inset: 0;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

export const Sheen = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #ffffff 0%, #000000 70%);
  opacity: 0.06;
  pointer-events: none;
`;
