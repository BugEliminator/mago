import { redirect } from "next/navigation";
import { getServerAuthUserId } from "@/lib/supabaseServer";
import MypageLayoutShell from "@/components/mypage/layout/MypageLayoutShell";

/**
 * 마이페이지 레이아웃 — 비로그인 시 /login 리다이렉트
 */
export default async function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getServerAuthUserId();
  if (userId == null) redirect("/login");

  return <MypageLayoutShell>{children}</MypageLayoutShell>;
}
