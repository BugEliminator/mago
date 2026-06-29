import { NextResponse } from "next/server";
import { normalizeSignupEmail } from "@/lib/deletedUserCooldown";
import { checkDeletedUserSignupCooldown } from "@/lib/server/deletedUserHash";

type CheckSignupEmailBody = {
  email?: unknown;
};

/** POST /api/auth/check-signup-email — 탈퇴 후 14일 재가입 쿨다운 확인 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "요청 본문이 올바른 JSON이 아닙니다.", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const email = parseEmail(body as CheckSignupEmailBody);
  if (email == null) {
    return NextResponse.json(
      { ok: false, error: "올바른 이메일이 필요합니다.", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const cooldown = await checkDeletedUserSignupCooldown(email);

  if (cooldown.blocked) {
    return NextResponse.json({
      ok: true,
      allowed: false,
      code: "WITHDRAW_COOLDOWN",
      daysUntilEligible: cooldown.daysUntilEligible,
    });
  }

  return NextResponse.json({ ok: true, allowed: true });
}

function parseEmail(body: CheckSignupEmailBody): string | null {
  if (typeof body.email !== "string") return null;
  const normalized = normalizeSignupEmail(body.email);
  if (normalized.length === 0 || !normalized.includes("@")) return null;
  return normalized;
}
