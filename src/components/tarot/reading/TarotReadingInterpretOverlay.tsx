"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import FullscreenRuneLoadingOverlay from "@/components/common/fullscreen-rune-loading-overlay/FullscreenRuneLoadingOverlay";
import type { CardSpread } from "@/types/tarot";
import {
  ProgressFill,
  ProgressTrack,
  ProgressWrap,
  StageMessage,
  StageMessageViewport,
} from "./TarotReadingInterpretOverlay.style";

const EXPECTED_READING_MS: Record<CardSpread, number> = {
  3: 11_000,
  5: 17_000,
  7: 22_000,
};

const SLOW_READING_MS: Record<CardSpread, number> = {
  3: 13_000,
  5: 21_000,
  7: 28_000,
};

type ReadingProgressStage =
  | "symbols"
  | "flow"
  | "meaning"
  | "advice"
  | "slow"
  | "complete";

type TarotReadingInterpretOverlayProps = {
  cardCount: CardSpread;
  isComplete: boolean;
};

/**
 * 카드를 모두 뽑은 뒤 결과로 넘어가기 전 — 마고 해석 중 안내
 */
export default function TarotReadingInterpretOverlay({
  cardCount,
  isComplete,
}: TarotReadingInterpretOverlayProps) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (isComplete) return;
    const startedAt = performance.now();
    const timerId = window.setInterval(() => {
      setElapsedMs(performance.now() - startedAt);
    }, 100);
    return () => window.clearInterval(timerId);
  }, [isComplete]);

  const expectedMs = EXPECTED_READING_MS[cardCount];
  const slowMs = SLOW_READING_MS[cardCount];
  const progress = isComplete
    ? 100
    : calculateReadingProgress(elapsedMs, expectedMs, slowMs);
  const stage = resolveProgressStage(
    elapsedMs,
    expectedMs,
    slowMs,
    isComplete,
  );
  const message = useMemo(
    () => getProgressMessage(stage, cardCount),
    [stage, cardCount],
  );

  return (
    <FullscreenRuneLoadingOverlay
      caption={
        <StageMessageViewport>
          <AnimatePresence mode="wait" initial={false}>
            <StageMessage
              key={stage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {message}
            </StageMessage>
          </AnimatePresence>
        </StageMessageViewport>
      }
      ariaLabel={message}
      ariaBusy={!isComplete}
      zIndex={70}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <ProgressWrap>
        <ProgressTrack
          role="progressbar"
          aria-label="타로 리딩 준비 진행률"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <ProgressFill
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: isComplete ? 0.4 : 0.18,
              ease: isComplete ? "easeOut" : "linear",
            }}
          />
        </ProgressTrack>
      </ProgressWrap>
    </FullscreenRuneLoadingOverlay>
  );
}

function calculateReadingProgress(
  elapsedMs: number,
  expectedMs: number,
  slowMs: number,
): number {
  if (elapsedMs <= expectedMs) {
    const ratio = Math.min(1, elapsedMs / expectedMs);
    const easedRatio = 1 - Math.pow(1 - ratio, 1.08);
    return 4 + 82 * easedRatio;
  }

  if (elapsedMs <= slowMs) {
    const ratio = (elapsedMs - expectedMs) / (slowMs - expectedMs);
    return 86 + 8 * ratio;
  }

  const overtimeMs = elapsedMs - slowMs;
  return Math.min(
    97.5,
    94 + 3.5 * (1 - Math.exp(-overtimeMs / 12_000)),
  );
}

function resolveProgressStage(
  elapsedMs: number,
  expectedMs: number,
  slowMs: number,
  isComplete: boolean,
): ReadingProgressStage {
  if (isComplete) return "complete";
  if (elapsedMs >= slowMs) return "slow";

  const ratio = elapsedMs / expectedMs;
  if (ratio < 0.25) return "symbols";
  if (ratio < 0.55) return "flow";
  if (ratio < 0.82) return "meaning";
  return "advice";
}

function getProgressMessage(
  stage: ReadingProgressStage,
  cardCount: CardSpread,
): string {
  switch (stage) {
    case "symbols":
      return "선택한 카드의 상징을 살펴보고 있어요.";
    case "flow":
      return `${cardCount}장의 흐름을 하나로 엮고 있어요.`;
    case "meaning":
      return "질문과 카드가 만나는 의미를 풀어내고 있어요.";
    case "advice":
      return "마고의 조언을 마지막으로 다듬고 있어요.";
    case "slow":
      return "카드의 흐름을 조금 더 세심하게 살펴보고 있어요.";
    case "complete":
      return "마고의 리딩이 완성되었어요.";
  }
}
