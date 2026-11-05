import { NextResponse } from "next/server";
import { buildTarotCardDraftLlmPayload } from "@/lib/server/buildTarotReadingLlmPayload";
import { parseCardDraftRequest } from "@/lib/server/parseTarotParallelReadingRequest";
import { requestMagoCardDraft } from "@/lib/server/requestMagoParallelReading";
import { verifySupabaseAccessToken } from "@/lib/server/verifySupabaseAccessToken";

/** 카드 한 장이 확정되는 즉시 첫 문단을 선행 생성합니다. */
export async function POST(request: Request) {
  const accessToken = extractBearerToken(request);
  if (accessToken == null) {
    return NextResponse.json(
      { ok: false, error: "로그인이 필요합니다.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const verified = await verifySupabaseAccessToken(accessToken);
  if (verified == null) {
    return NextResponse.json(
      {
        ok: false,
        error: "유효하지 않은 인증 토큰입니다.",
        code: "UNAUTHORIZED",
      },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "요청 본문이 올바른 JSON이 아닙니다.",
        code: "BAD_REQUEST",
      },
      { status: 400 },
    );
  }

  const parsed = parseCardDraftRequest(body);
  if (parsed == null) {
    return NextResponse.json(
      {
        ok: false,
        error: "카드 초안 요청 형식이 올바르지 않습니다.",
        code: "BAD_REQUEST",
      },
      { status: 400 },
    );
  }

  const payloadResult = await buildTarotCardDraftLlmPayload(
    verified.userId,
    parsed.request,
    parsed.slotIndex,
  );
  if (!payloadResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: payloadResult.message,
        code: payloadResult.code,
      },
      { status: payloadResult.code === "POSITION_MISSING" ? 400 : 500 },
    );
  }

  const draftResult = await requestMagoCardDraft(
    payloadResult.payload,
    parsed.slotIndex,
  );
  if (!draftResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: draftResult.message,
        code: draftResult.code,
      },
      { status: draftResult.code === "ENV_MISSING" ? 500 : 502 },
    );
  }

  return NextResponse.json({ ok: true, draft: draftResult.draft });
}

function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  return authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;
}
