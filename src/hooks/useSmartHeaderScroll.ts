"use client";

import { useEffect, useRef, useState } from "react";

const SCROLL_DELTA_THRESHOLD = 10;
/** 상단 근처에서는 항상 헤더 표시 */
const TOP_REVEAL_OFFSET = 56;
const MOBILE_MEDIA_QUERY = "(max-width: 640px)";

type UseSmartHeaderScrollOptions = {
  enabled?: boolean;
};

/**
 * 스크롤 방향에 따라 헤더 숨김 상태를 반환 (모바일 전용)
 * — 아래로 스크롤: 숨김 / 위로 스크롤: 표시
 */
export default function useSmartHeaderScroll({
  enabled = false,
}: UseSmartHeaderScrollOptions = {}): boolean {
  const [hidden, setHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    let scrollActive = mediaQuery.matches;
    lastScrollYRef.current = window.scrollY;
    tickingRef.current = false;

    const update = () => {
      if (!scrollActive) {
        tickingRef.current = false;
        return;
      }

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY <= TOP_REVEAL_OFFSET) {
        setHidden(false);
      } else if (delta > SCROLL_DELTA_THRESHOLD) {
        setHidden(true);
      } else if (delta < -SCROLL_DELTA_THRESHOLD) {
        setHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
      tickingRef.current = false;
    };

    const onScroll = () => {
      if (!scrollActive || tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(update);
    };

    const onMediaChange = (event: MediaQueryListEvent) => {
      scrollActive = event.matches;
      lastScrollYRef.current = window.scrollY;
      tickingRef.current = false;
      setHidden(false);
    };

    mediaQuery.addEventListener("change", onMediaChange);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", onMediaChange);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  return enabled ? hidden : false;
}
