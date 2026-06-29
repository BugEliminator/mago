"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { ScrollToTopButton } from "./ResultScrollToTopButton.style";

/** 스크롤이 이 값을 넘으면 FAB 표시 */
const SHOW_AFTER_SCROLL_Y = 320;

/**
 * 결과 페이지 우하단 — 클릭 시 페이지 맨 위로 부드럽게 스크롤
 */
export default function ResultScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const syncVisibility = (): void => {
      setVisible(window.scrollY > SHOW_AFTER_SCROLL_Y);
    };

    syncVisibility();
    window.addEventListener("scroll", syncVisibility, { passive: true });
    return () => window.removeEventListener("scroll", syncVisibility);
  }, []);

  const handleClick = useCallback((): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!visible) return null;

  return (
    <ScrollToTopButton type="button" onClick={handleClick} aria-label="맨 위로 이동">
      <ChevronUp size={22} strokeWidth={2.5} aria-hidden />
    </ScrollToTopButton>
  );
}
