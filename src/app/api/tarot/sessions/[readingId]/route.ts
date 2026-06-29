import { NextResponse } from "next/server";
import { getTarotReadingQueryData } from "@/lib/server/fetchTarotSessionFromDb";
import { verifySupabaseAccessToken } from "@/lib/server/verifySupabaseAccessToken";

type RouteContext = {
  params: Promise<{ readingId: string }>;
};

/** GET /api/tarot/sessions/[readingId] — 본인 리딩 세션 + 카드 조회 */
export async function GET(request: Request, context: RouteContext) {
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

  const data = await getTarotReadingQueryData(readingId.trim(), verified.userId);
  if (data == null) {
    return NextResponse.json(
      { ok: false, error: "리딩 결과를 찾을 수 없습니다.", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, data });
}
