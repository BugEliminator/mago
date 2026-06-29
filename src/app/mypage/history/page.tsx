import HistoryPageClient from "@/components/mypage/history/HistoryPageClient";
import { fetchTarotSessionsListFromDb } from "@/lib/server/fetchTarotSessionsListFromDb";
import { getServerAuthUserId } from "@/lib/supabaseServer";

/**
 * 내 운세 히스토리 페이지 — 서버에서 tarot_sessions 목록 prefetch
 */
export default async function HistoryPage() {
  const userId = await getServerAuthUserId();
  const sessions =
    userId != null ? await fetchTarotSessionsListFromDb(userId) : [];

  return <HistoryPageClient initialSessions={sessions} />;
}
