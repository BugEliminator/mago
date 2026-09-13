import type {
  EncyclopediaBundleId,
  EncyclopediaCardBundle,
} from "@/types/encyclopedia";

/** 아래 그리드 — 모바일 한 행 카드 수 */
export const ENCYCLOPEDIA_BUNDLE_GRID_COLUMNS_MOBILE = 4;
/** 아래 그리드 — 데스크톱 한 행 카드 수 */
export const ENCYCLOPEDIA_BUNDLE_GRID_COLUMNS_DESKTOP = 8;

type BundleDeckRange = {
  folder: string;
  start: number;
  count: number;
};

const BUNDLE_DECK_RANGES: Record<EncyclopediaBundleId, BundleDeckRange> = {
  major: { folder: "major", start: 0, count: 22 },
  wands: { folder: "wands", start: 22, count: 14 },
  cups: { folder: "cups", start: 36, count: 14 },
  swords: { folder: "swords", start: 50, count: 14 },
  pentacles: { folder: "pentacles", start: 64, count: 14 },
};

/** 클래식 덱 앞면 경로 */
function classicFaceSrc(folder: string, index: number): string {
  return `/image/cards/classic/${folder}/${folder}-${index}.png`;
}

/** start부터 count장 */
function deckSrcs(folder: string, start: number, count: number): string[] {
  return Array.from({ length: count }, (_, offset) =>
    classicFaceSrc(folder, start + offset),
  );
}

function cardBundle(
  id: EncyclopediaBundleId,
  label: string,
): EncyclopediaCardBundle {
  const { folder, start, count } = BUNDLE_DECK_RANGES[id];
  const all = deckSrcs(folder, start, count);
  return {
    id,
    label,
    cardSrcs: all.slice(0, 3),
    deckSrcs: all,
  };
}

/**
 * 백과사전 카드 묶음 — 상단 팬 3장 + 전체 덱
 */
export const ENCYCLOPEDIA_CARD_BUNDLES: readonly EncyclopediaCardBundle[] = [
  cardBundle("major", "메이저 카드"),
  cardBundle("wands", "완즈 카드"),
  cardBundle("cups", "컵 카드"),
  cardBundle("swords", "소드 카드"),
  cardBundle("pentacles", "펜타클 카드"),
];
