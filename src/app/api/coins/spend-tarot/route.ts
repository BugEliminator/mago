import { NextResponse } from "next/server";
import { spendTarotCoin } from "@/lib/server/spendTarotCoin";
import { verifySupabaseAccessToken } from "@/lib/server/verifySupabaseAccessToken";
import { getTarotSpendCoinType, COIN_HISTORY_TITLES } from "@/lib/coinRewards";
import { getCoinAmountForType } from "@/lib/coinRewards";
import { formatCoinHistoryDateLabel } from "@/lib/coinKst";
import type { CardSpread } from "@/types/tarot";

type SpendTarotBody = {
  cardCount?: unknown;
};

/** POST /api/coins/spend-tarot — 리딩 시작 전 엽전 차감 */
export async function POST(request: Request) {
  const accessToken = extractBearerToken(request);
  if (accessToken == null) {
    return NextResponse.json(
      { ok: false, error: "로그인이 필요합니다.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const verified = await verifySupabaseAccessToken(accessToken);
  if (verified == null) {
    return NextResponse.json(
      { ok: false, error: "유효하지 않은 인증 토큰입니다.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "요청 본문이 올바른 JSON이 아닙니다.", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const cardCount = (body as SpendTarotBody).cardCount;
  if (typeof cardCount !== "number" || !Number.isInteger(cardCount)) {
    return NextResponse.json(
      { ok: false, error: "cardCount(3|5|7)가 필요합니다.", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const result = await spendTarotCoin(verified.userId, cardCount);

  if (!result.ok) {
    const status =
      result.code === "INSUFFICIENT_BALANCE"
        ? 402
        : result.code === "VALIDATION"
          ? 400
          : 500;
    return NextResponse.json(
      { ok: false, error: result.message, code: result.code },
      { status },
    );
  }

  const type = getTarotSpendCoinType(cardCount as CardSpread);
  const nowIso = new Date().toISOString();

  return NextResponse.json({
    ok: true,
    newBalance: result.newBalance,
    history: {
      id: result.historyId,
      type,
      title: COIN_HISTORY_TITLES[type],
      amount: getCoinAmountForType(type),
      createdAt: nowIso,
      dateLabel: formatCoinHistoryDateLabel(nowIso),
    },
  });
}

function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  return null;
}
