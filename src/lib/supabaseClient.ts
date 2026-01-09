import { createClient } from "@supabase/supabase-js";

/**
 * Supabase 클라이언트 생성
 * 환경 변수에서 Supabase URL과 Anon Key를 가져와 클라이언트를 초기화합니다.
 */

// 환경 변수 검증
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요."
  );
}

/**
 * Supabase 클라이언트 인스턴스
 * 애플리케이션 전역에서 사용할 수 있는 Supabase 클라이언트입니다.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
