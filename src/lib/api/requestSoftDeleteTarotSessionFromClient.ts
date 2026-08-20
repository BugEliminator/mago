export type SoftDeleteTarotSessionClientResult =
  | { ok: true }
  | { ok: false; error: string; code?: string };

/**
 * 클라이언트 → DELETE /api/tarot/sessions/[readingId]
 * 소유자 세션 소프트 삭제
 */
export async function requestSoftDeleteTarotSessionFromClient(
  readingId: string,
  accessToken: string,
): Promise<SoftDeleteTarotSessionClientResult> {
  let response: Response;
  try {
    response = await fetch(
      `/api/tarot/sessions/${encodeURIComponent(readingId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch {
    return { ok: false, error: "네트워크 오류로 삭제를 완료하지 못했습니다." };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    return { ok: false, error: "서버 응답을 해석할 수 없습니다." };
  }

  const body = data as { ok?: boolean; error?: string; code?: string };

  if (!response.ok || body.ok !== true) {
    return {
      ok: false,
      error: body.error ?? "삭제를 완료하지 못했습니다.",
      code: body.code,
    };
  }

  return { ok: true };
}
