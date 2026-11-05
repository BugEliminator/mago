import { getTarotSpreadPositionMeta } from "@/lib/tarot/spread/tarotSpreadPositionMeta";
import type { MagoLlmResult } from "@/types/magoResult";
import type {
  MagoCardDraft,
  MagoParallelSynthesis,
} from "@/types/magoParallelReading";
import type { TarotSessionSetup } from "@/types/tarot";

/** 서로 독립적으로 생성된 카드 첫 문단과 전체 종합을 기존 결과 구조로 조립합니다. */
export function assembleMagoParallelResult(
  setup: TarotSessionSetup,
  drafts: readonly MagoCardDraft[],
  synthesis: MagoParallelSynthesis,
): MagoLlmResult | null {
  if (setup.cardCount == null || setup.category == null) return null;
  const cardCount = setup.cardCount;
  const category = setup.category;
  if (
    drafts.length !== cardCount ||
    synthesis.readingCompletions.length !== cardCount
  ) {
    return null;
  }

  const draftMap = new Map(drafts.map((draft) => [draft.slotIndex, draft]));
  const completionMap = new Map(
    synthesis.readingCompletions.map((completion) => [
      completion.slotIndex,
      completion,
    ]),
  );
  if (
    draftMap.size !== cardCount ||
    completionMap.size !== cardCount
  ) {
    return null;
  }

  const readings = Array.from({ length: cardCount }, (_, slotIndex) => {
    const draft = draftMap.get(slotIndex);
    const completion = completionMap.get(slotIndex);
    const position = getTarotSpreadPositionMeta(
      cardCount,
      category,
      slotIndex,
      setup.detailTag,
    );
    if (draft == null || completion == null || position == null) return null;

    return {
      label: position.label,
      card_name_en: draft.cardNameEn,
      is_reversed: draft.isReversed,
      one_liner: completion.oneLiner,
      paragraphs: [
        draft.meaningParagraph,
        completion.actionParagraph,
      ] as [string, string],
    };
  });
  if (readings.some((reading) => reading == null)) return null;

  return {
    res_score: synthesis.resScore,
    res_score_status: synthesis.resScoreStatus,
    res_theme: synthesis.resTheme,
    res_readings: readings.filter((reading) => reading != null),
    res_mago_advice: { summary: synthesis.adviceSummary },
  };
}
