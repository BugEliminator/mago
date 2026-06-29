/**
 * MAGO LLM (MAGO_v1) 응답 타입
 * OpenAI response_format: json_object 기준
 */

/** 카드 1장의 LLM 해석 — res_readings 배열의 각 항목 */
export interface MagoLlmReadingItem {
  /** 포지션 라벨 (예: "현재의 역량") */
  label: string;
  /** 카드 영문명 — Supabase cards.name_en 과 동일 (예: "Three of Cups") */
  card_name_en: string;
  /** 역방향 여부 — true: 역방향, false: 정방향 */
  is_reversed: boolean;
  /** 카드 한 줄 요약 */
  one_liner: string;
  /** 해석 문단 2개 — [0]: 카드 의미·상황, [1]: 실천·조언 */
  paragraphs: [string, string];
}

/** 마고의 마무리 조언 */
export interface MagoLlmAdvice {
  /** 리딩 전체를 관통하는 마고의 한 문단 조언 */
  summary: string;
}

/**
 * MAGO_v1 LLM 전체 응답 구조
 * AX에서 받은 JSON을 코드에서 다룰 때 이 타입으로 파싱합니다.
 */
export interface MagoLlmResult {
  /** 운세 흐름 지수 (0~100) */
  res_score: number;
  /** 점수 구간 라벨 (예: "안정/정체", "매우 긍정", "조율 필요") */
  res_score_status: string;
  /** 리딩 테마 — 결과 한줄 요약에 사용 */
  res_theme: string;
  /** 카드별 해석 목록 — 장 수만큼 */
  res_readings: MagoLlmReadingItem[];
  /** 마고의 마무리 조언 */
  res_mago_advice: MagoLlmAdvice;
}
