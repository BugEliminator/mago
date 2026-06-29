import { supabase } from "@/lib/supabaseClient";

/** Supabase Storage — 타로 카드 이미지 버킷 */
const TAROT_CARDS_BUCKET = "tarot-cards";

/**
 * Supabase Storage public URL — `tarot-cards/themes/{theme}/{id}.png`
 * @param cardId - cards 테이블 id
 * @param theme - 스토리지 테마 폴더 (기본 classic)
 */
export function getTarotCardStoragePublicUrl(
  cardId: number,
  theme = "classic",
): string {
  const { data } = supabase.storage
    .from(TAROT_CARDS_BUCKET)
    .getPublicUrl(`themes/${theme}/${cardId}.png`);
  return data.publicUrl;
}
