"use client";

import { useEffect } from "react";
import { syncTarotLocalDraftOnAuthChange } from "@/lib/tarotLocalDraft";
import { supabase } from "@/lib/supabaseClient";

/**
 * 로그인·로그아웃·유저 전환 시 타로 wizard 메모리를 localStorage owner와 맞춤
 */
export default function TarotDraftAuthSync() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncTarotLocalDraftOnAuthChange(session?.user?.id ?? null);
    });

    void supabase.auth.getSession().then(({ data: { session } }) => {
      syncTarotLocalDraftOnAuthChange(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
