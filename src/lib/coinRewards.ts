import type { CardSpread } from "@/types/tarot";
import type { CoinHistoryType } from "@/types/coin";

/** MVP 프로모션 보상 냥 수 (7~8월 점진 조정 예정) */
export const COIN_REWARD_SIGNUP = 150;
export const COIN_REWARD_ATTENDANCE = 20;
export const COIN_REWARD_REFERRER = 20;
export const COIN_REWARD_REVIEW = 30;

/** coin_histories.title — UI 설명 문구 */
export const COIN_HISTORY_TITLES: Record<CoinHistoryType, string> = {
  EARN_SIGNUP: "회원가입 축하 보상",
  EARN_ATTENDANCE: "매일 출석 보상",
  EARN_REFERRER: "친구 초대 보상",
  EARN_REVIEW: "리딩 후기 작성 보상",
  SPEND_TAROT_3: "3장 타로 리딩 소모",
  SPEND_TAROT_5: "5장 타로 리딩 소모",
  SPEND_TAROT_7: "7장 타로 리딩 소모",
};

const COIN_AMOUNTS: Record<CoinHistoryType, number> = {
  EARN_SIGNUP: COIN_REWARD_SIGNUP,
  EARN_ATTENDANCE: COIN_REWARD_ATTENDANCE,
  EARN_REFERRER: COIN_REWARD_REFERRER,
  EARN_REVIEW: COIN_REWARD_REVIEW,
  SPEND_TAROT_3: -30,
  SPEND_TAROT_5: -50,
  SPEND_TAROT_7: -70,
};

/** type에 대응하는 증감 냥 수 */
export function getCoinAmountForType(type: CoinHistoryType): number {
  return COIN_AMOUNTS[type];
}

/** 카드 장수 → 타로 소모 type */
export function getTarotSpendCoinType(cardCount: CardSpread): CoinHistoryType {
  switch (cardCount) {
    case 3:
      return "SPEND_TAROT_3";
    case 5:
      return "SPEND_TAROT_5";
    case 7:
      return "SPEND_TAROT_7";
  }
}

export function isCoinHistoryType(value: string): value is CoinHistoryType {
  return value in COIN_HISTORY_TITLES;
}
