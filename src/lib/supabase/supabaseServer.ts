import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import type { User } from "@supabase/supabase-js";

/**
 * Server Component / Route Handler용 Supabase 클라이언트 (쿠키 세션)
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (supabaseUrl == null || anonKey == null) {
    throw new Error(
      "Supabase 환경 변수가 설정되지 않았습니다. .env.local을 확인하세요.",
    );
  }

  return createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component에서 setAll 호출 시 무시 (middleware가 갱신)
        }
      },
    },
  });
}

/**
 * 서버에서 로그인 유저 — 없으면 null
 * layout·page 등 같은 RSC 요청 안에서 중복 getUser() 방지 (React.cache)
 */
export const getServerAuthUser = cache(async (): Promise<User | null> => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error != null || user == null) return null;
  return user;
});

/**
 * 서버에서 로그인 유저 id — 없으면 null
 */
export const getServerAuthUserId = cache(async (): Promise<string | null> => {
  const user = await getServerAuthUser();
  return user?.id ?? null;
});
