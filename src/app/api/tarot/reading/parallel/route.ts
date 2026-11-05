import { NextResponse } from "next/server";
import { buildTarotReadingLlmPayload } from "@/lib/server/buildTarotReadingLlmPayload";
import { parseParallelReadingRequest } from "@/lib/server/parseTarotParallelReadingRequest";
import { requestMagoParallelSynthesis } from "@/lib/server/requestMagoParallelReading";
import { verifySupabaseAccessToken } from "@/lib/server/verifySupabaseAccessToken";

/** 카드 초안과 독립적으로 전체 카드의 연결·행동 조언을 생성합니다. */
export async function POST(request: Request) {
  const requestStartedAt = performance.now();
  const accessToken = extractBearerToken(request);
  if (accessToken == null) {
    return respond(
      { ok: false, error: "로그인이 필요합니다.", code: "UNAUTHORIZED" },
      requestStartedAt,
      401,
    );
  }

  const verified = await verifySupabaseAccessToken(accessToken);
  if (verified == null) {
    return respond(
      {
        ok: false,
        error: "유효하지 않은 인증 토큰입니다.",
        code: "UNAUTHORIZED",
      },
      requestStartedAt,
      401,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return respond(
      {
        ok: false,
        error: "요청 본문이 올바른 JSON이 아닙니다.",
        code: "BAD_REQUEST",
      },
      requestStartedAt,
      400,
    );
  }

  const parsed = parseParallelReadingRequest(body);
  if (parsed == null) {
    return respond(
      {
        ok: false,
        error: "병렬 리딩 요청 형식이 올바르지 않습니다.",
        code: "BAD_REQUEST",
      },
      requestStartedAt,
      400,
    );
  }

  const payloadResult = await buildTarotReadingLlmPayload(
    verified.userId,
    parsed.request,
  );
  if (!payloadResult.ok) {
    return respond(
      {
        ok: false,
        error: payloadResult.message,
        code: payloadResult.code,
      },
      requestStartedAt,
      payloadResult.code === "POSITION_MISSING" ? 400 : 500,
    );
  }

  const result = await requestMagoParallelSynthesis(payloadResult.payload);
  if (!result.ok) {
    return respond(
      { ok: false, error: result.message, code: result.code },
      requestStartedAt,
      result.code === "ENV_MISSING" ? 500 : 502,
    );
  }

  return respond(
    { ok: true, synthesis: result.synthesis },
    requestStartedAt,
    200,
  );
}

function respond(body: unknown, startedAt: number, status: number) {
  const response = NextResponse.json(body, { status });
  response.headers.set(
    "Server-Timing",
    `total;dur=${(performance.now() - startedAt).toFixed(1)}`,
  );
  return response;
}

function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  return authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;
}
