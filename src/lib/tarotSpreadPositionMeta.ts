import type { CardSpread, TarotCategory } from "@/types/tarot";
import { TAROT_MASTER_CONFIG } from "@/lib/tarotMasterConfig";
import { getIntentCodeForLabel } from "@/components/tarot/setup/setupIntentCatalog";

/** 스프레드 한 위치 — `tarotMasterConfig`와 동형 */
export type TarotSpreadPositionMeta = {
  pos: number;
  label: string;
  desc: string;
};

type SpreadConfigKey = keyof typeof TAROT_MASTER_CONFIG;

/**
 * 마스터 설정 내부 버킷이 `의도 코드 → 포지션 행[]` 맵일 때, 스텝 2 `detailTag`로 해당 행 배열을 꺼낸다
 */
function getIntentSpreadRowsFromBucket(
  category: TarotCategory,
  bucket: unknown,
  detailTag: string,
): TarotSpreadPositionMeta[] | null {
  if (
    bucket == null ||
    typeof bucket !== "object" ||
    Array.isArray(bucket)
  ) {
    return null;
  }
  const code = getIntentCodeForLabel(category, detailTag);
  if (code == null) return null;
  const variant = (
    bucket as Record<string, TarotSpreadPositionMeta[] | undefined>
  )[code];
  return Array.isArray(variant) ? variant : null;
}

/**
 * 장수·카테고리·0-based 슬롯 인덱스로 마스터 설정에서 해당 포지션 메타 조회.
 * 3장·연애 5장 분기 카테고리는 `detailTag`(스텝 2 한글 칩)로 의도 코드를 고릅니다.
 * 건강/마음(health) 5장·7장도 동일하게 `detailTag`로 VITALITY / HEALING / REST / HABIT / MENTAL을 고릅니다.
 * 가족/관계(family) 3장·5장·7장도 `detailTag`로 BOND / CONFLICT / CHILDREN / REPAIR / MEETING을 고릅니다.
 * 이동/변화(travel) 3장·5장·7장도 `detailTag`로 RELOCATION / TRANSFER / JOURNEY / LIFE_CHANGE를 고릅니다.
 * 꿈/심리(dream) 3장·5장·7장도 `detailTag`로 INTERPRET / HEAL / EXPLORE / CONTROL을 고릅니다.
 * 나만의 이야기(custom) 3장·5장·7장도 `detailTag`로 FREE / SECRET / DESTINY / VENTURE를 고릅니다.
 */
export function getTarotSpreadPositionMeta(
  cardCount: CardSpread,
  category: TarotCategory,
  slotIndex: number,
  detailTag: string = "",
): TarotSpreadPositionMeta | null {
  const key = String(cardCount) as SpreadConfigKey;
  const bucket = TAROT_MASTER_CONFIG[key];
  if (bucket == null) return null;

  if (cardCount === 3 && category === "love") {
    const rows = getIntentSpreadRowsFromBucket("love", bucket.love, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 5 && category === "love") {
    const rows = getIntentSpreadRowsFromBucket("love", bucket.love, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 7 && category === "love") {
    const rows = getIntentSpreadRowsFromBucket("love", bucket.love, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 3 && category === "money") {
    const rows = getIntentSpreadRowsFromBucket("money", bucket.money, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 5 && category === "money") {
    const rows = getIntentSpreadRowsFromBucket("money", bucket.money, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 7 && category === "money") {
    const rows = getIntentSpreadRowsFromBucket("money", bucket.money, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 3 && category === "career") {
    const rows = getIntentSpreadRowsFromBucket("career", bucket.career, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 5 && category === "career") {
    const rows = getIntentSpreadRowsFromBucket("career", bucket.career, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 7 && category === "career") {
    const rows = getIntentSpreadRowsFromBucket("career", bucket.career, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 3 && category === "study") {
    const rows = getIntentSpreadRowsFromBucket("study", bucket.study, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 5 && category === "study") {
    const rows = getIntentSpreadRowsFromBucket("study", bucket.study, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 7 && category === "study") {
    const rows = getIntentSpreadRowsFromBucket("study", bucket.study, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 3 && category === "health") {
    const rows = getIntentSpreadRowsFromBucket("health", bucket.health, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 5 && category === "health") {
    const rows = getIntentSpreadRowsFromBucket("health", bucket.health, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 7 && category === "health") {
    const rows = getIntentSpreadRowsFromBucket("health", bucket.health, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 3 && category === "family") {
    const rows = getIntentSpreadRowsFromBucket("family", bucket.family, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 5 && category === "family") {
    const rows = getIntentSpreadRowsFromBucket("family", bucket.family, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 7 && category === "family") {
    const rows = getIntentSpreadRowsFromBucket("family", bucket.family, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 3 && category === "travel") {
    const rows = getIntentSpreadRowsFromBucket("travel", bucket.travel, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 5 && category === "travel") {
    const rows = getIntentSpreadRowsFromBucket("travel", bucket.travel, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 7 && category === "travel") {
    const rows = getIntentSpreadRowsFromBucket("travel", bucket.travel, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 3 && category === "dream") {
    const rows = getIntentSpreadRowsFromBucket("dream", bucket.dream, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 5 && category === "dream") {
    const rows = getIntentSpreadRowsFromBucket("dream", bucket.dream, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 7 && category === "dream") {
    const rows = getIntentSpreadRowsFromBucket("dream", bucket.dream, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 3 && category === "custom") {
    const rows = getIntentSpreadRowsFromBucket("custom", bucket.custom, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 5 && category === "custom") {
    const rows = getIntentSpreadRowsFromBucket("custom", bucket.custom, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  if (cardCount === 7 && category === "custom") {
    const rows = getIntentSpreadRowsFromBucket("custom", bucket.custom, detailTag);
    if (rows == null || slotIndex < 0 || slotIndex >= rows.length) {
      return null;
    }
    return rows[slotIndex] ?? null;
  }

  const rows = bucket[category];
  if (!Array.isArray(rows) || slotIndex < 0 || slotIndex >= rows.length) {
    return null;
  }

  return rows[slotIndex] ?? null;
}
