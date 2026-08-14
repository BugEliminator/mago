import HistoryPageClient from "@/components/mypage/history/HistoryPageClient";
import {
  fetchTarotSessionsListPageFromDb,
  HISTORY_INITIAL_SERVER_LIMIT,
} from "@/lib/server/fetchTarotSessionsListFromDb";
import { getServerAuthUserId } from "@/lib/supabase/supabaseServer";

/**
 * 내 운세 히스토리 페이지 — 서버에서 tarot_sessions 초기 목록 prefetch
 */
export default async function HistoryPage() {
  const userId = await getServerAuthUserId();
  const { sessions, totalCount } =
    userId != null
      ? await fetchTarotSessionsListPageFromDb(userId, {
          offset: 0,
          limit: HISTORY_INITIAL_SERVER_LIMIT,
        })
      : { sessions: [], totalCount: 0 };

  return (
    <HistoryPageClient initialSessions={sessions} totalCount={totalCount} />
  );
}
