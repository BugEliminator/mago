export type CheckSignupEmailClientResult =
  | { ok: true; allowed: true }
  | {
      ok: true;
      allowed: false;
      daysUntilEligible: number;
      code: "WITHDRAW_COOLDOWN";
    }
  | { ok: false; error: string; code?: string };

/** 클라이언트 → POST /api/auth/check-signup-email */
export async function requestCheckSignupEmailFromClient(
  email: string,
): Promise<CheckSignupEmailClientResult> {
  const res = await fetch("/api/auth/check-signup-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok || data == null || typeof data !== "object") {
    const err =
      data != null &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "이메일 확인에 실패했습니다.";
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
    allowed?: boolean;
    daysUntilEligible?: number;
    code?: string;
  };

  if (!payload.ok) {
    return { ok: false, error: "이메일 확인 응답이 올바르지 않습니다." };
  }

  if (payload.allowed === false && payload.code === "WITHDRAW_COOLDOWN") {
    const days =
      typeof payload.daysUntilEligible === "number"
        ? payload.daysUntilEligible
        : 1;
    return {
      ok: true,
      allowed: false,
      daysUntilEligible: Math.max(1, days),
      code: "WITHDRAW_COOLDOWN",
    };
  }

  return { ok: true, allowed: true };
}
