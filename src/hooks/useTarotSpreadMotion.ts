"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import type { DeckCardEntry } from "@/types/tarot";
import type {
  PickedSlotEntry,
  ReadingCardState,
  ReadingViewState,
} from "@/types/tarotReadingDeck";
import { buildCardsState } from "@/lib/tarotReadingDeckDeck";
import {
  CARDS_PER_ROW,
  SPREAD_MS_CENTER,
  SPREAD_MS_ROW_FAN,
  SPREAD_ROW_COUNT,
  SPREAD_ROW_FAN_STAGGER_MS,
  SPREAD_SLIDE_COL_STAGGER_MS,
  SPREAD_SLIDE_DURATION_MS,
  SPREAD_SLIDE_ROW_START_GAP_MS,
  SPREAD_STAGE_VERTICAL_CENTER_DELTA_PX,
} from "@/lib/tarotReadingDeckConstants";
import {
  poseAfterSpreadMotionSettled,
  poseSlideToGrid,
  poseSpreadCenterStack,
  poseSpreadRowAnchors,
} from "@/lib/tarotReadingDeckPose";

export type UseTarotSpreadMotionParams = {
  deckReady: boolean;
  deck: DeckCardEntry[];
  pickSlotCount: number;
  isSpreading: boolean;
  setIsSpreading: Dispatch<SetStateAction<boolean>>;
  isShuffling: boolean;
  viewState: ReadingViewState;
  setViewState: Dispatch<SetStateAction<ReadingViewState>>;
  setPickedSlots: Dispatch<SetStateAction<(PickedSlotEntry | null)[]>>;
  setSpreadCards: Dispatch<SetStateAction<ReadingCardState[] | null>>;
  setSpreadLiftPx: Dispatch<SetStateAction<number>>;
  setSpreadLiftMotionReady: Dispatch<SetStateAction<boolean>>;
  clearTimers: () => void;
  timersRef: MutableRefObject<number[]>;
};

export type UseTarotSpreadMotionReturn = {
  spreadScrollRef: MutableRefObject<HTMLDivElement | null>;
  handleSpread: () => void;
};

/**
 * 스프레드 펼치기 타이밍·포즈 시퀀스 + 스크롤 영역 리프트·가로 중앙 정렬
 */
export function useTarotSpreadMotion({
  deckReady,
  deck,
  pickSlotCount,
  isSpreading,
  setIsSpreading,
  isShuffling,
  viewState,
  setViewState,
  setPickedSlots,
  setSpreadCards,
  setSpreadLiftPx,
  setSpreadLiftMotionReady,
  clearTimers,
  timersRef,
}: UseTarotSpreadMotionParams): UseTarotSpreadMotionReturn {
  const spreadScrollRef = useRef<HTMLDivElement>(null);

  const centerSpreadScrollHorizontal = useCallback(() => {
    const el = spreadScrollRef.current;
    if (!el) return;
    const maxLeft = el.scrollWidth - el.clientWidth;
    if (maxLeft <= 0) return;
    el.scrollLeft = maxLeft / 2;
  }, []);

  useLayoutEffect(() => {
    if (viewState !== "spreading") return;

    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      setSpreadLiftMotionReady(true);
      raf2 = window.requestAnimationFrame(() => {
        setSpreadLiftPx(0);
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [setSpreadLiftMotionReady, setSpreadLiftPx, viewState]);

  useLayoutEffect(() => {
    if (viewState === "deck") return;
    centerSpreadScrollHorizontal();
    const id = window.requestAnimationFrame(centerSpreadScrollHorizontal);
    return () => window.cancelAnimationFrame(id);
  }, [centerSpreadScrollHorizontal, viewState]);

  const handleSpread = useCallback(() => {
    if (!deckReady) return;
    if (isSpreading || isShuffling || viewState !== "deck") return;

    clearTimers();
    setSpreadLiftPx(SPREAD_STAGE_VERTICAL_CENTER_DELTA_PX);
    setSpreadLiftMotionReady(false);
    setIsSpreading(true);
    setViewState("spreading");
    setPickedSlots(Array.from({ length: pickSlotCount }, () => null));
    setSpreadCards(buildCardsState(deck));

    setSpreadCards((prev) => {
      if (!prev) return prev;
      return prev.map((c, indexInDeck) => ({
        ...c,
        pose: poseSpreadCenterStack(indexInDeck),
      }));
    });

    const tRowAnchors = window.setTimeout(() => {
      setSpreadCards((prev) => {
        if (!prev) return prev;
        return prev.map((c, indexInDeck) => ({
          ...c,
          pose: poseSpreadRowAnchors(indexInDeck),
        }));
      });
    }, SPREAD_MS_CENTER);

    const rowFanCompleteMs =
      SPREAD_MS_ROW_FAN + (SPREAD_ROW_COUNT - 1) * SPREAD_ROW_FAN_STAGGER_MS;

    const slideStart = SPREAD_MS_CENTER + rowFanCompleteMs;

    const tSlide = window.setTimeout(() => {
      setSpreadCards((prev) => {
        if (!prev) return prev;
        return prev.map((c, indexInDeck) => ({
          ...c,
          pose: poseSlideToGrid(indexInDeck),
        }));
      });

      window.requestAnimationFrame(() => {
        centerSpreadScrollHorizontal();
      });

      const maxSlideDelayMs =
        (SPREAD_ROW_COUNT - 1) * SPREAD_SLIDE_ROW_START_GAP_MS +
        (CARDS_PER_ROW - 1) * SPREAD_SLIDE_COL_STAGGER_MS;
      const done = window.setTimeout(
        () => {
          setIsSpreading(false);
          setViewState("spread");
          setSpreadCards((prev) => {
            if (!prev) return prev;
            return prev.map((c) => ({
              ...c,
              pose: poseAfterSpreadMotionSettled(c.pose),
            }));
          });
          window.requestAnimationFrame(centerSpreadScrollHorizontal);
        },
        maxSlideDelayMs + SPREAD_SLIDE_DURATION_MS + 160,
      );

      timersRef.current = [done];
    }, slideStart);

    timersRef.current = [tRowAnchors, tSlide];
  }, [
    centerSpreadScrollHorizontal,
    clearTimers,
    deck,
    deckReady,
    isShuffling,
    isSpreading,
    pickSlotCount,
    setIsSpreading,
    setPickedSlots,
    setSpreadCards,
    setSpreadLiftMotionReady,
    setSpreadLiftPx,
    setViewState,
    timersRef,
    viewState,
  ]);

  return { spreadScrollRef, handleSpread };
}
