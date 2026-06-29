"use client";

import { useQuery } from "@tanstack/react-query";
import FullscreenRuneLoadingOverlay from "@/components/common/fullscreen-rune-loading-overlay/FullscreenRuneLoadingOverlay";
import ResultCardDetail from "@/components/tarot/result/ResultCardDetail";
import ResultCardOverview from "@/components/tarot/result/ResultCardOverview";
import ResultFinalAdvice from "@/components/tarot/result/ResultFinalAdvice";
import ResultRating from "@/components/tarot/result/ResultRating";
import ResultScrollToTopButton from "@/components/tarot/result/ResultScrollToTopButton";
import ResultSelectionSummary from "@/components/tarot/result/ResultSelectionSummary";
import { requestFetchTarotSessionFromClient } from "@/lib/requestFetchTarotSessionFromClient";
import { supabase } from "@/lib/supabaseClient";
import {
  tarotReadingQueryKey,
  type TarotReadingQueryData,
} from "@/lib/tarotReadingQuery";
import {
  ContentLayer,
  ContentMax,
  ErrorPanel,
  ErrorText,
  TopRow,
} from "./page.style";

type ResultPageClientProps = {
  readingId: string;
};

/** useQuery — Bearer + GET API (서버 prefetch 실패 시 fallback) */
async function fetchTarotReadingQueryData(
  readingId: string,
): Promise<TarotReadingQueryData> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError != null || session?.access_token == null) {
    throw new Error("로그인이 필요합니다.");
  }

  const result = await requestFetchTarotSessionFromClient(
    readingId,
    session.access_token,
  );

  if (!result.ok) {
    throw new Error(result.error);
  }

  return result.data;
}

/**
 * 타로 결과 페이지 클라이언트 — TanStack Query hydrate + UI
 */
export default function ResultPageClient({ readingId }: ResultPageClientProps) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: tarotReadingQueryKey(readingId),
    queryFn: () => fetchTarotReadingQueryData(readingId),
  });

  const scrollToCardDetail = (slotIndex: number) => {
    const order = slotIndex + 1;
    document
      .getElementById(`tarot-result-card-detail-${order}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isPending && data == null) {
    return (
      <FullscreenRuneLoadingOverlay
        caption="리딩 결과를 불러오는 중..."
        ariaLabel="리딩 결과를 불러오는 중입니다."
      />
    );
  }

  if (isError || data == null) {
    const message =
      error instanceof Error ? error.message : "리딩 결과를 불러오지 못했습니다.";
    return (
      <ContentLayer>
        <ContentMax>
          <ErrorPanel role="alert">
            <ErrorText>{message}</ErrorText>
          </ErrorPanel>
        </ContentMax>
      </ContentLayer>
    );
  }

  const { viewData, thumbSlots, review } = data;

  return (
    <ContentLayer>
      <ContentMax>
        <TopRow>
          <ResultSelectionSummary
            drawnCardsLabel={viewData.selection.drawnCardsLabel}
            categoryId={viewData.selection.categoryId}
            categoryLabel={viewData.selection.categoryLabel}
            intentTagLabel={viewData.selection.intentTagLabel}
            situation={viewData.selection.situation}
            question={viewData.selection.question}
            flowScore={viewData.selection.flowScore}
          />
          <ResultCardOverview
            slotCount={viewData.overview.slotCount}
            insight={viewData.overview.insight}
            thumbSlots={thumbSlots}
            onSlotClick={scrollToCardDetail}
          />
        </TopRow>
        {viewData.cardDetails.map((card) => (
          <ResultCardDetail
            key={card.orderIndex}
            orderIndex={card.orderIndex}
            phaseNumber={card.phaseNumber}
            phaseLabel={card.phaseLabel}
            cardName={card.cardName}
            summaryLine={card.summaryLine}
            magoInterpretation={card.magoInterpretation}
            thumbSlot={thumbSlots[card.orderIndex - 1]}
          />
        ))}
        <ResultFinalAdvice adviceText={viewData.finalAdvice} />
        <ResultRating readingId={readingId} hasReviewed={review.hasReviewed} />
      </ContentMax>
      <ResultScrollToTopButton />
    </ContentLayer>
  );
}
