import type { DeckCardEntry } from "@/types/tarot";
import type { ReadingCardState } from "@/types/tarotReadingDeck";
import {
  TOTAL_CARDS,
  VISIBLE_DECK_COUNT,
} from "@/lib/tarot/reading/tarotReadingDeckConstants";
import {
  getBasePose,
  poseInterpretCatalogGrid,
} from "@/lib/tarot/reading/tarotReadingDeckPose";

/** 로컬 해석용 — 정방향 0〜77 다음 역방향 0〜77, 셔플 없음 */
export function createInterpretCatalogEntries(): DeckCardEntry[] {
  const upright = Array.from({ length: TOTAL_CARDS }, (_, i) => ({
    id: i,
    isReversed: false,
  }));
  const reversed = Array.from({ length: TOTAL_CARDS }, (_, i) => ({
    id: i,
    isReversed: true,
  }));
  return [...upright, ...reversed];
}

/** 해석 카탈로그를 16열 그리드 포즈로 펼칩니다. */
export function buildInterpretCatalogCards(
  entries: readonly DeckCardEntry[],
): ReadingCardState[] {
  return entries.map((entry, index) => ({
    cardId: entry.id,
    isReversed: entry.isReversed,
    pose: poseInterpretCatalogGrid(index),
  }));
}

/** 하이드레이션 안정용 결정적 덱(랜덤 없음) */
export function createDeterministicDeckEntries(): DeckCardEntry[] {
  return Array.from({ length: TOTAL_CARDS }, (_, i) => ({
    id: i,
    isReversed: false,
  }));
}

/** 초기 덱 생성 — id 0〜77, isReversed 50% */
export function createFreshDeckEntries(): DeckCardEntry[] {
  return Array.from({ length: TOTAL_CARDS }, (_, i) => ({
    id: i,
    isReversed: Math.random() < 0.5,
  }));
}

/** Fisher–Yates + isReversed 재부여 */
export function shuffleDeck(entries: readonly DeckCardEntry[]): DeckCardEntry[] {
  const a = [...entries];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.map((entry) => ({ ...entry, isReversed: Math.random() < 0.5 }));
}

export function buildCardsState(deck: readonly DeckCardEntry[]): ReadingCardState[] {
  return deck.map((entry, indexInDeck) => ({
    cardId: entry.id,
    isReversed: entry.isReversed,
    pose: getBasePose(indexInDeck),
  }));
}

export function buildVisibleDeckCards(
  deck: readonly DeckCardEntry[],
): ReadingCardState[] {
  const top = deck.slice(-VISIBLE_DECK_COUNT);
  return top.map((entry, i) => ({
    cardId: entry.id,
    isReversed: entry.isReversed,
    pose: getBasePose(i),
  }));
}

export function formatDeckForConsole(deck: readonly DeckCardEntry[]): string {
  return deck.map((e) => `${e.id}${e.isReversed ? "역" : "정"}`).join(" ");
}
