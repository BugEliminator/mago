import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { fetchProfileFromDb } from "@/lib/server/fetchProfileFromDb";
import { isMobileUserAgent } from "@/lib/isMobileUserAgent";
import MypageHubClient from "@/components/mypage/hub/MypageHubClient";

/**
 * /mypage — 모바일: 프로필 카드 + 메뉴 허브 / 데스크톱: /mypage/history로 즉시 이동
 */
export default async function MypagePage() {
  const userAgent = (await headers()).get("user-agent") ?? "";
  if (!isMobileUserAgent(userAgent)) {
    redirect("/mypage/history");
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id ?? null;
  const profile = userId != null ? await fetchProfileFromDb(userId) : null;

  const nickname = profile?.nickname ?? "";
  const email = profile?.email || user?.email || "";
  const uid = profile?.uid ?? userId ?? "";

  return (
    <MypageHubClient nickname={nickname} email={email} uid={uid} />
  );
}
