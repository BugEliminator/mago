import OpenAI from "openai";
import type { MagoLlmResult } from "@/types/magoResult";
import type { TarotReadingLlmPayload } from "@/lib/tarot/reading/tarotReadingLlmPayload";
import { parseMagoLlmResult } from "@/lib/tarot/map/magoResultMapper";

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

/** Published Prompt로 전체 타로 해석 요청 — 서버 전용 */
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
    const requestStartedAt = performance.now();
    const response = await openai.responses.create({
      prompt: {
        id: config.promptId,
        version: config.promptVersion,
      },
      input: JSON.stringify(payload),
      reasoning: { effort: "medium" },
    });
    const durationMs = performance.now() - requestStartedAt;

    if (process.env.NODE_ENV !== "production") {
      const usage = response.usage;
      console.info("[MAGO][타로 리딩][OpenAI 측정]", {
        cardCount: payload.readings.length,
        promptVersion: config.promptVersion,
        model: response.model,
        serviceTier: response.service_tier,
        reasoningEffort: response.reasoning?.effort ?? null,
        durationMs: Number(durationMs.toFixed(1)),
        inputTokens: usage?.input_tokens ?? null,
        cachedTokens: usage?.input_tokens_details.cached_tokens ?? null,
        outputTokens: usage?.output_tokens ?? null,
        reasoningTokens:
          usage?.output_tokens_details.reasoning_tokens ?? null,
        totalTokens: usage?.total_tokens ?? null,
      });
    }

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
