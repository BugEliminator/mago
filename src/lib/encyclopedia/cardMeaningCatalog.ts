import type {
  EncyclopediaCardId,
  EncyclopediaCardMeaning,
  EncyclopediaCardMeaningById,
} from "@/types/encyclopedia";

/** 한 장 해설 — 없으면 null */
export function findEncyclopediaCardMeaning(
  meanings: EncyclopediaCardMeaningById,
  cardId: EncyclopediaCardId,
): EncyclopediaCardMeaning | null {
  return meanings[cardId] ?? null;
}

/** 키워드·설명 중 하나라도 있으면 true */
export function hasEncyclopediaCardMeaning(
  meaning: EncyclopediaCardMeaning | null,
): boolean {
  if (meaning == null) return false;
  return (
    meaning.uprightKeywords.length > 0 ||
    meaning.reversedKeywords.length > 0 ||
    meaning.upright.length > 0 ||
    meaning.reversed.length > 0
  );
}
