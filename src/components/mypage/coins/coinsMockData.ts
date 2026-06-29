/**
 * 엽전 충전소 목데이터
 * — Supabase 연동 전 퍼블리싱·데모 확인용
 */

export type CoinTransactionType =
  | "charge_checkin"
  | "charge_ad"
  | "charge_pay"
  | "use_fortune";

export type CoinTransaction = {
  id: number;
  type: CoinTransactionType;
  amount: number;
  description: string;
  date: string;
};

export type CoinPackage = {
  coins: string;
  rate: string;
  priceLabel: string;
  bonusLabel?: string;
  amount: number;
};

/** 출석 체크 보상 냥 수 */
export const CHECKIN_REWARD = 20;

/** 광고 보상 냥 수 */
export const AD_REWARD = 5;

/** 하루 광고 시청 최대 횟수 */
export const AD_MAX_COUNT = 3;

/** 유료 패키지 목록 */
export const COIN_PACKAGES: CoinPackage[] = [
  { coins: "20냥", rate: "개당 50원", priceLabel: "1,000원", amount: 20 },
  {
    coins: "70냥",
    rate: "개당 43원",
    priceLabel: "3,000원",
    bonusLabel: "10냥 보너스",
    amount: 70,
  },
  {
    coins: "120냥",
    rate: "개당 42원",
    priceLabel: "5,000원",
    bonusLabel: "20냥 보너스",
    amount: 120,
  },
  {
    coins: "250냥",
    rate: "개당 40원",
    priceLabel: "10,000원",
    bonusLabel: "50냥 보너스!",
    amount: 250,
  },
];

