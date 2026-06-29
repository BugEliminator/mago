import type { HistoryListItem } from "@/components/mypage/history/historyTypes";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

const HISTORY_LIST_SELECT =
  "id, main_category, detail_category, fortune_score, created_at, summary_line, has_reviewed, rating, card_count";

type TarotSessionListRow = {
  id: string;
  main_category: string | null;
  detail_category: string | null;
  fortune_score: number | null;
  created_at: string;
  summary_line: string | null;
  has_reviewed: boolean | null;
  rating: number | null;
  card_count: number | null;
};

/** DB 행 → 히스토리 목록 아이템 (nullable 컬럼 기본값 처리) */
function mapRowToHistoryListItem(row: TarotSessionListRow): HistoryListItem {
  return {
    id: row.id,
    main_category: row.main_category ?? "",
    detail_category: row.detail_category ?? "",
    fortune_score: row.fortune_score ?? 0,
    created_at: row.created_at,
    summary_line: row.summary_line ?? "",
    has_reviewed: row.has_reviewed ?? false,
    rating: row.rating,
    card_count: row.card_count ?? 0,
  };
}

/**
 * 로그인 유저의 tarot_sessions 목록 조회 (최신순)
 * 마이페이지 히스토리 목록 전용 — 상세 카드 데이터는 포함하지 않음
 */
export async function fetchTarotSessionsListFromDb(
  userId: string,
): Promise<HistoryListItem[]> {
  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch {
    return [];
  }

  const { data, error } = await admin
    .from("tarot_sessions")
    .select(HISTORY_LIST_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error != null) {
    console.error("[fetchTarotSessionsListFromDb]", error.message);
    return [];
  }

  return ((data ?? []) as TarotSessionListRow[]).map(mapRowToHistoryListItem);
}
