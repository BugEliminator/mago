import { NextResponse } from "next/server";
import { buildTarotReadingLlmPayload } from "@/lib/server/buildTarotReadingLlmPayload";
import { requestMagoLlmReading } from "@/lib/server/requestMagoLlmReading";
import { verifySupabaseAccessToken } from "@/lib/server/verifySupabaseAccessToken";
import type { TarotCategory } from "@/types/tarot";
import type { ValidatedTarotReadingRequest } from "@/types/tarotReadingRequest";

const TAROT_CATEGORIES: readonly TarotCategory[] = [
  "love",
  "money",
  "career",
  "study",
  "health",
  "family",
  "travel",
  "dream",
  "custom",
];

type ServerTimingName = "auth" | "input" | "supabase" | "openai";

type ServerTimingMetric = {
  name: ServerTimingName;
  durationMs: number;
};

/** POST /api/tarot/reading — 서버에서 입력을 조립한 뒤 전체 프롬프트 호출 */
export async function POST(request: Request) {
  const requestStartedAt = performance.now();
  const serverTimings: ServerTimingMetric[] = [];

  const recordTiming = (name: ServerTimingName, startedAt: number) => {
    serverTimings.push({
      name,
      durationMs: performance.now() - startedAt,
    });
  };

  const respond = <T,>(body: T, init?: ResponseInit) => {
    const response = NextResponse.json(body, init);
    response.headers.set(
      "Server-Timing",
      formatServerTiming(
        serverTimings,
        performance.now() - requestStartedAt,
      ),
    );
    return response;
  };

  const authStartedAt = performance.now();
  const accessToken = extractBearerToken(request);
  if (accessToken == null) {
    recordTiming("auth", authStartedAt);
    return respond(
      { ok: false, error: "로그인이 필요합니다.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const verified = await verifySupabaseAccessToken(accessToken);
  recordTiming("auth", authStartedAt);
  if (verified == null) {
    return respond(
      {
        ok: false,
        error: "유효하지 않은 인증 토큰입니다.",
        code: "UNAUTHORIZED",
      },
      { status: 401 },
    );
  }

  const inputStartedAt = performance.now();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    recordTiming("input", inputStartedAt);
    return respond(
      {
        ok: false,
        error: "요청 본문이 올바른 JSON이 아닙니다.",
        code: "BAD_REQUEST",
      },
      { status: 400 },
    );
  }

  const parsed = parseTarotReadingRequest(body);
  recordTiming("input", inputStartedAt);
  if (parsed == null) {
    return respond(
      {
        ok: false,
        error: "리딩 요청 형식이 올바르지 않습니다.",
        code: "BAD_REQUEST",
      },
      { status: 400 },
    );
  }

  const supabaseStartedAt = performance.now();
  const payloadResult = await buildTarotReadingLlmPayload(
    verified.userId,
    parsed,
  );
  recordTiming("supabase", supabaseStartedAt);
  if (!payloadResult.ok) {
    const status = payloadResult.code === "POSITION_MISSING" ? 400 : 500;
    return respond(
      {
        ok: false,
        error: payloadResult.message,
        code: payloadResult.code,
      },
      { status },
    );
  }

  const openaiStartedAt = performance.now();
  const llmResult = await requestMagoLlmReading(payloadResult.payload);
  recordTiming("openai", openaiStartedAt);
  if (!llmResult.ok) {
    const status = llmResult.code === "ENV_MISSING" ? 500 : 502;
    return respond(
      { ok: false, error: llmResult.message, code: llmResult.code },
      { status },
    );
  }

  return respond({ ok: true, result: llmResult.result });
}

function formatServerTiming(
  metrics: readonly ServerTimingMetric[],
  totalDurationMs: number,
): string {
  return [
    ...metrics.map(
      ({ name, durationMs }) => `${name};dur=${durationMs.toFixed(1)}`,
    ),
    `total;dur=${totalDurationMs.toFixed(1)}`,
  ].join(", ");
}

function parseTarotReadingRequest(
  value: unknown,
): ValidatedTarotReadingRequest | null {
  if (value == null || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  if (body.setup == null || typeof body.setup !== "object") return null;
  const setup = body.setup as Record<string, unknown>;

  if (!isTarotCategory(setup.category)) return null;
  if (
    setup.cardCount !== 3 &&
    setup.cardCount !== 5 &&
    setup.cardCount !== 7
  ) {
    return null;
  }
  if (
    typeof setup.detailTag !== "string" ||
    typeof setup.situation !== "string" ||
    typeof setup.question !== "string"
  ) {
    return null;
  }

  if (!Array.isArray(body.pickedCards)) return null;
  if (body.pickedCards.length !== setup.cardCount) return null;

  const pickedCards = [];
  const cardIds = new Set<number>();
  for (const value of body.pickedCards) {
    if (value == null || typeof value !== "object") return null;
    const card = value as Record<string, unknown>;
    if (
      typeof card.cardId !== "number" ||
      !Number.isInteger(card.cardId) ||
      card.cardId < 0 ||
      card.cardId > 77 ||
      typeof card.isReversed !== "boolean" ||
      cardIds.has(card.cardId)
    ) {
      return null;
    }
    cardIds.add(card.cardId);
    pickedCards.push({
      cardId: card.cardId,
      isReversed: card.isReversed,
    });
  }

  return {
    setup: {
      category: setup.category,
      cardCount: setup.cardCount,
      detailTag: setup.detailTag,
      situation: setup.situation,
      question: setup.question,
    },
    pickedCards,
  };
}

function isTarotCategory(value: unknown): value is TarotCategory {
  return (
    typeof value === "string" &&
    TAROT_CATEGORIES.includes(value as TarotCategory)
  );
}

function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  return null;
}
