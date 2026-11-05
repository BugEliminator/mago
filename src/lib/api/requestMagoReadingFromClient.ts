import type { MagoLlmResult } from "@/types/magoResult";
import type { RequestMagoReadingClientInput } from "@/types/tarotReadingRequest";

export type MagoReadingClientResult =
  | { ok: true; result: MagoLlmResult }
  | { ok: false; error: string; code?: string };

/**
 * 클라이언트 → POST /api/tarot/reading
 * 병렬 처리 실패 시 MAGO_v2 전체 해석 요청
 */
export async function requestMagoReadingFromClient(
  input: RequestMagoReadingClientInput,
): Promise<MagoReadingClientResult> {
  const { accessToken, setup, pickedCards } = input;
  let response: Response;
  try {
    response = await fetch("/api/tarot/reading", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ setup, pickedCards }),
    });
  } catch {
    return { ok: false, error: "네트워크 오류로 리딩 요청에 실패했습니다." };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    return { ok: false, error: "서버 응답을 해석할 수 없습니다." };
  }

  const body = data as {
    ok?: boolean;
    result?: MagoLlmResult;
    error?: string;
    code?: string;
  };

  if (!response.ok || body.ok !== true || body.result == null) {
    return {
      ok: false,
      error: body.error ?? "리딩 요청에 실패했습니다.",
      code: body.code,
    };
  }

  return { ok: true, result: body.result };
}
