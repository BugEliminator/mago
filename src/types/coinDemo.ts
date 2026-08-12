/** 엽전 충전소 데모 모드 — 로컬 전용 이용 내역 type */
export type CoinDemoTransactionType =
  | "charge_checkin"
  | "charge_ad"
  | "charge_pay"
  | "use_fortune";

/** 결제·광고 데모 잠금 해제 시 UI에만 쌓는 로컬 내역 */
export type CoinDemoTransaction = {
  id: number;
  type: CoinDemoTransactionType;
  amount: number;
  description: string;
  date: string;
};
