"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { CircleDollarSign, Star } from "lucide-react";
import { toast } from "sonner";
import { requestSubmitTarotSessionReviewFromClient } from "@/lib/api/requestSubmitTarotSessionReviewFromClient";
import { COIN_REWARD_REVIEW } from "@/lib/coin/coinRewards";
import { useCoinStore } from "@/stores/coinStore";
import { supabase } from "@/lib/supabase/supabaseClient";
import {
  tarotReadingQueryKey,
  type TarotReadingQueryData,
} from "@/lib/tarot/reading/tarotReadingQuery";
import type { TarotResultRatingProps } from "@/types/tarotResult";
import {
  DoneIconCircle,
  DoneSub,
  DoneTitle,
  DoneWrap,
  FeedbackBlock,
  FeedbackCaption,
  FeedbackTextarea,
  Panel,
  StarButton,
  StarsRow,
  SubmitButton,
  SubtitleGroup,
  SubtitleLine,
  SubtitlePhrase,
  Title,
} from "./ResultRating.style";

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

const CONFETTI_COLORS = [
  "#f43f5e",
  "#f59e0b",
  "#fde047",
  "#22d3ee",
  "#8b5cf6",
  "#d946ef",
  "#86efac",
] as const;

/**
 * 결과 하단 — 리딩 만족도 별점·선택 피드백 (DB has_reviewed 연동)
 */
export default function ResultRating({
  readingId,
  hasReviewed,
}: TarotResultRatingProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 스텝 페이지 카드 돌아가는거 수정, 페이지네이션 최대 3~5개만 보이게
  const triggerConfetti = (): void => {
    void confetti({
      particleCount: 200,
      spread: 140,
      startVelocity: 42,
      gravity: 0.75,
      decay: 0.93,
      ticks: 260,
      scalar: 0.75,
      origin: { x: 0.5, y: 0.55 },
      colors: [...CONFETTI_COLORS],
      shapes: ["square", "circle"],
      zIndex: 10_000,
      disableForReducedMotion: true,
    });
  };

  /** 의견 보내기 — Supabase tarot_sessions 후기 저장 */
  const handleSubmit = async (): Promise<void> => {
    if (rating == null || isSubmitting || hasReviewed) return;

    setIsSubmitting(true);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError != null || session?.access_token == null) {
      setIsSubmitting(false);
      toast.error("로그인이 필요합니다.");
      return;
    }

    const reviewContent = feedback.trim().length > 0 ? feedback.trim() : null;

    const result = await requestSubmitTarotSessionReviewFromClient({
      readingId,
      rating,
      reviewContent,
      accessToken: session.access_token,
    });

    if (!result.ok) {
      setIsSubmitting(false);
      toast.error(result.error);
      return;
    }

    queryClient.setQueryData<TarotReadingQueryData>(
      tarotReadingQueryKey(readingId),
      (prev) => {
        if (prev == null) return prev;
        return {
          ...prev,
          review: {
            hasReviewed: true,
            rating,
            reviewContent,
          },
        };
      },
    );

    const { balance, setBalance } = useCoinStore.getState();
    if (balance != null) {
      setBalance(balance + COIN_REWARD_REVIEW);
    }

    triggerConfetti();
    setIsSubmitting(false);
  };

  return (
    <>
      {hasReviewed ? (
        <Panel data-reading-id={readingId} aria-live="polite">
          <DoneWrap>
            <DoneIconCircle aria-hidden>
              <CircleDollarSign size={40} strokeWidth={2} />
            </DoneIconCircle>
            <DoneTitle>소중한 의견 감사합니다</DoneTitle>
            <DoneSub>감사한 마음을 담아 복채 30냥을 지급해 드렸습니다.</DoneSub>
          </DoneWrap>
        </Panel>
      ) : (
        <Panel
          data-reading-id={readingId}
          aria-labelledby="tarot-result-rating-heading"
        >
          <Title id="tarot-result-rating-heading">
            이번 리딩은 어떠셨나요?
          </Title>
          <SubtitleGroup>
            <SubtitleLine>
              이번 리딩에 대한 솔직한 후기를 남겨주세요.
            </SubtitleLine>
            <SubtitleLine>
              감사의 의미로 복채 30냥을 바로{" "}
              <SubtitlePhrase>지급해 드립니다!</SubtitlePhrase>
            </SubtitleLine>
          </SubtitleGroup>
          <StarsRow role="group" aria-label="만족도 별점">
            {STAR_VALUES.map((value) => {
              const filled = rating !== null && value <= rating;
              return (
                <StarButton
                  key={value}
                  type="button"
                  $active={filled}
                  onClick={() => setRating(value)}
                  aria-label={`${value}점`}
                  aria-pressed={filled}
                  disabled={isSubmitting}
                >
                  <Star
                    size={28}
                    strokeWidth={2}
                    aria-hidden
                    fill={filled ? "currentColor" : "none"}
                  />
                </StarButton>
              );
            })}
          </StarsRow>

          {rating !== null ? (
            <FeedbackBlock>
              <FeedbackCaption>
                더 하고 싶은 말이 있다면 적어 주세요. (선택)
              </FeedbackCaption>
              <FeedbackTextarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="예: 해석이 마음에 들었어요. 더 구체적이면 좋겠어요."
                aria-label="추가 피드백"
                disabled={isSubmitting}
              />
              <SubmitButton
                type="button"
                onClick={() => void handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? "보내는 중..." : "의견 보내기"}
              </SubmitButton>
            </FeedbackBlock>
          ) : null}
        </Panel>
      )}
    </>
  );
}
