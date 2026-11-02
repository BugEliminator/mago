import { cache } from "react";
import {
  encyclopediaCardDeckIndex,
  listEncyclopediaCards,
} from "@/lib/encyclopedia/cardBundleCatalog";
import { createServerSupabaseClient } from "@/lib/supabase/supabaseServer";
import type {
  EncyclopediaCardId,
  EncyclopediaCardSpotCopy,
  EncyclopediaCardSpotCopyById,
} from "@/types/encyclopedia";

type CardSpotRow = {
  card_id: number;
  spot_order: number;
  title: string;
  description: string;
};

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * 백과사전용 card_spots 전체 조회 — 78장 Point 제목·설명.
 * 좌표는 로컬 details에서 별도로 관리한다.
 */
export const fetchEncyclopediaCardSpotsFromDb = cache(
  async function fetchEncyclopediaCardSpotsFromDb(): Promise<EncyclopediaCardSpotCopyById> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("card_spots")
      .select("card_id,spot_order,title,description")
      .order("card_id", { ascending: true })
      .order("spot_order", { ascending: true });

    if (error != null) {
      console.error("[MAGO][백과사전] card_spots 조회 실패", error);
      return {};
    }

    const cardIdByDeckIndex = new Map<number, EncyclopediaCardId>(
      listEncyclopediaCards().map((card) => [
        encyclopediaCardDeckIndex(card.id),
        card.id,
      ]),
    );
    const mutableById: Partial<
      Record<EncyclopediaCardId, EncyclopediaCardSpotCopy[]>
    > = {};

    for (const row of (data ?? []) as CardSpotRow[]) {
      const cardId = cardIdByDeckIndex.get(row.card_id);
      const title = asText(row.title);
      const description = asText(row.description);
      if (
        cardId == null ||
        !Number.isInteger(row.spot_order) ||
        row.spot_order < 1 ||
        title.length === 0 ||
        description.length === 0
      ) {
        continue;
      }

      const spots = mutableById[cardId] ?? [];
      spots.push({
        spotOrder: row.spot_order,
        title,
        description,
      });
      mutableById[cardId] = spots;
    }

    return mutableById;
  },
);
