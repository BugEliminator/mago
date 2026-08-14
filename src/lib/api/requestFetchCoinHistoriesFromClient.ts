import type { CoinHistoriesPageData } from "@/types/coin";

export type FetchCoinHistoriesClientResult =
  | { ok: true; data: CoinHistoriesPageData }
  | { ok: false; error: string; code?: string };

type FetchCoinHistoriesParams = {
  offset: number;
  limit: number;
};

/**
 * 클라이언트 → GET /api/coins/histories?offset=&limit=
 * 엽전 충전소 이용 내역 더보기
 */
export async function requestFetchCoinHistoriesFromClient(
  accessToken: string,
  params: FetchCoinHistoriesParams,
): Promise<FetchCoinHistoriesClientResult> {
  const search = new URLSearchParams({
    offset: String(params.offset),
    limit: String(params.limit),
  });

  let response: Response;
  try {
    response = await fetch(`/api/coins/histories?${search.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch {
    return {
      ok: false,
      error: "네트워크 오류로 이용 내역을 불러오지 못했습니다.",
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
    data?: CoinHistoriesPageData;
    error?: string;
    code?: string;
  };

  if (!response.ok || body.ok !== true || body.data == null) {
    return {
      ok: false,
      error: body.error ?? "이용 내역을 불러오지 못했습니다.",
      code: body.code,
    };
  }

  return { ok: true, data: body.data };
}
