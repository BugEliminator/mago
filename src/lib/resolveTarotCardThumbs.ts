import { getTarotCardStoragePublicUrl } from "@/lib/tarotCardStorageUrl";
import { supabase } from "@/lib/supabaseClient";
import type { MagoLlmReadingItem } from "@/types/magoResult";
import type { ResultCardThumbSlot } from "@/types/tarotResult";

type CardRow = {
  id: number;
  name_en: string;
};

/**
 * LLM res_readings → cards.name_en 조회 → Storage 앞면 URL + 역방향 여부
 * @param readings - LLM res_readings 배열
 * @param theme - 스토리지 테마 폴더 (기본 classic)
 */
export async function resolveTarotCardThumbs(
  readings: readonly MagoLlmReadingItem[],
  theme = "classic",
): Promise<ResultCardThumbSlot[]> {
  if (readings.length === 0) return [];

  const names = readings.map((r) => r.card_name_en);
  const { data, error } = await supabase
    .from("cards")
    .select("id, name_en")
    .in("name_en", names);

  if (error != null) {
    console.warn("[MAGO] cards 조회 실패", error);
    return readings.map((r) => ({
      faceSrc: null,
      isReversed: r.is_reversed,
      resolved: true,
    }));
  }

  const rows = (data ?? []) as CardRow[];
  const idByName = new Map<string, number>();
  for (const row of rows) {
    idByName.set(row.name_en, row.id);
  }

  return readings.map((reading) => {
    const cardId = idByName.get(reading.card_name_en);
    if (cardId == null) {
      console.warn(
        `[MAGO] cards.name_en 매칭 실패: "${reading.card_name_en}"`,
      );
      return {
        faceSrc: null,
        isReversed: reading.is_reversed,
        resolved: true,
      };
    }
    return {
      faceSrc: getTarotCardStoragePublicUrl(cardId, theme),
      isReversed: reading.is_reversed,
      resolved: true,
    };
  });
}

/** 조회 전 placeholder — 뒷면만 노출 */
export function createPendingThumbSlots(
  readings: readonly MagoLlmReadingItem[],
): ResultCardThumbSlot[] {
  return readings.map((r) => ({
    faceSrc: null,
    isReversed: r.is_reversed,
    resolved: false,
  }));
}
