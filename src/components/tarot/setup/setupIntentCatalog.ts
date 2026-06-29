import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Coins,
  GraduationCap,
  Heart,
  Hospital,
  Moon,
  Plane,
  Users,
  Wand2,
} from "lucide-react";
import type {
  CareerIntentCode,
  CustomIntentCode,
  HealthIntentCode,
  DreamIntentCode,
  FamilyIntentCode,
  LoveIntentCode,
  MoneyIntentCode,
  StudyIntentCode,
  TarotCategory,
  TravelIntentCode,
} from "@/types/tarot";

/** 칩 배열에서 라벨 맵·칩 라벨 목록·코드 조회를 한 번에 만든다 */
type IntentChipRegistry<C extends string> = {
  labelToCode: Readonly<Record<string, C>>;
  chipLabels: readonly string[];
  getCodeForLabel: (label: string) => C | undefined;
};

function createIntentChipRegistry<C extends string>(
  chips: readonly { label: string; code: C }[],
): IntentChipRegistry<C> {
  const labelToCode = chips.reduce(
    (acc, { label, code }) => {
      acc[label] = code;
      return acc;
    },
    {} as Record<string, C>,
  );
  return {
    labelToCode,
    chipLabels: chips.map((c) => c.label),
    getCodeForLabel: (label) => labelToCode[label],
  };
}

/**
 * 연애 카테고리 세부 칩 — UI 라벨과 의도 코드(백엔드·LLM) 1:1 대응
 * 순서는 스텝 2 칩 목록 노출 순서입니다.
 */
const LOVE_INTENT_CHIPS: readonly { label: string; code: LoveIntentCode }[] = [
  { label: "새로운 인연", code: "FIND_LOVE" },
  { label: "운명적 만남", code: "FIND_LOVE" },
  { label: "연애 시작", code: "START_UP" },
  { label: "짝사랑의 결말", code: "CRUSH" },
  { label: "결혼운", code: "MARRIAGE" },
  { label: "권태기 극복", code: "PARTNER" },
  { label: "부부 관계", code: "PARTNER" },
  { label: "이별 후 재회", code: "REUNION" },
];

/**
 * 금전 카테고리 세부 칩 — UI 라벨과 의도 코드(`tarotMasterConfig` money 분기) 1:1
 */
const MONEY_INTENT_CHIPS: readonly { label: string; code: MoneyIntentCode }[] =
  [
    { label: "수입 증대", code: "PROFIT" },
    { label: "투자 수익", code: "PROFIT" },
    { label: "사업 확장", code: "PROFIT" },
    { label: "횡재수", code: "LUCK" },
    { label: "로또 번호", code: "LUCK" },
    { label: "지출 관리", code: "CONTROL" },
    { label: "빚 청산", code: "CONTROL" },
    { label: "내 집 마련", code: "GOAL" },
    { label: "큰 지출 계획", code: "GOAL" },
  ];

/**
 * 커리어 카테고리 세부 칩 — UI 라벨과 의도 코드(`tarotMasterConfig` career 분기) 1:1
 */
const CAREER_INTENT_CHIPS: readonly {
  label: string;
  code: CareerIntentCode;
}[] = [
  { label: "이직 고민", code: "CHANGE" },
  { label: "창업 준비", code: "STARTUP" },
  { label: "퇴사 고민", code: "CHANGE" },
  { label: "승진 기회", code: "GROWTH" },
  { label: "연봉 협상", code: "GROWTH" },
  { label: "직장 내 갈등", code: "RELATION" },
  { label: "동료 관계", code: "RELATION" },
  { label: "적성 탐색", code: "VISION" },
];

/**
 * 학업 카테고리 세부 칩 — UI 라벨과 의도 코드(`tarotMasterConfig` study 분기) 1:1
 */
const STUDY_INTENT_CHIPS: readonly { label: string; code: StudyIntentCode }[] =
  [
    { label: "시험 합격", code: "SUCCESS" },
    { label: "성적 향상", code: "SUCCESS" },
    { label: "논문 통과", code: "SUCCESS" },
    { label: "자격증 취득", code: "SUCCESS" },
    { label: "유학 준비", code: "ABROAD" },
    { label: "집중력 강화", code: "FOCUS" },
    { label: "진로 결정", code: "PATH" },
    { label: "면접 준비", code: "INTERVIEW" },
    { label: "대회 & 경연 준비", code: "CONTEST" },
  ];

/**
 * 건강/마음 카테고리 세부 칩 — UI 라벨과 의도 코드(`tarotMasterConfig` health 분기) 1:1
 */
const HEALTH_INTENT_CHIPS: readonly {
  label: string;
  code: HealthIntentCode;
}[] = [
  { label: "컨디션 난조", code: "VITALITY" },
  { label: "스트레스 해소", code: "HEALING" },
  { label: "무기력증 탈출", code: "HEALING" },
  { label: "번아웃 극복", code: "REST" },
  { label: "깊은 숙면", code: "REST" },
  { label: "다이어트 성공", code: "HABIT" },
  { label: "운동 습관", code: "HABIT" },
  { label: "마음의 평화", code: "MENTAL" },
];

/**
 * 가족·관계 카테고리 세부 칩 — UI 라벨과 의도 코드(`tarotMasterConfig` family 분기) 1:1
 */
const FAMILY_INTENT_CHIPS: readonly {
  label: string;
  code: FamilyIntentCode;
}[] = [
  { label: "부모님 관계", code: "BOND" },
  { label: "형제/자매", code: "BOND" },
  { label: "효도 고민", code: "BOND" },
  { label: "고부 갈등", code: "CONFLICT" },
  { label: "명절 스트레스", code: "CONFLICT" },
  { label: "자녀 교육", code: "CHILDREN" },
  { label: "친구와 화해", code: "REPAIR" },
  { label: "새로운 모임", code: "MEETING" },
];

/**
 * 이동·변화 카테고리 세부 칩 — UI 라벨과 의도 코드(`tarotMasterConfig` travel 분기) 1:1
 */
const TRAVEL_INTENT_CHIPS: readonly {
  label: string;
  code: TravelIntentCode;
}[] = [
  { label: "이사운", code: "RELOCATION" },
  { label: "장거리 여행", code: "JOURNEY" },
  { label: "출장 계획", code: "TRANSFER" },
  { label: "부서 이동", code: "TRANSFER" },
  { label: "해외 운세", code: "JOURNEY" },
  { label: "차량 구매", code: "LIFE_CHANGE" },
  { label: "삶의 변화", code: "LIFE_CHANGE" },
];

/**
 * 꿈·심리 카테고리 세부 칩 — UI 라벨과 의도 코드(`tarotMasterConfig` dream 분기) 1:1
 */
const DREAM_INTENT_CHIPS: readonly { label: string; code: DreamIntentCode }[] =
  [
    { label: "어젯밤 꿈 해몽", code: "INTERPRET" },
    { label: "심리적 안정", code: "HEAL" },
    { label: "잠재의식 탐구", code: "EXPLORE" },
    { label: "트라우마 극복", code: "HEAL" },
    { label: "직관력 강화", code: "EXPLORE" },
    { label: "명확한 꿈", code: "INTERPRET" },
    { label: "자각몽", code: "CONTROL" },
    { label: "악몽", code: "INTERPRET" },
  ];

/**
 * 나만의 이야기 카테고리 세부 칩 — UI 라벨과 의도 코드(`tarotMasterConfig` custom 분기) 1:1
 */
const CUSTOM_INTENT_CHIPS: readonly {
  label: string;
  code: CustomIntentCode;
}[] = [
  { label: "직접 입력", code: "FREE" },
  { label: "말하기 힘든 고민", code: "SECRET" },
  { label: "인생의 전환점", code: "DESTINY" },
  { label: "도전하고 싶은 일", code: "VENTURE" },
  { label: "비밀 이야기", code: "SECRET" },
  { label: "미래의 나", code: "DESTINY" },
];

/**
 * 카테고리별 칩 레지스트리 — 스텝 2, 스프레드 메타, 리딩 상세 코드 조회에 공통 사용
 */
export const INTENT_CHIP_REGISTRIES = {
  love: createIntentChipRegistry<LoveIntentCode>(LOVE_INTENT_CHIPS),
  money: createIntentChipRegistry<MoneyIntentCode>(MONEY_INTENT_CHIPS),
  career: createIntentChipRegistry<CareerIntentCode>(CAREER_INTENT_CHIPS),
  study: createIntentChipRegistry<StudyIntentCode>(STUDY_INTENT_CHIPS),
  health: createIntentChipRegistry<HealthIntentCode>(HEALTH_INTENT_CHIPS),
  family: createIntentChipRegistry<FamilyIntentCode>(FAMILY_INTENT_CHIPS),
  travel: createIntentChipRegistry<TravelIntentCode>(TRAVEL_INTENT_CHIPS),
  dream: createIntentChipRegistry<DreamIntentCode>(DREAM_INTENT_CHIPS),
  custom: createIntentChipRegistry<CustomIntentCode>(CUSTOM_INTENT_CHIPS),
} as const;

/**
 * 스텝 2 칩 한글 라벨로 의도 코드 조회 (`tarotSpreadPositionMeta` 등)
 */
export function getIntentCodeForLabel(
  category: TarotCategory,
  label: string,
): string | undefined {
  const trimmed = label.trim();
  if (trimmed.length === 0) return undefined;
  return INTENT_CHIP_REGISTRIES[category].getCodeForLabel(trimmed);
}

/**
 * LLM payload `detail_category` — 스텝 2에서 고른 한글 칩 라벨을 그대로 전달
 * (스프레드 포지션 lookup은 `getIntentCodeForLabel`로 내부 코드 변환)
 */
export function resolveReadingDetailCategory(
  _category: TarotCategory | null,
  detailTag: string,
): string {
  return detailTag.trim();
}

/** 스텝 2 그리드·스텝 3 뱃지에 쓰는 카테고리 메타 */
export type IntentCategoryOption = {
  id: TarotCategory;
  /** 그리드 짧은 라벨 */
  label: string;
  /** 스텝 3 상단 캡슐 등 긴 표기 */
  badgeLabel: string;
  icon: LucideIcon;
  accentColor: string;
};

/** badgeLabel 생략 시 label과 동일하게 채움 */
function intentCategoryOption(
  id: TarotCategory,
  label: string,
  icon: LucideIcon,
  accentColor: string,
  badgeLabel?: string,
): IntentCategoryOption {
  return {
    id,
    label,
    badgeLabel: badgeLabel ?? label,
    icon,
    accentColor,
  };
}

export const INTENT_CATEGORY_OPTIONS: readonly IntentCategoryOption[] = [
  intentCategoryOption("love", "연애/인연", Heart, "#f87171"),
  intentCategoryOption("money", "금전/재물", Coins, "#facc15"),
  intentCategoryOption("career", "커리어/직업", Briefcase, "#60a5fa"),
  intentCategoryOption("study", "학업/시험", GraduationCap, "#4ade80"),
  intentCategoryOption("health", "건강/마음", Hospital, "#c084fc"),
  intentCategoryOption("family", "가족/관계", Users, "#fb923c"),
  intentCategoryOption("travel", "이동/변화", Plane, "#22d3ee"),
  intentCategoryOption("dream", "꿈/심리", Moon, "#818cf8"),
  intentCategoryOption("custom", "나만의 이야기", Wand2, "#f472b6"),
];

export const CHIPS_BY_CATEGORY = Object.fromEntries(
  (Object.keys(INTENT_CHIP_REGISTRIES) as TarotCategory[]).map((key) => [
    key,
    INTENT_CHIP_REGISTRIES[key].chipLabels,
  ]),
) as Record<TarotCategory, readonly string[]>;

/** 스텝 3 캡슐 등에 쓸 카테고리 한글 표기 */
export function getIntentCategoryBadgeLabel(id: TarotCategory): string {
  const found = INTENT_CATEGORY_OPTIONS.find((o) => o.id === id);
  return found?.badgeLabel ?? id;
}

/** DB main_category(한글 badgeLabel) → TarotCategory id */
export function getTarotCategoryIdFromBadgeLabel(
  badgeLabel: string,
): TarotCategory {
  const found = INTENT_CATEGORY_OPTIONS.find(
    (o) => o.badgeLabel === badgeLabel,
  );
  return found?.id ?? "custom";
}

/** 스텝 2·3에서 동일 아이콘·포인트 컬러lookup */
export function getIntentCategoryOption(
  id: TarotCategory,
): IntentCategoryOption | undefined {
  return INTENT_CATEGORY_OPTIONS.find((o) => o.id === id);
}
