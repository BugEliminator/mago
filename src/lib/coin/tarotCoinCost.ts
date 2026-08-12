import type { CardSpread } from "@/types/tarot";

/** 카드 1장당 엽전 비용 배율 (카드 수 × 10냥) */
export const COIN_PER_CARD = 10;

/** 카드 장수 → 소모 엽전 냥 수 */
export function getTarotCoinCost(cardCount: CardSpread): number {
  return cardCount * COIN_PER_CARD;
}
