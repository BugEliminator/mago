import styled from "@emotion/styled";

/** 카드 앞면 금테 — 랜딩·결과 공통 */
export const CARD_BORDER_GOLD = "#EAB865";
export const CARD_BORDER_HOVER = "#F2CC88";

/** 앞면 내부 금테 — SpreadTarotCard hover 타깃 */
export const CARD_FACE_FRAME_CLASS = "mago-card-face-frame" as const;

/** 앞면 바깥 흰 패딩 영역 — CardRoot·플립 앞면 공통 */
export const tarotCardFaceOuterCss = `
  padding: 0.375rem;
  border: none;
  background: #f3f0e9;
  box-sizing: border-box;
`;

/** 앞면 — 흰 패딩 안쪽 금색 보더 프레임 */
export const TarotCardFaceFrame = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid ${CARD_BORDER_GOLD};
  border-radius: 0.5rem;
  overflow: hidden;
  box-sizing: border-box;
  transition: border-color 0.32s ease;
`;

export const TarotCardFaceImageFill = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
