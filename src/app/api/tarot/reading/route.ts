import { NextResponse } from "next/server";
import { requestMagoLlmReading } from "@/lib/server/requestMagoLlmReading";
import type { TarotReadingLlmPayload } from "@/lib/tarotReadingLlmPayload";

/** POST /api/tarot/reading — MAGO_v1 Published Prompt 호출 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "요청 본문이 올바른 JSON이 아닙니다." },
      { status: 400 },
    );
  }

  const payload = (body as { payload?: unknown }).payload;
  if (!isTarotReadingLlmPayload(payload)) {
    return NextResponse.json(
      { ok: false, error: "payload 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const llmResult = await requestMagoLlmReading(payload);
  if (!llmResult.ok) {
    const status =
      llmResult.code === "ENV_MISSING"
        ? 500
        : llmResult.code === "INVALID_RESPONSE"
          ? 502
          : 502;
    return NextResponse.json(
      { ok: false, error: llmResult.message, code: llmResult.code },
      { status },
    );
  }

  return NextResponse.json({ ok: true, result: llmResult.result });
}

/** LLM 입력 payload 최소 유효성 검사 */
function isTarotReadingLlmPayload(
  value: unknown,
): value is TarotReadingLlmPayload {
  if (value == null || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (v.step == null || typeof v.step !== "object") return false;
  const step = v.step as Record<string, unknown>;
  if (typeof step.situation !== "string" || typeof step.question !== "string") {
    return false;
  }
  if (!Array.isArray(v.readings) || v.readings.length === 0) return false;
  return true;
}
