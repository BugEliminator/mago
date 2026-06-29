export type WithdrawClientResult =
  | { ok: true }
  | { ok: false; error: string; code?: string };

/** 클라이언트 → POST /api/auth/withdraw */
export async function requestWithdrawFromClient(
  accessToken: string,
): Promise<WithdrawClientResult> {
  const res = await fetch("/api/auth/withdraw", {
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
        : "탈퇴 처리에 실패했습니다.";
    const code =
      data != null &&
      typeof data === "object" &&
      "code" in data &&
      typeof (data as { code: unknown }).code === "string"
        ? (data as { code: string }).code
        : undefined;
    return { ok: false, error: err, code };
  }

  const payload = data as { ok: boolean };

  if (!payload.ok) {
    return { ok: false, error: "탈퇴 응답이 올바르지 않습니다." };
  }

  return { ok: true };
}
