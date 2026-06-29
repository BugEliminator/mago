import {
  getTarotCategoryIdFromBadgeLabel,
} from "@/components/tarot/setup/setupIntentCatalog";
import { getTarotCardStoragePublicUrl } from "@/lib/tarotCardStorageUrl";
import type { TarotReadingQueryData } from "@/lib/tarotReadingQuery";
import type {
  TarotSessionCardRow,
  TarotSessionRow,
} from "@/types/tarotSessionDb";
import type {
  ResultPageCardDetailData,
  ResultCardThumbSlot,
} from "@/types/tarotResult";

/** card_count → "3장" 라벨 */
function toDrawnCardsLabel(cardCount: number): string {
  return `${cardCount}장`;
}

/** DB paragraphs — string[] 또는 null 방어 */
function normalizeParagraphs(
  paragraphs: readonly string[] | null | undefined,
): [string, string] {
  const p0 = paragraphs?.[0] ?? "";
  const p1 = paragraphs?.[1] ?? "";
  return [p0, p1];
}

/**
 * tarot_sessions + tarot_session_cards → 결과 페이지 Query/UI 데이터
 */
export function mapTarotSessionDbToResultPage(
  session: TarotSessionRow,
  cards: readonly TarotSessionCardRow[],
): TarotReadingQueryData {
  const categoryId = getTarotCategoryIdFromBadgeLabel(session.main_category);

  const sortedCards = [...cards].sort(
    (a, b) => a.order_index - b.order_index,
  );

  const thumbSlots: ResultCardThumbSlot[] = sortedCards.map((card) => ({
    faceSrc: getTarotCardStoragePublicUrl(card.card_id),
    isReversed: card.is_reversed,
    resolved: true,
  }));

  const cardDetails: ResultPageCardDetailData[] = sortedCards.map((card) => {
    const paragraphs = normalizeParagraphs(card.paragraphs);
    return {
      orderIndex: card.order_index,
      phaseNumber: card.order_index,
      phaseLabel: card.phase_label,
      cardName: card.card_name_en,
      summaryLine: card.one_liner,
      magoInterpretation: paragraphs.filter((p) => p.length > 0).join("\n\n"),
    };
  });

  return {
    viewData: {
      selection: {
        drawnCardsLabel: toDrawnCardsLabel(session.card_count),
        categoryId,
        categoryLabel: session.main_category,
        intentTagLabel: session.detail_category,
        situation: session.user_situation,
        question: session.user_question,
        flowScore: session.fortune_score,
      },
      overview: {
        slotCount: sortedCards.length,
        insight: session.summary_line,
      },
      cardDetails,
      finalAdvice: session.final_advice,
    },
    thumbSlots,
    review: {
      hasReviewed: session.has_reviewed,
      rating: session.rating,
      reviewContent: session.review_content,
    },
  };
}
