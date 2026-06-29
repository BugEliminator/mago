import { NextResponse } from "next/server";
import { deleteAuthUser } from "@/lib/server/deleteAuthUser";
import {
  resolveWithdrawUserEmail,
  saveDeletedUserEmailHash,
} from "@/lib/server/deletedUserHash";
import { verifySupabaseAccessToken } from "@/lib/server/verifySupabaseAccessToken";

/** POST /api/auth/withdraw — 회원 탈퇴 (auth.users 삭제 + 탈퇴 이메일 해시 보관) */
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

  const emailForHash = await resolveWithdrawUserEmail({
    userId: verified.userId,
    authEmail: verified.email,
  });

  const result = await deleteAuthUser(verified.userId);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.message, code: result.code },
      { status: 500 },
    );
  }

  if (emailForHash != null) {
    const hashResult = await saveDeletedUserEmailHash(emailForHash);
    if (!hashResult.ok) {
      return NextResponse.json(
        { ok: false, error: hashResult.message, code: hashResult.code },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}

function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  return null;
}
