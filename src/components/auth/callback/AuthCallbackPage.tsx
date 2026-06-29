"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SpaceBackground from "@/components/common/background/SpaceBackground";
import {
  AuthPageRoot,
  AuthContentLayer,
} from "@/components/auth/AuthScreen.style";
import { preloadLandingDeckImages } from "@/lib/preloadLandingDeckImages";
import { supabase } from "@/lib/supabaseClient";
import { CallbackStatus } from "./AuthCallbackPage.style";

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const code = searchParams.get("code");
      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (exchangeError) {
          router.replace(
            `/login?error=${encodeURIComponent(exchangeError.message)}`
          );
          return;
        }
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (cancelled) return;

      if (error) {
        router.replace(
          `/login?error=${encodeURIComponent(error.message)}`
        );
        return;
      }
      if (session) {
        await preloadLandingDeckImages();
        router.replace("/");
        return;
      }
      router.replace("/login");
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <AuthPageRoot>
      <SpaceBackground />
      <AuthContentLayer>
        <CallbackStatus>이동 중입니다…</CallbackStatus>
      </AuthContentLayer>
    </AuthPageRoot>
  );
}

/**
 * 이메일 인증 링크 클릭 후 리다이렉트되는 라우트.
 * URL의 `code`(PKCE) 또는 해시 기반 세션을 반영한 뒤 세션을 확인합니다.
 */
export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <AuthPageRoot>
          <SpaceBackground />
          <AuthContentLayer>
            <CallbackStatus>이동 중입니다…</CallbackStatus>
          </AuthContentLayer>
        </AuthPageRoot>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
