import { NextResponse } from "next/server";
import { getTarotReadingQueryData } from "@/lib/server/fetchTarotSessionFromDb";
import { verifySupabaseAccessToken } from "@/lib/server/verifySupabaseAccessToken";

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
