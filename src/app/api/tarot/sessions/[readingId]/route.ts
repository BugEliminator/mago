import { NextResponse } from "next/server";
import { getTarotReadingQueryData } from "@/lib/server/fetchTarotSessionFromDb";
import { softDeleteTarotSessionFromDb } from "@/lib/server/softDeleteTarotSessionFromDb";
import { verifySupabaseAccessToken } from "@/lib/server/verifySupabaseAccessToken";
import type { SoftDeleteTarotSessionErrorCode } from "@/types/tarotSessionDb";

type RouteContext = {
  params: Promise<{ readingId: string }>;
};

/**
 * GET /api/tarot/sessions/[readingId]
 * — UUID를 알면 로그인 없이 조회. Bearer가 있고 소유자면 isOwner=true
 */
export async function GET(request: Request, context: RouteContext) {
  const { readingId } = await context.params;
  if (typeof readingId !== "string" || readingId.trim().length === 0) {
    return NextResponse.json(
      { ok: false, error: "readingId가 필요합니다.", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  let viewerUserId: string | null = null;
  if (accessToken != null) {
    const verified = await verifySupabaseAccessToken(accessToken);
    viewerUserId = verified?.userId ?? null;
  }

  const data = await getTarotReadingQueryData(readingId.trim(), viewerUserId);
  if (data == null) {
    return NextResponse.json(
      { ok: false, error: "리딩 결과를 찾을 수 없습니다.", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, data });
}

/**
 * DELETE /api/tarot/sessions/[readingId]
 * — 로그인 소유자만 소프트 삭제 (deleted_at)
 */
export async function DELETE(request: Request, context: RouteContext) {
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

  const result = await softDeleteTarotSessionFromDb({
    readingId: readingId.trim(),
    userId: verified.userId,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.message, code: result.code },
      { status: toDeleteHttpStatus(result.code) },
    );
  }

  return NextResponse.json({ ok: true });
}

function toDeleteHttpStatus(code: SoftDeleteTarotSessionErrorCode): number {
  switch (code) {
    case "NOT_FOUND":
      return 404;
    case "ENV_MISSING":
    case "UPDATE_FAILED":
      return 500;
    default:
      return 500;
  }
}
