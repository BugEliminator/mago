import InquiryPageClient from "@/components/mypage/inquiry/InquiryPageClient";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

/** 문의하기 — 로그인 계정 이메일을 이메일 문의 발신 표시에 사용 */
export default async function InquiryPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <InquiryPageClient userEmail={user?.email ?? ""} />;
}
