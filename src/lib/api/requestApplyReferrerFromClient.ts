export type ApplyReferrerClientResult =
  | { ok: true; applied: boolean; newBalance?: number }
  | { ok: false; error: string };

/** 클라이언트 → POST /api/coins/referrer */
export async function requestApplyReferrerFromClient(input: {
  referrerCode: string;
  accessToken: string;
}): Promise<ApplyReferrerClientResult> {
  const res = await fetch("/api/coins/referrer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.accessToken}`,
    },
    body: JSON.stringify({ referrerCode: input.referrerCode }),
  });

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok || data == null || typeof data !== "object") {
    const err =
      data != null &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "추천인 보상 요청에 실패했습니다.";
    return { ok: false, error: err };
  }

  const payload = data as {
    ok: boolean;
    applied?: boolean;
    newBalance?: number;
  };

  if (!payload.ok || typeof payload.applied !== "boolean") {
    return { ok: false, error: "추천인 보상 응답이 올바르지 않습니다." };
  }

  return {
    ok: true,
    applied: payload.applied,
    newBalance: payload.newBalance,
  };
}
