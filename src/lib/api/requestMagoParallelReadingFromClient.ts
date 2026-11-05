import type {
  MagoCardDraft,
  MagoCardDraftBrowserRequest,
  MagoParallelReadingBrowserRequest,
  MagoParallelSynthesis,
} from "@/types/magoParallelReading";

export type MagoCardDraftClientResult =
  | { ok: true; draft: MagoCardDraft }
  | { ok: false; error: string; code?: string };

export type MagoParallelSynthesisClientResult =
  | { ok: true; synthesis: MagoParallelSynthesis }
  | { ok: false; error: string; code?: string };

export async function requestMagoCardDraftFromClient(
  input: MagoCardDraftBrowserRequest & { accessToken: string },
): Promise<MagoCardDraftClientResult> {
  const { accessToken, ...body } = input;
  const response = await postJson(
    "/api/tarot/reading/card-draft",
    accessToken,
    body,
  );
  if (!response.ok) return response;

  const draft = response.data.draft;
  if (!isMagoCardDraft(draft)) {
    return { ok: false, error: "카드 초안 응답을 해석할 수 없습니다." };
  }
  return { ok: true, draft };
}

export async function requestMagoParallelSynthesisFromClient(
  input: MagoParallelReadingBrowserRequest & { accessToken: string },
): Promise<MagoParallelSynthesisClientResult> {
  const { accessToken, ...body } = input;
  const response = await postJson(
    "/api/tarot/reading/parallel",
    accessToken,
    body,
  );
  if (!response.ok) return response;

  const synthesis = parseMagoParallelSynthesis(response.data.synthesis);
  if (synthesis == null) {
    return { ok: false, error: "병렬 리딩 응답을 해석할 수 없습니다." };
  }
  return { ok: true, synthesis };
}

type PostJsonResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string; code?: string };

async function postJson(
  url: string,
  accessToken: string,
  body: unknown,
): Promise<PostJsonResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, error: "네트워크 오류로 리딩 요청에 실패했습니다." };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    return { ok: false, error: "서버 응답을 해석할 수 없습니다." };
  }

  const parsed = data as Record<string, unknown>;
  if (!response.ok || parsed.ok !== true) {
    return {
      ok: false,
      error:
        typeof parsed.error === "string"
          ? parsed.error
          : "리딩 요청에 실패했습니다.",
      code: typeof parsed.code === "string" ? parsed.code : undefined,
    };
  }

  return { ok: true, data: parsed };
}

function isMagoCardDraft(value: unknown): value is MagoCardDraft {
  if (value == null || typeof value !== "object") return false;
  const draft = value as Record<string, unknown>;
  return (
    typeof draft.slotIndex === "number" &&
    typeof draft.cardNameEn === "string" &&
    typeof draft.isReversed === "boolean" &&
    typeof draft.meaningParagraph === "string"
  );
}

function parseMagoParallelSynthesis(
  value: unknown,
): MagoParallelSynthesis | null {
  if (value == null || typeof value !== "object") return null;
  const synthesis = value as Record<string, unknown>;
  if (
    typeof synthesis.resScore !== "number" ||
    typeof synthesis.resScoreStatus !== "string" ||
    typeof synthesis.resTheme !== "string" ||
    typeof synthesis.adviceSummary !== "string" ||
    !Array.isArray(synthesis.readingCompletions)
  ) {
    return null;
  }

  const readingCompletions = synthesis.readingCompletions.flatMap((value) => {
    if (value == null || typeof value !== "object") return [];
    const completion = value as Record<string, unknown>;
    if (
      typeof completion.slotIndex !== "number" ||
      typeof completion.oneLiner !== "string" ||
      typeof completion.actionParagraph !== "string"
    ) {
      return [];
    }
    return [
      {
        slotIndex: completion.slotIndex,
        oneLiner: completion.oneLiner,
        actionParagraph: completion.actionParagraph,
      },
    ];
  });
  if (readingCompletions.length !== synthesis.readingCompletions.length) {
    return null;
  }

  return {
    resScore: synthesis.resScore,
    resScoreStatus: synthesis.resScoreStatus,
    resTheme: synthesis.resTheme,
    readingCompletions,
    adviceSummary: synthesis.adviceSummary,
  };
}
