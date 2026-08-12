import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase 브라우저 클라이언트 — @supabase/ssr 쿠키 세션 (middleware·Server prefetch 연동)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.",
  );
}

/** 애플리케이션 전역 Supabase 클라이언트 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
