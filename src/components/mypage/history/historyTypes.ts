/** 히스토리 목록 아이템 — tarot_sessions 목록 조회·UI 공용 */
export type HistoryListItem = {
  id: string;
  main_category: string;
  detail_category: string;
  fortune_score: number;
  created_at: string;
  summary_line: string;
  has_reviewed: boolean;
  rating: number | null;
  card_count: number;
};
