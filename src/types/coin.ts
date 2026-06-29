/** coin_histories.type — DB 저장값 */
export type CoinHistoryType =
  | "EARN_SIGNUP"
  | "EARN_ATTENDANCE"
  | "EARN_REFERRER"
  | "EARN_REVIEW"
  | "SPEND_TAROT_3"
  | "SPEND_TAROT_5"
  | "SPEND_TAROT_7";

/** 엽전 충전소 이용 내역 UI 항목 */
export type CoinHistoryItem = {
  id: string;
  type: CoinHistoryType;
  title: string;
  amount: number;
  createdAt: string;
  dateLabel: string;
};

/** 엽전 충전소 페이지 초기 데이터 */
export type CoinPageInitialData = {
  balance: number;
  histories: CoinHistoryItem[];
  hasCheckedInToday: boolean;
};

export type ApplyCoinTransactionErrorCode =
  | "INSUFFICIENT_BALANCE"
  | "ALREADY_CHECKED_IN"
  | "ENV_MISSING"
  | "DB_ERROR"
  | "INVALID_TYPE";

export type ApplyCoinTransactionResult =
  | { ok: true; newBalance: number; historyId: string }
  | {
      ok: false;
      code: ApplyCoinTransactionErrorCode;
      message: string;
    };
