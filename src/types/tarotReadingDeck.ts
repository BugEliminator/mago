/**
 * 타로 리딩 덱 UI 전용 타입 — `TarotReadingDeck.tsx`와 연동 lib에서 공유
 */

export type ReadingViewState = "deck" | "spreading" | "spread";

export type CardPose = {
  x: number;
  y: number;
  rotateDeg: number;
  scale: number;
  zIndex: number;
  durationMs: number;
  delayMs: number;
};

export type ReadingCardState = {
  cardId: number;
  /** 셔플 시 확정된 정역방향(false = 정방향, true = 역방향) */
  isReversed: boolean;
  pose: CardPose;
};

/** 스프레드에서 확정된 뽑기 슬롯 항목 */
export type PickedSlotEntry = {
  cardId: number;
  isReversed: boolean;
};

/** 모달에 올려 둔 뽑기 후보 */
export type PickModalState = {
  cardId: number;
  isReversed: boolean;
  slotIndex: number;
};

/** LLM payload용 profiles 조회 결과 */
export type ProfileRowForLlm = {
  nickname: string | null;
  birth_date: string | null;
  born_time: string | null;
  gender: string | null;
  language: string | null;
};

export type CardMeaningRow = {
  card_id: number;
  is_upright: boolean;
  keywords: string[] | null;
  description: string | null;
};

export type CardRow = {
  id: number;
  name_en: string | null;
  type: string | null;
};
