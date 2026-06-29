import OpenAI from "openai";
import type { MagoLlmResult } from "@/types/magoResult";
import type { TarotReadingLlmPayload } from "@/lib/tarotReadingLlmPayload";
import { parseMagoLlmResult } from "@/lib/magoResultMapper";

export type RequestMagoLlmReadingErrorCode =
  | "ENV_MISSING"
  | "OPENAI_ERROR"
  | "INVALID_RESPONSE";

export type RequestMagoLlmReadingResult =
  | { ok: true; result: MagoLlmResult }
  | {
      ok: false;
      code: RequestMagoLlmReadingErrorCode;
      message: string;
    };

function getMagoPromptConfig(): {
  apiKey: string;
  promptId: string;
  promptVersion: string;
} | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const promptId = process.env.MAGO_PROMPT_ID?.trim();
  const promptVersion = process.env.MAGO_PROMPT_VERSION?.trim() ?? "5";

  if (apiKey == null || apiKey.length === 0) return null;
  if (promptId == null || promptId.length === 0) return null;

  return { apiKey, promptId, promptVersion };
}

/**
 * Published Prompt(MAGO_v1)로 타로 해석 요청 — 서버 전용
 */
export async function requestMagoLlmReading(
  payload: TarotReadingLlmPayload,
): Promise<RequestMagoLlmReadingResult> {
  const config = getMagoPromptConfig();
  if (config == null) {
    return {
      ok: false,
      code: "ENV_MISSING",
      message:
        "OPENAI_API_KEY 또는 MAGO_PROMPT_ID가 설정되지 않았습니다. .env.local을 확인하세요.",
    };
  }

  const openai = new OpenAI({ apiKey: config.apiKey });

  try {
    const response = await openai.responses.create({
      prompt: {
        id: config.promptId,
        version: config.promptVersion,
      },
      input: JSON.stringify(payload),
    });

    const parsed = parseMagoLlmResult(response.output_text);
    if (parsed == null) {
      return {
        ok: false,
        code: "INVALID_RESPONSE",
        message: "LLM 응답 JSON 형식이 올바르지 않습니다.",
      };
    }

    return { ok: true, result: parsed };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "OpenAI API 호출에 실패했습니다.";
    return {
      ok: false,
      code: "OPENAI_ERROR",
      message,
    };
  }
}
