import type { CoinHistoryItem } from "@/types/coin";

export type ClaimAttendanceClientResult =
  | { ok: true; newBalance: number; history: CoinHistoryItem }
  | { ok: false; error: string; code?: string };

/** 클라이언트 → POST /api/coins/attendance */
export async function requestClaimAttendanceFromClient(
  accessToken: string,
): Promise<ClaimAttendanceClientResult> {
  const res = await fetch("/api/coins/attendance", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok || data == null || typeof data !== "object") {
    const err =
      data != null &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "출석 보상 요청에 실패했습니다.";
    const code =
      data != null &&
      typeof data === "object" &&
      "code" in data &&
      typeof (data as { code: unknown }).code === "string"
        ? (data as { code: string }).code
        : undefined;
    return { ok: false, error: err, code };
  }

  const payload = data as {
    ok: boolean;
    newBalance?: number;
    history?: CoinHistoryItem;
  };

  if (
    !payload.ok ||
    typeof payload.newBalance !== "number" ||
    payload.history == null
  ) {
    return { ok: false, error: "출석 보상 응답이 올바르지 않습니다." };
  }

  return {
    ok: true,
    newBalance: payload.newBalance,
    history: payload.history,
  };
}
