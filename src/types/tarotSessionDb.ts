import type { MagoLlmResult } from "@/types/magoResult";
import type { TarotSessionSetup } from "@/types/tarot";

/** public.tarot_sessions — 리딩 세션 마스터 (조회·타입 참조용) */
export interface TarotSessionRow {
  id: string;
  user_id: string;
  card_count: number;
  main_category: string;
  detail_category: string;
  fortune_score: number;
  user_situation: string;
  user_question: string;
  summary_line: string;
  final_advice: string;
  has_reviewed: boolean;
  rating: number | null;
  review_content: string | null;
  created_at?: string;
}

/** tarot_sessions 후기 UPDATE payload */
export type TarotSessionReviewUpdate = {
  has_reviewed: true;
  rating: number;
  review_content: string | null;
};

export type SubmitTarotSessionReviewInput = {
  readingId: string;
  userId: string;
  rating: number;
  reviewContent: string | null;
};

export type SubmitTarotSessionReviewErrorCode =
  | "ENV_MISSING"
  | "VALIDATION"
  | "NOT_FOUND"
  | "ALREADY_REVIEWED"
  | "UPDATE_FAILED";

export type SubmitTarotSessionReviewResult =
  | { ok: true }
  | {
      ok: false;
      code: SubmitTarotSessionReviewErrorCode;
      message: string;
    };

/** public.tarot_session_cards — 세션별 카드 상세 (조회·타입 참조용) */
export interface TarotSessionCardRow {
  id: number;
  session_id: string;
  order_index: number;
  card_id: number;
  card_name_en: string;
  is_reversed: boolean;
  phase_label: string;
  one_liner: string;
  paragraphs: [string, string];
}

/** tarot_sessions INSERT payload (DB default 컬럼 제외) */
export type TarotSessionInsert = Pick<
  TarotSessionRow,
  | "id"
  | "user_id"
  | "card_count"
  | "main_category"
  | "detail_category"
  | "fortune_score"
  | "user_situation"
  | "user_question"
  | "summary_line"
  | "final_advice"
>;

/** tarot_session_cards INSERT payload (id 자동 증가 제외) */
export type TarotSessionCardInsert = Omit<TarotSessionCardRow, "id">;

/** 서버 저장 함수 입력 — LLM 결과 + setup + URL용 session UUID */
export interface SaveTarotSessionInput {
  /** 결과 페이지 URL과 동일한 UUID */
  sessionId: string;
  userId: string;
  setup: TarotSessionSetup;
  llm: MagoLlmResult;
}

export type SaveTarotSessionErrorCode =
  | "ENV_MISSING"
  | "VALIDATION"
  | "CARD_LOOKUP"
  | "SESSION_INSERT"
  | "CARDS_INSERT"
  | "DUPLICATE_SESSION";

export type SaveTarotSessionResult =
  | { ok: true; sessionId: string }
  | {
      ok: false;
      code: SaveTarotSessionErrorCode;
      message: string;
    };
