"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * 로컬 개발 시에만 Supabase 세션·유저 정보를 콘솔에 출력합니다.
 * 프로덕션 빌드에서는 동작하지 않습니다.
 */
export default function DevSessionLogger() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const logSession = (label: string) => {
      void supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          console.log(`[MAGO dev] ${label} — 현재 로그인:`, {
            id: session.user.id,
            email: session.user.email,
            phone: session.user.phone,
            user_metadata: session.user.user_metadata,
            app_metadata: session.user.app_metadata,
            expires_at: session.expires_at,
          });
        } else {
          console.log(`[MAGO dev] ${label} — 로그인된 세션 없음`);
        }
      });
    };

    logSession("마운트");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[MAGO dev] onAuthStateChange:", event, {
        email: session?.user?.email ?? null,
        userId: session?.user?.id ?? null,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
