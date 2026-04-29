/**
 * 타로 서비스 관련 타입 정의
 */

/** 히어로/덱 UI 등: 한 겹(덱)에 겹쳐 보이는 카드 수 — z-index·스프레드 배치 */
export const SPREAD_DECK_VISIBLE_COUNT = 12;

/** 공용: 클래식 덱 뒷면 이미지(public 정적 경로) */
export const TAROT_CLASSIC_BACK_IMAGE_PATH =
  "/image/cards/classic/back.png" as const;

/** 랜딩 상단 덱: 메이저 아르카나 0〜11 (classic/major/major-{n}.png) */
export const LANDING_MAJOR_ARCANA_FACE_PATHS: readonly string[] = Array.from(
  { length: 12 },
  (__, i) => `/image/cards/classic/major/major-${i}.png`
);

/** 운세 카테고리 */
export type TarotCategory =
  | "love" // 연애운
  | "career" // 진로/직업운
  | "fortune" // 재물운
  | "health" // 건강운
  | "general" // 종합운
  | "relationship"; // 인간관계

/** 카드 스프레드 타입 (장수) */
export type CardSpread = 1 | 3 | 5;

/** 타로 세션 설정 */
export interface TarotSessionSetup {
  category: TarotCategory | null;
  cardCount: CardSpread | null;
  question: string;
}

/** 카테고리 옵션 */
export interface CategoryOption {
  id: TarotCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

/** 카드 스프레드 옵션 */
export interface SpreadOption {
  count: CardSpread;
  name: string;
  description: string;
}

/** 선택된 타로 카드 */
export interface SelectedTarotCard {
  id: string;
  position: number;
  isReversed: boolean;
}

/** 타로 리딩 세션 */
export interface TarotReadingSession {
  setup: TarotSessionSetup;
  selectedCards: SelectedTarotCard[];
  createdAt: string;
}
