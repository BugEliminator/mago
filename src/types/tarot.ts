/**
 * 타로 서비스 관련 타입 정의
 */

/** 히어로/덱 UI 등: 한 겹(덱)에 겹쳐 보이는 카드 수 — z-index·스프레드 배치 */
export const SPREAD_DECK_VISIBLE_COUNT = 12;

/** 모바일(≤640px)에서 보여줄 카드 수 */
export const SPREAD_DECK_VISIBLE_COUNT_MOBILE = 6;

/** 공용: 클래식 덱 뒷면 이미지(public 정적 경로) */
export const TAROT_CLASSIC_BACK_IMAGE_PATH =
  "/image/cards/classic/back.png" as const;

/** 랜딩 상단 덱: 메이저 아르카나 0〜11 (classic/major/major-{n}.png) */
export const LANDING_MAJOR_ARCANA_FACE_PATHS: readonly string[] = Array.from(
  { length: 12 },
  (__, i) => `/image/cards/classic/major/major-${i}.png`
);

/** 연애(love) 세부 태그 → 리딩/LLM용 의도 코드 (`tarotMasterConfig` love.spread3 키와 동일) */
export type LoveIntentCode =
  | "FIND_LOVE"
  | "START_UP"
  | "CRUSH"
  | "MARRIAGE"
  | "PARTNER"
  | "REUNION";

/** 금전(money) 세부 태그 → 리딩/LLM용 의도 코드 */
export type MoneyIntentCode = "PROFIT" | "CONTROL" | "GOAL" | "LUCK";

/** 커리어(career) 세부 태그 → 리딩/LLM용 의도 코드 */
export type CareerIntentCode =
  | "GROWTH"
  | "RELATION"
  | "CHANGE"
  | "STARTUP"
  | "VISION";

/** 학업(study) 세부 태그 → 리딩/LLM용 의도 코드 */
export type StudyIntentCode =
  | "SUCCESS"
  | "FOCUS"
  | "INTERVIEW"
  | "ABROAD"
  | "PATH"
  | "CONTEST";

/** 건강/마음(health) 세부 태그 → 리딩/LLM용 의도 코드 */
export type HealthIntentCode =
  | "VITALITY"
  | "HEALING"
  | "REST"
  | "HABIT"
  | "MENTAL";

/** 가족·관계(family) 세부 태그 → 리딩/LLM용 의도 코드 */
export type FamilyIntentCode =
  | "BOND"
  | "CONFLICT"
  | "CHILDREN"
  | "REPAIR"
  | "MEETING";

/** 이동·변화(travel) 세부 태그 → 리딩/LLM용 의도 코드 */
export type TravelIntentCode =
  | "RELOCATION"
  | "TRANSFER"
  | "JOURNEY"
  | "LIFE_CHANGE";

/** 꿈·심리(dream) 세부 태그 → 리딩/LLM용 의도 코드 */
export type DreamIntentCode =
  | "INTERPRET"
  | "HEAL"
  | "EXPLORE"
  | "CONTROL";

/** 나만의 이야기(custom) 세부 태그 → 리딩/LLM용 의도 코드 */
export type CustomIntentCode = "FREE" | "SECRET" | "DESTINY" | "VENTURE";

/** 운세 카테고리 */
export type TarotCategory =
  | "love" // 연애/인연
  | "money" // 금전/재물
  | "career" // 커리어/직업
  | "study" // 학업/시험
  | "health" // 건강/마음
  | "family" // 가족/관계
  | "travel" // 이동/변화
  | "dream" // 꿈/심리
  | "custom"; // 나만의 이야기

/** 카드 스프레드 타입 (장수) */
export type CardSpread = 3 | 5 | 7;

/** 타로 세션 설정 */
export interface TarotSessionSetup {
  category: TarotCategory | null;
  cardCount: CardSpread | null;
  /** 스텝 2에서 고른 세부 태그(칩) 문구 */
  detailTag: string;
  /** 스텝 3 — 현재 상황 설명 */
  situation: string;
  /** 스텝 3 — 가장 궁금한 질문 */
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

/** 클라이언트 덱 한 장 — 물리 순서 배열 요소. id(0〜77)와 셔플 시 부여되는 정역방향 */
export interface DeckCardEntry {
  id: number;
  isReversed: boolean;
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
