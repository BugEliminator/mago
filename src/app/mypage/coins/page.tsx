import CoinsPageClient from "@/components/mypage/coins/CoinsPageClient";
import { fetchCoinDataFromDb } from "@/lib/server/fetchCoinDataFromDb";
import { getServerAuthUserId } from "@/lib/supabase/supabaseServer";

/**
 * 엽전 충전소 — 서버에서 coin 잔액·이용 내역 prefetch
 */
export default async function CoinsPage() {
  const userId = await getServerAuthUserId();
  const initialData =
    userId != null
      ? await fetchCoinDataFromDb(userId)
      : { balance: 0, histories: [], hasCheckedInToday: false };

  /** 유·무료 복채 데모 잠금 토글 — 로컬 dev 전용 */
  const showDemoToggle = process.env.NODE_ENV === "development";

  return (
    <CoinsPageClient initialData={initialData} showDemoToggle={showDemoToggle} />
  );
}
