"use client";

import { useEffect } from "react";
import { MYPAGE_IMMERSIVE_MOBILE_SURFACE } from "./MypageLayoutShell.style";

const MOBILE_MAX_QUERY = "(max-width: 640px)";

/**
 * 마이페이지 몰입형 서브페이지 모바일 — overscroll·바운스 시 우주 배경 대신 크림 surface 노출
 */
export function useMypageImmersiveMobileSurface(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    const mq = window.matchMedia(MOBILE_MAX_QUERY);
    const html = document.documentElement;
    const { body } = document;

    const prevHtmlBg = html.style.backgroundColor;
    const prevBodyBg = body.style.backgroundColor;
    const prevOverscroll = html.style.overscrollBehaviorY;

    const sync = (): void => {
      if (!mq.matches) {
        html.style.backgroundColor = prevHtmlBg;
        body.style.backgroundColor = prevBodyBg;
        html.style.overscrollBehaviorY = prevOverscroll;
        return;
      }

      html.style.backgroundColor = MYPAGE_IMMERSIVE_MOBILE_SURFACE;
      body.style.backgroundColor = MYPAGE_IMMERSIVE_MOBILE_SURFACE;
      html.style.overscrollBehaviorY = "none";
    };

    sync();
    mq.addEventListener("change", sync);

    return () => {
      mq.removeEventListener("change", sync);
      html.style.backgroundColor = prevHtmlBg;
      body.style.backgroundColor = prevBodyBg;
      html.style.overscrollBehaviorY = prevOverscroll;
    };
  }, [enabled]);
}
