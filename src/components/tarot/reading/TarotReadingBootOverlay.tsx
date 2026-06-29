"use client";

import { useEffect, useRef, useState } from "react";
import FullscreenRuneLoadingOverlay from "@/components/common/fullscreen-rune-loading-overlay/FullscreenRuneLoadingOverlay";

const FADE_S = 0.32;

export type TarotReadingBootOverlayProps = {
  /** 최소 시간·에셋·네뷸라 준비 후 true → 페이드 시작 */
  dismissRequested: boolean;
  /** 페이드 종료 후 한 번 호출 — 부모에서 오버레이 언마운트 */
  onDismissed: () => void;
};

/**
 * 리딩 페이지 도착 직후 — 로띠를 최소 표시 시간과 준비 완료 이후까지 두었다가 페이드합니다.
 */
export default function TarotReadingBootOverlay({
  dismissRequested,
  onDismissed,
}: TarotReadingBootOverlayProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (!dismissRequested || fadeOut) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFadeOut(true);
  }, [dismissRequested, fadeOut]);

  const handleAnimationComplete = () => {
    if (!fadeOut || dismissedRef.current) return;
    dismissedRef.current = true;
    onDismissed();
  };

  return (
    <FullscreenRuneLoadingOverlay
      caption="운명의 실타래를 푸는 중..."
      ariaLabel="운명의 실타래를 푸는 중입니다. 리딩을 준비합니다."
      ariaBusy={!fadeOut}
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{
        duration: FADE_S,
        ease: [0.6, -0.05, 0.01, 0.99],
      }}
      onAnimationComplete={handleAnimationComplete}
    />
  );
}
