import { NextResponse } from "next/server";
import {
  fetchTarotSessionsListPageFromDb,
  normalizeHistorySessionsPagination,
} from "@/lib/server/fetchTarotSessionsListFromDb";
import { parseMagoLlmResult } from "@/lib/tarot/map/magoResultMapper";
import { saveTarotSessionToDb } from "@/lib/server/saveTarotSessionToDb";
import { verifySupabaseAccessToken } from "@/lib/server/verifySupabaseAccessToken";
import type { MagoLlmResult } from "@/types/magoResult";
import type { TarotSessionSetup } from "@/types/tarot";
import type { SaveTarotSessionErrorCode } from "@/types/tarotSessionDb";

type CreateTarotSessionBody = {
  sessionId?: unknown;
  setup?: unknown;
  llm?: unknown;
};

type VerifiedAuth =
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse };

/** GET /api/tarot/sessions?offset=&limit= — 본인 tarot_sessions 히스토리 목록 페이지 */
export async function GET(request: Request) {
  const auth = await verifyRequestAuth(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const pagination = normalizeHistorySessionsPagination(
    searchParams.get("offset") ?? "0",
    searchParams.get("limit") ?? "10",
  );

  if (!pagination.ok) {
    return NextResponse.json(
      { ok: false, error: pagination.message, code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const data = await fetchTarotSessionsListPageFromDb(auth.userId, pagination);
  return NextResponse.json({ ok: true, data });
}

/** POST /api/tarot/sessions — LLM 결과 + setup을 tarot_sessions / tarot_session_cards에 저장 */
export async function POST(request: Request) {
  const auth = await verifyRequestAuth(request);
  if (!auth.ok) return auth.response;

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

  const parsed = parseCreateTarotSessionBody(body as CreateTarotSessionBody);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: parsed.message, code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const result = await saveTarotSessionToDb({
    sessionId: parsed.sessionId,
    userId: auth.userId,
    setup: parsed.setup,
    llm: parsed.llm,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.message, code: result.code },
      { status: toHttpStatus(result.code) },
    );
  }

  return NextResponse.json({ ok: true, sessionId: result.sessionId });
}

async function verifyRequestAuth(request: Request): Promise<VerifiedAuth> {
  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (accessToken == null) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "로그인이 필요합니다.", code: "UNAUTHORIZED" },
        { status: 401 },
      ),
    };
  }

  const verified = await verifySupabaseAccessToken(accessToken);
  if (verified == null) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          ok: false,
          error: "유효하지 않은 인증 토큰입니다.",
          code: "UNAUTHORIZED",
        },
        { status: 401 },
      ),
    };
  }

  return { ok: true, userId: verified.userId };
}

function parseCreateTarotSessionBody(
  body: CreateTarotSessionBody,
):
  | { ok: true; sessionId: string; setup: TarotSessionSetup; llm: MagoLlmResult }
  | { ok: false; message: string } {
  if (typeof body.sessionId !== "string" || body.sessionId.trim().length === 0) {
    return { ok: false, message: "sessionId(UUID)가 필요합니다." };
  }
  if (!isTarotSessionSetup(body.setup)) {
    return { ok: false, message: "setup 형식이 올바르지 않습니다." };
  }
  if (!isMagoLlmResult(body.llm)) {
    return { ok: false, message: "llm 형식이 올바르지 않습니다." };
  }

  return {
    ok: true,
    sessionId: body.sessionId.trim(),
    setup: body.setup,
    llm: body.llm,
  };
}

function isTarotSessionSetup(value: unknown): value is TarotSessionSetup {
  if (value == null || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.detailTag === "string" &&
    typeof v.situation === "string" &&
    typeof v.question === "string" &&
    (v.category === null || typeof v.category === "string") &&
    (v.cardCount === null ||
      v.cardCount === 3 ||
      v.cardCount === 5 ||
      v.cardCount === 7)
  );
}

function isMagoLlmResult(value: unknown): value is MagoLlmResult {
  if (value == null || typeof value !== "object") return false;
  const json = JSON.stringify(value);
  return parseMagoLlmResult(json) != null;
}

function toHttpStatus(code: SaveTarotSessionErrorCode): number {
  switch (code) {
    case "ENV_MISSING":
      return 500;
    case "VALIDATION":
    case "CARD_LOOKUP":
      return 400;
    case "DUPLICATE_SESSION":
      return 409;
    case "SESSION_INSERT":
    case "CARDS_INSERT":
      return 500;
    default:
      return 500;
  }
}
