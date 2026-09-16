import type {
  EncyclopediaCardDetail,
  EncyclopediaCardId,
} from "@/types/encyclopedia";
import { CUPS_CARD_DETAILS } from "@/lib/encyclopedia/details/cups";
import { MAJOR_CARD_DETAILS } from "@/lib/encyclopedia/details/major";
import { PENTACLES_CARD_DETAILS } from "@/lib/encyclopedia/details/pentacles";
import { SWORDS_CARD_DETAILS } from "@/lib/encyclopedia/details/swords";
import { WANDS_CARD_DETAILS } from "@/lib/encyclopedia/details/wands";

const CARD_DETAILS: readonly EncyclopediaCardDetail[] = [
  ...MAJOR_CARD_DETAILS,
  ...WANDS_CARD_DETAILS,
  ...CUPS_CARD_DETAILS,
  ...SWORDS_CARD_DETAILS,
  ...PENTACLES_CARD_DETAILS,
];

const DETAIL_BY_ID = new Map<EncyclopediaCardId, EncyclopediaCardDetail>(
  CARD_DETAILS.map((detail) => [detail.cardId, detail]),
);

/** 카드 상세 해설 — 없으면 null */
export function findEncyclopediaCardDetail(
  cardId: EncyclopediaCardId,
): EncyclopediaCardDetail | null {
  return DETAIL_BY_ID.get(cardId) ?? null;
}
