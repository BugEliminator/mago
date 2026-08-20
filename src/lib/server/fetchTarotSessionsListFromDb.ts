import type { HistoryListItem } from "@/components/mypage/history/historyTypes";
import {
  HISTORY_INITIAL_SERVER_LIMIT,
  HISTORY_SESSIONS_API_MAX_LIMIT,
} from "@/lib/mypage/history/historyPaginationConstants";
import { createSupabaseAdmin } from "@/lib/supabase/supabaseAdmin";

const HISTORY_LIST_SELECT =
  "id, main_category, detail_category, fortune_score, created_at, summary_line, has_reviewed, rating, card_count";

export type TarotSessionsListPageResult = {
  sessions: HistoryListItem[];
  totalCount: number;
};

export { HISTORY_INITIAL_SERVER_LIMIT, HISTORY_SESSIONS_API_MAX_LIMIT };

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

type FetchTarotSessionsListPageOptions = {
  offset: number;
  limit: number;
};

const EMPTY_PAGE: TarotSessionsListPageResult = {
  sessions: [],
  totalCount: 0,
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

/** offset·limit 유효성 — API·서버 공용 */
export function normalizeHistorySessionsPagination(
  offsetRaw: unknown,
  limitRaw: unknown,
): { ok: true; offset: number; limit: number } | { ok: false; message: string } {
  const offset =
    typeof offsetRaw === "number"
      ? offsetRaw
      : typeof offsetRaw === "string"
        ? Number.parseInt(offsetRaw, 10)
        : Number.NaN;
  const limit =
    typeof limitRaw === "number"
      ? limitRaw
      : typeof limitRaw === "string"
        ? Number.parseInt(limitRaw, 10)
        : Number.NaN;

  if (!Number.isFinite(offset) || offset < 0) {
    return { ok: false, message: "offset은 0 이상의 정수여야 합니다." };
  }
  if (!Number.isFinite(limit) || limit < 1 || limit > HISTORY_SESSIONS_API_MAX_LIMIT) {
    return {
      ok: false,
      message: `limit은 1~${HISTORY_SESSIONS_API_MAX_LIMIT} 사이 정수여야 합니다.`,
    };
  }

  return { ok: true, offset: Math.floor(offset), limit: Math.floor(limit) };
}

/**
 * 로그인 유저 tarot_sessions 목록 페이지 조회 (최신순, 소프트 삭제 제외)
 * 마이페이지 히스토리·GET /api/tarot/sessions 공용
 */
export async function fetchTarotSessionsListPageFromDb(
  userId: string,
  options: FetchTarotSessionsListPageOptions,
): Promise<TarotSessionsListPageResult> {
  const normalized = normalizeHistorySessionsPagination(
    options.offset,
    options.limit,
  );
  if (!normalized.ok) {
    return EMPTY_PAGE;
  }

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch {
    return EMPTY_PAGE;
  }

  const { offset, limit } = normalized;
  const rangeEnd = offset + limit - 1;

  const { data, error, count } = await admin
    .from("tarot_sessions")
    .select(HISTORY_LIST_SELECT, { count: "exact" })
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(offset, rangeEnd);

  if (error != null) {
    console.error("[fetchTarotSessionsListPageFromDb]", error.message);
    return EMPTY_PAGE;
  }

  return {
    sessions: ((data ?? []) as TarotSessionListRow[]).map(mapRowToHistoryListItem),
    totalCount: count ?? 0,
  };
}
