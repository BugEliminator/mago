import { preloadImage } from "@/lib/preloadImage";
import { resolveTarotCardThumbs } from "@/lib/resolveTarotCardThumbs";
import { TAROT_CLASSIC_BACK_IMAGE_PATH } from "@/types/tarot";
import type { MagoLlmReadingItem } from "@/types/magoResult";

/**
 * 결과 페이지 카드 앞면(Storage) + 뒷면 프리로드
 * — 리딩 완료 후 결과 이동 전 호출해 검은 카드 플래시를 줄입니다.
 */
export async function preloadResultCardImages(
  readings: readonly MagoLlmReadingItem[],
): Promise<void> {
  if (readings.length === 0) {
    await preloadImage(TAROT_CLASSIC_BACK_IMAGE_PATH);
    return;
  }

  const thumbSlots = await resolveTarotCardThumbs(readings);
  const urls = new Set<string>();

  for (const slot of thumbSlots) {
    if (slot.faceSrc != null && slot.faceSrc.length > 0) {
      urls.add(slot.faceSrc);
    }
  }
  urls.add(TAROT_CLASSIC_BACK_IMAGE_PATH);

  await Promise.all([...urls].map((src) => preloadImage(src)));
}
