import ProfilePageClient from "@/components/mypage/profile/ProfilePageClient";
import { fetchProfileFromDb } from "@/lib/server/fetchProfileFromDb";
import { getServerAuthUserId } from "@/lib/supabaseServer";

/**
 * 프로필 설정 페이지 — 서버에서 profiles 데이터 prefetch
 */
export default async function ProfilePage() {
  const userId = await getServerAuthUserId();
  const profile =
    userId != null ? await fetchProfileFromDb(userId) : null;

  return <ProfilePageClient initialProfile={profile} />;
}
