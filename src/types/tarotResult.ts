import type { TarotCategory } from "@/types/tarot";

/**
 * 타로 결과 페이지 UI용 타입 (Supabase 연동 전 퍼블리싱 단계에서 사용)
 */

/** 「내가 선택한 운세」 패널에 표시할 입력·설정 요약 */
export interface TarotResultSelectionSummaryProps {
  /** 뽑은 카드 수 라벨 (예: "3장") */
  drawnCardsLabel: string;
  /** setup 카테고리 id — 세부 태그 포인트 컬러 lookup용 */
  categoryId: TarotCategory;
  /** 상위 카테고리 라벨 (예: "연애운 / 썸") */
  categoryLabel: string;
  /** 세부 의도 태그 문구 — 화면에서는 `#` 접두와 함께 표시 */
  intentTagLabel: string;
  /** 스텝 3 현재 상황 설명 */
  situation: string;
  /** 스텝 3 질문 내용 */
  question: string;
  /** 운세 흐름 지수 0~100 — LLM·DB 연동 후 교체 */
  flowScore: number;
}

/** 「뽑은 카드 한눈에 보기」 — 슬롯 1장 썸네일 (Storage URL + 역방향) */
export type ResultCardThumbSlot = {
  /** Supabase Storage 앞면 URL — null이면 플립하지 않음 */
  faceSrc: string | null;
  isReversed: boolean;
  /** cards 조회 완료 여부 — false면 뒷면만 */
  resolved: boolean;
};

/** 「뽑은 카드 한눈에 보기」 패널 — 슬롯마다 뒷면 등 노출 */
export interface TarotResultCardOverviewProps {
  /** 화면에 나열할 카드 슬롯 수 */
  slotCount: number;
  /** 하단 요약 한 줄 */
  insight: string;
  /** 썸네일 탭 시(예: 상세 섹션으로 스크롤) — 없으면 비클릭 */
  onSlotClick?: (slotIndex: number) => void;
  /**
   * 슬롯 순 카드 썸네일 — `slotCount`만큼.
   * resolved=false: 뒷면만, resolved=true && faceSrc: 플립 후 앞면.
   */
  thumbSlots?: readonly ResultCardThumbSlot[];
}

/** 카드 1장 — 이미지 + 페이즈·요약·마고 해석 블록 */
export interface TarotResultCardDetailProps {
  /** 뽑은 순번(1부터) — 상세 하단·한눈에 보기와 동일하게 `CARD n` 표기에 사용 */
  orderIndex: number;
  /** 배지에 표시할 페이즈 숫자 (`PHASE 1`) */
  phaseNumber: number;
  /** 페이즈 부제 (예: 과거: 소통의 시작) */
  phaseLabel: string;
  /** 카드 이름 */
  cardName: string;
  /** 카드 한 줄 설명 */
  summaryLine: string;
  /** 마고 해석 전체 — 빈 줄로 문단 구분 가능 */
  magoInterpretation: string;
  /** Storage 앞면 URL·역방향 — 없으면 뒷면만 표시 */
  thumbSlot?: ResultCardThumbSlot;
}

/** 「마고의 마무리 조언」 블록 — 클로징 카피 */
export interface TarotResultFinalAdviceProps {
  adviceText: string;
}

/** 별점·피드백 영역 — DB has_reviewed 연동 */
export interface TarotResultRatingProps {
  readingId: string;
  /** true면 감사 UI만 표시 (재제출 불가) */
  hasReviewed: boolean;
}

// ---------------------------------------------------------------------------
// 결과 페이지 전체 뷰 데이터 — mapper가 만들고 page.tsx가 소비
// ---------------------------------------------------------------------------

/** 결과 상단 — 선택 요약 + 흐름 지수 */
export interface ResultPageSelectionData {
  drawnCardsLabel: string;
  categoryId: TarotCategory;
  categoryLabel: string;
  intentTagLabel: string;
  situation: string;
  question: string;
  flowScore: number;
}

/** 카드 한눈에 보기 */
export interface ResultPageOverviewData {
  slotCount: number;
  /** res_theme (한줄 요약) */
  insight: string;
}

/** 카드 상세 1장 */
export interface ResultPageCardDetailData {
  orderIndex: number;
  phaseNumber: number;
  /** res_readings[i].label */
  phaseLabel: string;
  /** res_readings[i].card_name */
  cardName: string;
  /** res_readings[i].one_liner */
  summaryLine: string;
  /** res_readings[i].paragraphs 두 문단을 \n\n으로 이어 붙인 값 */
  magoInterpretation: string;
}

/**
 * 결과 페이지 전체 뷰 데이터
 * `mapMagoResultToResultPage()`가 생성하고 `TarotResultPage`가 소비합니다.
 */
export interface ResultPageViewData {
  selection: ResultPageSelectionData;
  overview: ResultPageOverviewData;
  cardDetails: ResultPageCardDetailData[];
  /** res_mago_advice.summary */
  finalAdvice: string;
}
