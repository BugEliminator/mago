export type SubmitTarotSessionReviewClientInput = {
  readingId: string;
  rating: number;
  reviewContent: string | null;
  accessToken: string;
};

export type SubmitTarotSessionReviewClientResult =
  | { ok: true }
  | { ok: false; error: string; code?: string };

/**
 * 클라이언트 → PATCH /api/tarot/sessions/[readingId]/review
 */
export async function requestSubmitTarotSessionReviewFromClient(
  input: SubmitTarotSessionReviewClientInput,
): Promise<SubmitTarotSessionReviewClientResult> {
  let response: Response;
  try {
    response = await fetch(
      `/api/tarot/sessions/${encodeURIComponent(input.readingId)}/review`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${input.accessToken}`,
        },
        body: JSON.stringify({
          rating: input.rating,
          reviewContent: input.reviewContent,
        }),
      },
    );
  } catch {
    return { ok: false, error: "네트워크 오류로 후기 저장에 실패했습니다." };
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
      error: body.error ?? "후기 저장에 실패했습니다.",
      code: body.code,
    };
  }

  return { ok: true };
}
