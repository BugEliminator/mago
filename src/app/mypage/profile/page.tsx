import ProfilePageClient from "@/components/mypage/profile/ProfilePageClient";
import { userHasKakaoIdentity, userHasEmailIdentity } from "@/lib/auth/socialNickname";
import { fetchProfileFromDb } from "@/lib/server/fetchProfileFromDb";
import { getServerAuthUser } from "@/lib/supabase/supabaseServer";

/**
 * 프로필 설정 페이지 — 서버에서 profiles 데이터 prefetch
 */
export default async function ProfilePage() {
  const user = await getServerAuthUser();
  const profile =
    user != null ? await fetchProfileFromDb(user.id) : null;

  return (
    <ProfilePageClient
      initialProfile={profile}
      kakaoLinked={userHasKakaoIdentity(user?.identities)}
      hasEmailLogin={userHasEmailIdentity(user?.identities)}
    />
  );
}
