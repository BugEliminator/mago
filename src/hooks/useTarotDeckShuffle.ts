"use client";

import { useCallback, type Dispatch, type MutableRefObject, type SetStateAction } from "react";
import type { DeckCardEntry } from "@/types/tarot";
import type { ReadingCardState, ReadingViewState } from "@/types/tarotReadingDeck";
import {
  buildVisibleDeckCards,
  formatDeckForConsole,
  shuffleDeck,
} from "@/lib/tarotReadingDeckDeck";
import {
  poseDiffuseFromCenter,
  poseReturnToCenter,
} from "@/lib/tarotReadingDeckPose";

export type UseTarotDeckShuffleParams = {
  deckReady: boolean;
  isShuffling: boolean;
  setIsShuffling: Dispatch<SetStateAction<boolean>>;
  isSpreading: boolean;
  viewState: ReadingViewState;
  deckRef: MutableRefObject<DeckCardEntry[]>;
  setDeck: Dispatch<SetStateAction<DeckCardEntry[]>>;
  setDeckCards: Dispatch<SetStateAction<ReadingCardState[]>>;
  clearTimers: () => void;
  timersRef: MutableRefObject<number[]>;
};

/**
 * 덱 모드 셔플 애니메이션 + 실제 순서/방향 셔플
 */
export function useTarotDeckShuffle({
  deckReady,
  isShuffling,
  setIsShuffling,
  isSpreading,
  viewState,
  deckRef,
  setDeck,
  setDeckCards,
  clearTimers,
  timersRef,
}: UseTarotDeckShuffleParams): { handleShuffle: () => void } {
  const handleShuffle = useCallback(() => {
    if (!deckReady) return;
    if (isShuffling || isSpreading || viewState !== "deck") return;

    clearTimers();
    setIsShuffling(true);

    setDeckCards((prev) =>
      prev.map((c) => ({
        ...c,
        pose: poseDiffuseFromCenter(c.pose),
      })),
    );

    const t2 = window.setTimeout(() => {
      setDeckCards((prev) =>
        prev.map((c, i) => ({
          ...c,
          pose: poseReturnToCenter(i),
        })),
      );
    }, 800);

    const t3 = window.setTimeout(() => {
      const shuffled = shuffleDeck(deckRef.current);
      setDeck(shuffled);
      setDeckCards(buildVisibleDeckCards(shuffled));
      console.log(
        "[MAGO][타로 리딩] 셔플 덱:",
        formatDeckForConsole(shuffled),
      );
      setIsShuffling(false);
    }, 2300);

    timersRef.current = [t2, t3];
  }, [
    clearTimers,
    deckReady,
    deckRef,
    isShuffling,
    isSpreading,
    setDeck,
    setDeckCards,
    setIsShuffling,
    timersRef,
    viewState,
  ]);

  return { handleShuffle };
}
