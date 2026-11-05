import type { TarotReadingPickedCardRequest } from "@/types/tarotReadingRequest";
import type { TarotSessionSetup } from "@/types/tarot";

/** 카드가 확정되는 즉시 생성하는 카드 한 장의 선행 해석 */
export type MagoCardDraft = {
  slotIndex: number;
  cardNameEn: string;
  isReversed: boolean;
  meaningParagraph: string;
};

export type MagoParallelReadingCompletion = {
  slotIndex: number;
  oneLiner: string;
  actionParagraph: string;
};

/** 카드 초안과 독립적으로 생성하는 전체 리딩 종합 결과 */
export type MagoParallelSynthesis = {
  resScore: number;
  resScoreStatus: string;
  resTheme: string;
  readingCompletions: MagoParallelReadingCompletion[];
  adviceSummary: string;
};

/** 카드 한 장 선행 해석 API 요청 */
export type MagoCardDraftBrowserRequest = {
  setup: TarotSessionSetup;
  pickedCard: TarotReadingPickedCardRequest;
  slotIndex: number;
};

/** 카드 초안과 독립적으로 전체 흐름을 종합하는 API 요청 */
export type MagoParallelReadingBrowserRequest = {
  setup: TarotSessionSetup;
  pickedCards: TarotReadingPickedCardRequest[];
};
