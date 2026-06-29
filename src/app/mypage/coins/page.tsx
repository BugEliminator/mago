import CoinsPageClient from "@/components/mypage/coins/CoinsPageClient";
import { fetchCoinDataFromDb } from "@/lib/server/fetchCoinDataFromDb";
import { getServerAuthUserId } from "@/lib/supabaseServer";

/**
 * 엽전 충전소 — 서버에서 coin 잔액·이용 내역 prefetch
 */
export default async function CoinsPage() {
  const userId = await getServerAuthUserId();
  const initialData =
    userId != null
      ? await fetchCoinDataFromDb(userId)
      : { balance: 0, histories: [], hasCheckedInToday: false };

  return <CoinsPageClient initialData={initialData} />;
}
