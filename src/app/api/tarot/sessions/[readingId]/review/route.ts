import { NextResponse } from "next/server";
import { saveTarotSessionReviewToDb } from "@/lib/server/saveTarotSessionReviewToDb";
import { verifySupabaseAccessToken } from "@/lib/server/verifySupabaseAccessToken";
import type { SubmitTarotSessionReviewErrorCode } from "@/types/tarotSessionDb";

type RouteContext = {
  params: Promise<{ readingId: string }>;
};

type SubmitReviewBody = {
  rating?: unknown;
  reviewContent?: unknown;
};

/** PATCH /api/tarot/sessions/[readingId]/review — 별점·텍스트 후기 저장 */
export async function PATCH(request: Request, context: RouteContext) {
  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

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

  const { readingId } = await context.params;
  if (typeof readingId !== "string" || readingId.trim().length === 0) {
    return NextResponse.json(
      { ok: false, error: "readingId가 필요합니다.", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "요청 본문이 올바른 JSON이 아닙니다.", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const parsed = parseSubmitReviewBody(body as SubmitReviewBody);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: parsed.message, code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const result = await saveTarotSessionReviewToDb({
    readingId: readingId.trim(),
    userId: verified.userId,
    rating: parsed.rating,
    reviewContent: parsed.reviewContent,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.message, code: result.code },
      { status: toHttpStatus(result.code) },
    );
  }

  return NextResponse.json({ ok: true });
}

function parseSubmitReviewBody(
  body: SubmitReviewBody,
):
  | { ok: true; rating: number; reviewContent: string | null }
  | { ok: false; message: string } {
  if (typeof body.rating !== "number" || !Number.isInteger(body.rating)) {
    return { ok: false, message: "rating(1~5 정수)이 필요합니다." };
  }
  if (body.rating < 1 || body.rating > 5) {
    return { ok: false, message: "rating은 1~5 사이여야 합니다." };
  }

  let reviewContent: string | null = null;
  if (body.reviewContent != null) {
    if (typeof body.reviewContent !== "string") {
      return { ok: false, message: "reviewContent는 문자열이어야 합니다." };
    }
    const trimmed = body.reviewContent.trim();
    reviewContent = trimmed.length > 0 ? trimmed : null;
  }

  return { ok: true, rating: body.rating, reviewContent };
}

function toHttpStatus(code: SubmitTarotSessionReviewErrorCode): number {
  switch (code) {
    case "VALIDATION":
      return 400;
    case "NOT_FOUND":
      return 404;
    case "ALREADY_REVIEWED":
      return 409;
    case "ENV_MISSING":
    case "UPDATE_FAILED":
      return 500;
    default:
      return 500;
  }
}
