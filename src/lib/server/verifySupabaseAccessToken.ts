import { createClient } from "@supabase/supabase-js";

/**
 * Authorization Bearer 토큰으로 로그인 유저 검증 — service role INSERT 전 user_id 확인용
 */
export async function verifySupabaseAccessToken(
  accessToken: string,
): Promise<{ userId: string; email: string | null } | null> {
  const token = accessToken.trim();
  if (token.length === 0) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (supabaseUrl == null || anonKey == null) return null;

  const client = createClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);

  if (error != null || user == null) return null;
  return { userId: user.id, email: user.email ?? null };
}
