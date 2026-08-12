import type { CardSpread } from "@/types/tarot";

export type SpendTarotCoinClientResult =
  | { ok: true; newBalance: number }
  | { ok: false; error: string; code?: string };

/** 클라이언트 → POST /api/coins/spend-tarot */
export async function requestSpendTarotCoinFromClient(input: {
  cardCount: CardSpread;
  accessToken: string;
}): Promise<SpendTarotCoinClientResult> {
  const res = await fetch("/api/coins/spend-tarot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.accessToken}`,
    },
    body: JSON.stringify({ cardCount: input.cardCount }),
  });

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok || data == null || typeof data !== "object") {
    const err =
      data != null &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "엽전 차감에 실패했습니다.";
    const code =
      data != null &&
      typeof data === "object" &&
      "code" in data &&
      typeof (data as { code: unknown }).code === "string"
        ? (data as { code: string }).code
        : undefined;
    return { ok: false, error: err, code };
  }

  const payload = data as { ok: boolean; newBalance?: number };

  if (!payload.ok || typeof payload.newBalance !== "number") {
    return { ok: false, error: "엽전 차감 응답이 올바르지 않습니다." };
  }

  return { ok: true, newBalance: payload.newBalance };
}
