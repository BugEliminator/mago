import type {
  EncyclopediaBundleId,
  EncyclopediaCard,
  EncyclopediaCardBundle,
  EncyclopediaCardId,
  EncyclopediaCardSlug,
} from "@/types/encyclopedia";

/** 백과사전 목록 path */
export const ENCYCLOPEDIA_PATH = "/encyclopedia";

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

const MAJOR_NAMES = [
  "바보",
  "마법사",
  "여사제",
  "여황제",
  "황제",
  "교황",
  "연인",
  "전차",
  "힘",
  "은둔자",
  "운명의 수레바퀴",
  "정의",
  "매달린 사람",
  "죽음",
  "절제",
  "악마",
  "탑",
  "별",
  "달",
  "태양",
  "심판",
  "세계",
] as const;

const MINOR_RANKS = [
  "에이스",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "시종",
  "기사",
  "여왕",
  "왕",
] as const;

const MINOR_SUIT_LABEL: Record<
  Exclude<EncyclopediaBundleId, "major">,
  string
> = {
  wands: "완즈",
  cups: "컵",
  swords: "소드",
  pentacles: "펜타클",
};

/** 메이저 URL slug — Rider-Waite 관례 */
const MAJOR_SLUGS = [
  "the-fool",
  "the-magician",
  "the-high-priestess",
  "the-empress",
  "the-emperor",
  "the-hierophant",
  "the-lovers",
  "the-chariot",
  "strength",
  "the-hermit",
  "wheel-of-fortune",
  "justice",
  "the-hanged-man",
  "death",
  "temperance",
  "the-devil",
  "the-tower",
  "the-star",
  "the-moon",
  "the-sun",
  "judgement",
  "the-world",
] as const;

/** 마이너 랭크 URL slug */
const MINOR_RANK_SLUGS = [
  "ace",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "page",
  "knight",
  "queen",
  "king",
] as const;

/** 클래식 덱 앞면 경로 */
function classicFaceSrc(folder: string, index: number): string {
  return `/image/cards/classic/${folder}/${folder}-${index}.png`;
}

function cardName(bundleId: EncyclopediaBundleId, offset: number): string {
  if (bundleId === "major") {
    return MAJOR_NAMES[offset];
  }
  return `${MINOR_SUIT_LABEL[bundleId]} ${MINOR_RANKS[offset]}`;
}

/** 카드 한 장의 영어 slug */
function cardSlug(
  bundleId: EncyclopediaBundleId,
  offset: number,
): EncyclopediaCardSlug {
  if (bundleId === "major") {
    const slug = MAJOR_SLUGS[offset];
    if (slug == null) {
      throw new Error(`[MAGO][백과사전] 메이저 slug 인덱스 ${offset}가 없습니다.`);
    }
    return slug;
  }
  const rank = MINOR_RANK_SLUGS[offset];
  if (rank == null) {
    throw new Error(`[MAGO][백과사전] 마이너 slug 인덱스 ${offset}가 없습니다.`);
  }
  return `${rank}-of-${bundleId}`;
}

function cardsForBundle(bundleId: EncyclopediaBundleId): EncyclopediaCard[] {
  const { folder, start, count } = BUNDLE_DECK_RANGES[bundleId];
  return Array.from({ length: count }, (_, offset) => {
    const deckIndex = start + offset;
    return {
      id: `${bundleId}-${deckIndex}` as EncyclopediaCardId,
      slug: cardSlug(bundleId, offset),
      bundleId,
      name: cardName(bundleId, offset),
      src: classicFaceSrc(folder, deckIndex),
    };
  });
}

function cardBundle(
  id: EncyclopediaBundleId,
  label: string,
): EncyclopediaCardBundle {
  return {
    id,
    label,
    cards: cardsForBundle(id),
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

const ALL_ENCYCLOPEDIA_CARDS: readonly EncyclopediaCard[] =
  ENCYCLOPEDIA_CARD_BUNDLES.flatMap((bundle) => bundle.cards);

const CARD_BY_ID = new Map<EncyclopediaCardId, EncyclopediaCard>(
  ALL_ENCYCLOPEDIA_CARDS.map((card) => [card.id, card]),
);

const CARD_BY_SLUG = new Map<EncyclopediaCardSlug, EncyclopediaCard>(
  ALL_ENCYCLOPEDIA_CARDS.map((card) => [card.slug, card]),
);

/** 78장 목록 */
export function listEncyclopediaCards(): readonly EncyclopediaCard[] {
  return ALL_ENCYCLOPEDIA_CARDS;
}

/** 카드 상세 path */
export function encyclopediaCardPath(slug: EncyclopediaCardSlug): string {
  return `${ENCYCLOPEDIA_PATH}/${slug}`;
}

/** `/encyclopedia/queen-of-pentacles`에서 slug만 꺼낸다 */
export function parseEncyclopediaCardSlugFromPath(
  pathname: string,
): EncyclopediaCardSlug | null {
  if (pathname === ENCYCLOPEDIA_PATH) return null;
  const prefix = `${ENCYCLOPEDIA_PATH}/`;
  if (!pathname.startsWith(prefix)) return null;
  const slug = pathname.slice(prefix.length).split("/")[0] ?? "";
  return slug.length > 0 ? slug : null;
}

/** id로 카드 한 장 찾기 */
export function findEncyclopediaCard(
  cardId: string,
): EncyclopediaCard | null {
  return CARD_BY_ID.get(cardId as EncyclopediaCardId) ?? null;
}

/** slug로 카드 한 장 찾기 */
export function findEncyclopediaCardBySlug(
  slug: string,
): EncyclopediaCard | null {
  if (slug.length === 0) return null;
  return CARD_BY_SLUG.get(slug) ?? null;
}

/** 예전 ?card= 쿼리에서 카드 찾기 */
export function parseEncyclopediaCardQuery(
  value: string | null | undefined,
): EncyclopediaCard | null {
  if (value == null || value.length === 0) return null;
  return findEncyclopediaCard(value);
}

/**
 * 백과 카드 id 접미사 → cards.id / card_meanings.card_id (0–77)
 */
export function encyclopediaCardDeckIndex(
  cardId: EncyclopediaCardId,
): number {
  const sep = cardId.lastIndexOf("-");
  return Number(cardId.slice(sep + 1));
}
