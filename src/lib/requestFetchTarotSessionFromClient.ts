import type { TarotReadingQueryData } from "@/lib/tarotReadingQuery";

export type FetchTarotSessionClientResult =
  | { ok: true; data: TarotReadingQueryData }
  | { ok: false; error: string; code?: string };

/**
 * 클라이언트 → GET /api/tarot/sessions/[readingId]
 * useQuery refetch 및 서버 prefetch 실패 시 fallback
 */
export async function requestFetchTarotSessionFromClient(
  readingId: string,
  accessToken: string,
): Promise<FetchTarotSessionClientResult> {
  let response: Response;
  try {
    response = await fetch(
      `/api/tarot/sessions/${encodeURIComponent(readingId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch {
    return {
      ok: false,
      error: "네트워크 오류로 리딩 결과를 불러오지 못했습니다.",
    };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    return { ok: false, error: "서버 응답을 해석할 수 없습니다." };
  }

  const body = data as {
    ok?: boolean;
    data?: TarotReadingQueryData;
    error?: string;
    code?: string;
  };

  if (!response.ok || body.ok !== true || body.data == null) {
    return {
      ok: false,
      error: body.error ?? "리딩 결과를 불러오지 못했습니다.",
      code: body.code,
    };
  }

  return { ok: true, data: body.data };
}
