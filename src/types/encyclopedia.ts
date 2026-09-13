/** 백과사전 카드 묶음 식별자 */
export type EncyclopediaBundleId =
  | "major"
  | "wands"
  | "cups"
  | "swords"
  | "pentacles";

/** 백과사전 상단 묶음 + 아래 전체 덱 */
export type EncyclopediaCardBundle = {
  id: EncyclopediaBundleId;
  label: string;
  /** 상단 부채꼴에 보여줄 샘플 */
  cardSrcs: readonly string[];
  /** 선택 시 아래에 펼칠 전체 앞면 */
  deckSrcs: readonly string[];
};
