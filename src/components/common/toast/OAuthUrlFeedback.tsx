"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  clearOAuthFeedbackFromUrl,
  readBrowserOAuthError,
} from "@/lib/auth/mapSocialLinkError";

const PROFILE_PATH = "/mypage/profile";
const LOGIN_PATH = "/login";

function isKakaoLinkedQuery(): boolean {
  return new URLSearchParams(window.location.search).get("linked") === "kakao";
}

/** 연동 실패는 프로필, 로그인 화면 에러는 로그인에 남긴다 */
function nextPathAfterOAuthFeedback(pathname: string): string {
  if (pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`)) {
    return LOGIN_PATH;
  }
  if (pathname.startsWith("/mypage") || pathname === "/") {
    return PROFILE_PATH;
  }
  return pathname;
}

/**
 * 해시 OAuth 에러는 서버가 못 읽는다. Toaster 구독 이후에 토스트하고 주소를 지운다.
 */
export default function OAuthUrlFeedback() {
  const router = useRouter();

  useEffect(() => {
    const linked = isKakaoLinkedQuery();
    const oauthError = linked ? null : readBrowserOAuthError();
    if (!linked && oauthError == null) {
      return;
    }

    const pathname = window.location.pathname;
    clearOAuthFeedbackFromUrl();

    if (linked) {
      toast.success("카카오 계정을 연결했습니다.", { id: "oauth-url-linked" });
      if (pathname !== PROFILE_PATH) {
        router.replace(PROFILE_PATH);
      }
      router.refresh();
      return;
    }

    if (oauthError != null) {
      toast.error(oauthError, { id: "oauth-url-error" });
      const next = nextPathAfterOAuthFeedback(pathname);
      if (next !== pathname) {
        router.replace(next);
      }
    }
  }, [router]);

  return null;
}
