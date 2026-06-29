import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 서버 전용 Supabase Admin 클라이언트 (service role)
 * RLS를 우회해 tarot_sessions / tarot_session_cards 적재에 사용합니다.
 * 클라이언트 번들에 포함되지 않도록 server/ · API Route에서만 import하세요.
 */
export function createSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (supabaseUrl == null || supabaseUrl.length === 0) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다. .env.local을 확인하세요.",
    );
  }
  if (serviceRoleKey == null || serviceRoleKey.length === 0) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다. .env.local을 확인하세요.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
