/** 백과사전 카드 묶음 식별자 */
export type EncyclopediaBundleId =
  | "major"
  | "wands"
  | "cups"
  | "swords"
  | "pentacles";

/** 카드 한 장 — 파일 번호와 동일한 접미사 (예: major-13) */
export type EncyclopediaCardId = `${EncyclopediaBundleId}-${number}`;

/** URL용 영어 slug (예: queen-of-pentacles) */
export type EncyclopediaCardSlug = string;

/** 백과사전 그리드·상세에서 쓰는 카드 */
export type EncyclopediaCard = {
  id: EncyclopediaCardId;
  slug: EncyclopediaCardSlug;
  bundleId: EncyclopediaBundleId;
  name: string;
  src: string;
};

/** 백과사전 상단 묶음 + 아래 전체 덱 */
export type EncyclopediaCardBundle = {
  id: EncyclopediaBundleId;
  label: string;
  cards: readonly EncyclopediaCard[];
};

/** 카드 위 키워드 점 — x/y는 앞면 대비 퍼센트 */
export type EncyclopediaCardPin = {
  id: string;
  x: number;
  y: number;
  title: string;
  body: string;
};

/** 카드 상세 해설 — 핀은 로컬, 정·역 의미는 Supabase */
export type EncyclopediaCardDetail = {
  cardId: EncyclopediaCardId;
  pins: readonly EncyclopediaCardPin[];
};

/** card_meanings에서 모은 한 장의 정·역 해설 */
export type EncyclopediaCardMeaning = {
  uprightKeywords: readonly string[];
  reversedKeywords: readonly string[];
  upright: string;
  reversed: string;
};

/** 백과 카드 id → 정·역 해설. 없는 카드는 키 자체가 없음 */
export type EncyclopediaCardMeaningById = Partial<
  Record<EncyclopediaCardId, EncyclopediaCardMeaning>
>;
