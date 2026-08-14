import type { HistoryListItem } from "@/components/mypage/history/historyTypes";

export type HistorySessionsPageData = {
  sessions: HistoryListItem[];
  totalCount: number;
};

export type FetchHistorySessionsClientResult =
  | { ok: true; data: HistorySessionsPageData }
  | { ok: false; error: string; code?: string };

type FetchHistorySessionsParams = {
  offset: number;
  limit: number;
};

/**
 * 클라이언트 → GET /api/tarot/sessions?offset=&limit=
 * 히스토리 2페이지·모바일 더보기
 */
export async function requestFetchHistorySessionsFromClient(
  accessToken: string,
  params: FetchHistorySessionsParams,
): Promise<FetchHistorySessionsClientResult> {
  const search = new URLSearchParams({
    offset: String(params.offset),
    limit: String(params.limit),
  });

  let response: Response;
  try {
    response = await fetch(`/api/tarot/sessions?${search.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch {
    return {
      ok: false,
      error: "네트워크 오류로 히스토리를 불러오지 못했습니다.",
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
    data?: HistorySessionsPageData;
    error?: string;
    code?: string;
  };

  if (!response.ok || body.ok !== true || body.data == null) {
    return {
      ok: false,
      error: body.error ?? "히스토리를 불러오지 못했습니다.",
      code: body.code,
    };
  }

  return { ok: true, data: body.data };
}
