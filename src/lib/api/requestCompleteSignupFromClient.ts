export type CompleteSignupClientResult =
  | { ok: true }
  | { ok: false; error: string };

/** 클라이언트 → POST /api/auth/complete-signup */
export async function requestCompleteSignupFromClient(input: {
  accessToken: string;
  email: string;
  nickname: string;
}): Promise<CompleteSignupClientResult> {
  const res = await fetch("/api/auth/complete-signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.accessToken}`,
    },
    body: JSON.stringify({
      email: input.email,
      nickname: input.nickname,
    }),
  });

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok || data == null || typeof data !== "object") {
    const err =
      data != null &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "가입 완료 처리에 실패했습니다.";
    return { ok: false, error: err };
  }

  const payload = data as { ok: boolean };
  if (!payload.ok) {
    return { ok: false, error: "가입 완료 응답이 올바르지 않습니다." };
  }

  return { ok: true };
}
