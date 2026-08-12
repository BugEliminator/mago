/** 유료 엽전 패키지 UI 카탈로그 (결제 연동 전) */
export type CoinPackage = {
  coins: string;
  rate: string;
  priceLabel: string;
  bonusLabel?: string;
  amount: number;
};

/** 광고 보상 냥 수 (데모) */
export const AD_REWARD = 5;

/** 하루 광고 시청 최대 횟수 (데모) */
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
