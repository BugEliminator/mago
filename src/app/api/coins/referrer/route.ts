import { NextResponse } from "next/server";
import { applyReferrerReward } from "@/lib/server/applyReferrerReward";
import { verifySupabaseAccessToken } from "@/lib/server/verifySupabaseAccessToken";

type ReferrerBody = {
  referrerCode?: unknown;
};

/** POST /api/coins/referrer — 가입 완료 후 추천인 보상 (잘못된 코드는 스킵) */
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
      { ok: false, error: "유효하지 않은 인증 토큰입니다.", code: "UNAUTHORIZED" },
      { status: 401 },
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

  const referrerCode = (body as ReferrerBody).referrerCode;
  if (typeof referrerCode !== "string") {
    return NextResponse.json(
      { ok: false, error: "referrerCode가 필요합니다.", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const result = await applyReferrerReward(verified.userId, referrerCode);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.message, code: result.code },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    applied: result.applied,
    newBalance: result.applied ? result.newBalance : undefined,
  });
}

function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  return null;
}
