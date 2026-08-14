import { NextResponse } from "next/server";
import {
  fetchCoinHistoriesPageFromDb,
  normalizeCoinHistoriesPagination,
} from "@/lib/server/fetchCoinDataFromDb";
import { verifySupabaseAccessToken } from "@/lib/server/verifySupabaseAccessToken";

/** GET /api/coins/histories?offset=&limit= — 본인 coin_histories 이용 내역 페이지 */
export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const pagination = normalizeCoinHistoriesPagination(
    searchParams.get("offset") ?? "0",
    searchParams.get("limit") ?? "10",
  );

  if (!pagination.ok) {
    return NextResponse.json(
      { ok: false, error: pagination.message, code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const data = await fetchCoinHistoriesPageFromDb(verified.userId, pagination);
  return NextResponse.json({ ok: true, data });
}

function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  return null;
}
