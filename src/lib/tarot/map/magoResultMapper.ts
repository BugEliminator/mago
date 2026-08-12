import {
  getIntentCategoryBadgeLabel,
} from "@/components/tarot/setup/setupIntentCatalog";
import type { TarotSessionSetup } from "@/types/tarot";
import type { MagoLlmResult } from "@/types/magoResult";
import type {
  ResultPageViewData,
  ResultPageCardDetailData,
} from "@/types/tarotResult";

/**
 * `TarotSessionSetup`의 `cardCount`를 한글 라벨로 변환 (예: 3 → "3장")
 */
function toDrawnCardsLabel(cardCount: number | null): string {
  if (cardCount == null) return "";
  return `${cardCount}장`;
}

/**
 * MAGO_v1 LLM 응답 + 리딩 setup → 결과 페이지 전체 뷰 데이터
 *
 * @param llm - OpenAI/AX에서 받은 JSON (MagoLlmResult)
 * @param setup - 리딩 전 사용자 설정 (localStorage tarotSetup)
 */
export function mapMagoResultToResultPage(
  llm: MagoLlmResult,
  setup: TarotSessionSetup,
): ResultPageViewData {
  const categoryId = setup.category ?? "custom";
  const categoryLabel = getIntentCategoryBadgeLabel(categoryId);

  const cardDetails: ResultPageCardDetailData[] = llm.res_readings.map(
    (reading, idx) => ({
      orderIndex: idx + 1,
      phaseNumber: idx + 1,
      phaseLabel: reading.label,
      cardName: reading.card_name_en,
      summaryLine: reading.one_liner,
      magoInterpretation: reading.paragraphs.join("\n\n"),
    }),
  );

  return {
    selection: {
      drawnCardsLabel: toDrawnCardsLabel(setup.cardCount),
      categoryId,
      categoryLabel,
      intentTagLabel: setup.detailTag,
      situation: setup.situation,
      question: setup.question,
      flowScore: llm.res_score,
    },
    overview: {
      slotCount: llm.res_readings.length,
      insight: llm.res_theme,
    },
    cardDetails,
    finalAdvice: llm.res_mago_advice.summary,
  };
}

/**
 * sessionStorage / 붙여넣기용 JSON 문자열을 파싱해 `MagoLlmResult`로 변환.
 * 파싱 실패 시 null 반환.
 */
export function parseMagoLlmResult(json: string): MagoLlmResult | null {
  try {
    const parsed = JSON.parse(json) as MagoLlmResult;
    if (
      typeof parsed.res_score !== "number" ||
      !Array.isArray(parsed.res_readings) ||
      typeof parsed.res_mago_advice?.summary !== "string"
    ) {
      return null;
    }
    const readingsValid = parsed.res_readings.every(
      (r) =>
        typeof r.card_name_en === "string" &&
        typeof r.is_reversed === "boolean",
    );
    if (!readingsValid) {
      console.warn("[MAGO] res_readings 항목에 card_name_en 또는 is_reversed 누락");
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
