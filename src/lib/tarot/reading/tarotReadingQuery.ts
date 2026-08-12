import type { ResultCardThumbSlot, ResultPageViewData } from "@/types/tarotResult";

/** TanStack Query — 타로 결과 페이지 캐시 키 */
export const tarotReadingQueryKey = (readingId: string) =>
  ["reading", readingId] as const;

/** 결과 페이지 후기 영역 — tarot_sessions.has_reviewed / rating / review_content */
export type TarotReadingReviewData = {
  hasReviewed: boolean;
  rating: number | null;
  reviewContent: string | null;
};

/** 결과 페이지 useQuery 데이터 — UI + 썸네일 슬롯 + 후기 */
export type TarotReadingQueryData = {
  viewData: ResultPageViewData;
  thumbSlots: readonly ResultCardThumbSlot[];
  review: TarotReadingReviewData;
};
