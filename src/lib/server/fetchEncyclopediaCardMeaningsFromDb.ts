import { cache } from "react";
import {
  ENCYCLOPEDIA_CARD_BUNDLES,
  encyclopediaCardDeckIndex,
} from "@/lib/encyclopedia/cardBundleCatalog";
import { createServerSupabaseClient } from "@/lib/supabase/supabaseServer";
import type { CardMeaningRow } from "@/types/tarotReadingDeck";
import type {
  EncyclopediaCardMeaning,
  EncyclopediaCardMeaningById,
} from "@/types/encyclopedia";

type MeaningSides = {
  uprightKeywords: string[];
  reversedKeywords: string[];
  upright: string;
  reversed: string;
};

/** 키워드 배열만 남기고 공백 항목은 버린다 */
function asKeywordList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0,
  ).map((item) => item.trim());
}

/** 설명 문자열 — 없으면 빈 문자 */
function asDescription(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function emptySides(): MeaningSides {
  return {
    uprightKeywords: [],
    reversedKeywords: [],
    upright: "",
    reversed: "",
  };
}

function hasAnyCopy(sides: MeaningSides): boolean {
  return (
    sides.uprightKeywords.length > 0 ||
    sides.reversedKeywords.length > 0 ||
    sides.upright.length > 0 ||
    sides.reversed.length > 0
  );
}

/**
 * 백과사전용 card_meanings 전체 조회 — 78장 × 정·역
 * 한 요청에서 metadata와 페이지가 같은 결과를 쓰도록 cache한다.
 */
export const fetchEncyclopediaCardMeaningsFromDb = cache(
  async function fetchEncyclopediaCardMeaningsFromDb(): Promise<EncyclopediaCardMeaningById> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("card_meanings")
      .select("card_id,is_upright,keywords,description");

    if (error != null) {
      console.error("[MAGO][백과사전] card_meanings 조회 실패", error);
      return {};
    }

    const rows = (data ?? []) as CardMeaningRow[];
    const byDeckIndex = new Map<number, MeaningSides>();

    for (const row of rows) {
      const sides = byDeckIndex.get(row.card_id) ?? emptySides();
      if (row.is_upright) {
        sides.uprightKeywords = asKeywordList(row.keywords);
        sides.upright = asDescription(row.description);
      } else {
        sides.reversedKeywords = asKeywordList(row.keywords);
        sides.reversed = asDescription(row.description);
      }
      byDeckIndex.set(row.card_id, sides);
    }

    const deckIds = [...byDeckIndex.keys()];
    const minDeckId = deckIds.length > 0 ? Math.min(...deckIds) : 0;
    const maxDeckId = deckIds.length > 0 ? Math.max(...deckIds) : 0;
    // cards.id가 1–78이면 백과 접미사(0–77)에 +1
    const oneBased =
      minDeckId === 1 && maxDeckId === 78 && !byDeckIndex.has(0);

    const meanings: EncyclopediaCardMeaningById = {};
    for (const bundle of ENCYCLOPEDIA_CARD_BUNDLES) {
      for (const card of bundle.cards) {
        const deckIndex = encyclopediaCardDeckIndex(card.id);
        const sides = byDeckIndex.get(oneBased ? deckIndex + 1 : deckIndex);
        if (sides == null || !hasAnyCopy(sides)) continue;
        meanings[card.id] = {
          uprightKeywords: sides.uprightKeywords,
          reversedKeywords: sides.reversedKeywords,
          upright: sides.upright,
          reversed: sides.reversed,
        } satisfies EncyclopediaCardMeaning;
      }
    }

    return meanings;
  },
);
