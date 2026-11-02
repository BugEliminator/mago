import { findEncyclopediaCardDetail } from "@/lib/encyclopedia/cardDetailCatalog";
import type {
  EncyclopediaCardId,
  EncyclopediaCardSpot,
  EncyclopediaCardSpotCopyById,
} from "@/types/encyclopedia";

/** 로컬 좌표와 Supabase Point 설명을 spot_order로 결합한다. */
export function resolveEncyclopediaCardSpots(
  cardId: EncyclopediaCardId,
  copiesById: EncyclopediaCardSpotCopyById,
): readonly EncyclopediaCardSpot[] {
  const coordinates = findEncyclopediaCardDetail(cardId)?.spots ?? [];
  const copies = copiesById[cardId] ?? [];
  const copyByOrder = new Map(copies.map((copy) => [copy.spotOrder, copy]));

  return coordinates.flatMap((coordinate) => {
    const copy = copyByOrder.get(coordinate.spotOrder);
    if (copy == null) return [];
    return [{ ...coordinate, ...copy }];
  });
}
