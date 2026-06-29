import AuthCallbackPage from "@/components/auth/callback/AuthCallbackPage";

/**
 * Supabase 이메일 확인 등 Auth 리다이렉트용 콜백 URL.
 * 대시보드 Redirect URLs에 `.../auth/callback` 을 등록해야 합니다.
 */
export default function AuthCallbackRoutePage() {
  return <AuthCallbackPage />;
}
