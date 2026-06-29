import { getTarotSpendCoinType } from "@/lib/coinRewards";
import { applyCoinTransaction } from "@/lib/server/applyCoinTransaction";
import type { CardSpread } from "@/types/tarot";
import type { ApplyCoinTransactionResult } from "@/types/coin";

const VALID_CARD_COUNTS: readonly CardSpread[] = [3, 5, 7];

export type SpendTarotCoinResult =
  | (ApplyCoinTransactionResult & { ok: true })
  | {
      ok: false;
      code:
        | "INSUFFICIENT_BALANCE"
        | "VALIDATION"
        | "ENV_MISSING"
        | "DB_ERROR";
      message: string;
    };

/** 타로 리딩 시작 전 엽전 차감 */
export async function spendTarotCoin(
  userId: string,
  cardCount: number,
): Promise<SpendTarotCoinResult> {
  if (
    !VALID_CARD_COUNTS.includes(cardCount as CardSpread)
  ) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "유효하지 않은 카드 장수입니다.",
    };
  }

  const type = getTarotSpendCoinType(cardCount as CardSpread);
  const result = await applyCoinTransaction({ userId, type });

  if (result.ok) {
    return result;
  }

  if (result.code === "INSUFFICIENT_BALANCE") {
    return {
      ok: false,
      code: "INSUFFICIENT_BALANCE",
      message: result.message,
    };
  }

  return {
    ok: false,
    code: result.code === "ENV_MISSING" ? "ENV_MISSING" : "DB_ERROR",
    message: result.message,
  };
}
