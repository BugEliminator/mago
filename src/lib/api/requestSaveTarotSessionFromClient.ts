import type { MagoLlmResult } from "@/types/magoResult";
import type { TarotSessionSetup } from "@/types/tarot";

export type SaveTarotSessionClientInput = {
  sessionId: string;
  setup: TarotSessionSetup;
  llm: MagoLlmResult;
  accessToken: string;
};

export type SaveTarotSessionClientResult =
  | { ok: true; sessionId: string }
  | { ok: false; error: string; code?: string };

/**
 * 클라이언트 → POST /api/tarot/sessions
 * LLM 결과 + setup을 Supabase tarot_sessions / tarot_session_cards에 저장
 */
export async function requestSaveTarotSessionFromClient(
  input: SaveTarotSessionClientInput,
): Promise<SaveTarotSessionClientResult> {
  let response: Response;
  try {
    response = await fetch("/api/tarot/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${input.accessToken}`,
      },
      body: JSON.stringify({
        sessionId: input.sessionId,
        setup: input.setup,
        llm: input.llm,
      }),
    });
  } catch {
    return {
      ok: false,
      error: "네트워크 오류로 리딩 저장에 실패했습니다.",
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
    sessionId?: string;
    error?: string;
    code?: string;
  };

  if (!response.ok || body.ok !== true || body.sessionId == null) {
    return {
      ok: false,
      error: body.error ?? "리딩 결과 저장에 실패했습니다.",
      code: body.code,
    };
  }

  return { ok: true, sessionId: body.sessionId };
}
