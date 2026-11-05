import OpenAI from "openai";
import {
  buildMagoTarotReadingResponseSchema,
  MAGO_TAROT_READING_INSTRUCTIONS,
  MAGO_TAROT_READING_PROMPT_VERSION,
} from "@/lib/server/magoTarotReadingPrompt";
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

function getMagoConfig(): {
  apiKey: string;
  model: string;
} | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (apiKey == null || apiKey.length === 0) return null;

  return {
    apiKey,
    model: process.env.MAGO_MODEL?.trim() || "gpt-6-luna",
  };
}

/** 코드에 보존한 MAGO_v2 v7 프롬프트로 전체 타로 해석 요청 — 서버 전용 */
export async function requestMagoLlmReading(
  payload: TarotReadingLlmPayload,
): Promise<RequestMagoLlmReadingResult> {
  const config = getMagoConfig();
  if (config == null) {
    return {
      ok: false,
      code: "ENV_MISSING",
      message: "OPENAI_API_KEY가 설정되지 않았습니다. .env.local을 확인하세요.",
    };
  }

  const openai = new OpenAI({ apiKey: config.apiKey });

  try {
    const requestStartedAt = performance.now();
    const response = await openai.responses.create({
      model: config.model,
      instructions: MAGO_TAROT_READING_INSTRUCTIONS,
      input: JSON.stringify(payload),
      reasoning: { effort: "medium", summary: "auto" },
      text: {
        verbosity: "medium",
        format: {
          type: "json_schema",
          name: "mago_tarot_reading_v2",
          strict: true,
          schema: buildMagoTarotReadingResponseSchema(
            payload.readings.length,
          ),
        },
      },
    });
    const durationMs = performance.now() - requestStartedAt;

    if (process.env.NODE_ENV !== "production") {
      const usage = response.usage;
      console.info("[MAGO][타로 리딩][OpenAI 측정]", {
        cardCount: payload.readings.length,
        promptVersion: MAGO_TAROT_READING_PROMPT_VERSION,
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
    if (parsed == null || !matchesRequestedCards(parsed, payload)) {
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

function matchesRequestedCards(
  result: MagoLlmResult,
  payload: TarotReadingLlmPayload,
): boolean {
  if (result.res_readings.length !== payload.readings.length) return false;

  return result.res_readings.every((reading, index) => {
    const requested = payload.readings[index];
    return (
      requested != null &&
      reading.label === requested.position_label &&
      reading.card_name_en === requested.card_name_en &&
      reading.is_reversed === requested.is_reversed &&
      reading.paragraphs.length === 2
    );
  });
}
