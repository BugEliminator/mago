import { NextResponse } from "next/server";
import { claimAttendanceReward } from "@/lib/server/claimAttendanceReward";
import { hasCheckedInTodayForUser } from "@/lib/server/hasCheckedInTodayForUser";
import { verifySupabaseAccessToken } from "@/lib/server/verifySupabaseAccessToken";
import { COIN_HISTORY_TITLES, COIN_REWARD_ATTENDANCE } from "@/lib/coinRewards";
import { formatCoinHistoryDateLabel } from "@/lib/coinKst";

/** GET /api/coins/attendance — 오늘 출석 완료 여부 확인 */
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

  const hasCheckedInToday = await hasCheckedInTodayForUser(verified.userId);
  return NextResponse.json({ ok: true, hasCheckedInToday });
}

/** POST /api/coins/attendance — 일일 출석 보상 (+20) */
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

  const result = await claimAttendanceReward(verified.userId);

  if (!result.ok) {
    const status = result.code === "ALREADY_CHECKED_IN" ? 409 : 500;
    return NextResponse.json(
      { ok: false, error: result.message, code: result.code },
      { status },
    );
  }

  const nowIso = new Date().toISOString();

  return NextResponse.json({
    ok: true,
    newBalance: result.newBalance,
    history: {
      id: result.historyId,
      type: "EARN_ATTENDANCE" as const,
      title: COIN_HISTORY_TITLES.EARN_ATTENDANCE,
      amount: COIN_REWARD_ATTENDANCE,
      createdAt: nowIso,
      dateLabel: formatCoinHistoryDateLabel(nowIso),
    },
  });
}

function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  return null;
}
