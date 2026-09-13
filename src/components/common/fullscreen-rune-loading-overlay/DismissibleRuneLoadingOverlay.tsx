"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FullscreenRuneLoadingOverlay from "./FullscreenRuneLoadingOverlay";

const FADE_S = 0.32;

export type DismissibleRuneLoadingOverlayProps = {
  caption: React.ReactNode;
  ariaLabel: string;
  /** true면 페이드 시작 */
  dismissRequested: boolean;
  /** 페이드 종료 후 한 번 호출 — 부모에서 언마운트 */
  onDismissed: () => void;
  zIndex?: number;
  /** 이후 페이지별 다른 로띠를 넣을 때 사용. 기본은 룬 */
  lottiePath?: string;
  /** true면 document.body에 포탈 — 헤더·하단 nav 위를 덮을 때 */
  portal?: boolean;
};

/**
 * 공통 풀스크린 룬 오버레이 — 준비 완료 신호가 오면 페이드아웃합니다.
 */
export default function DismissibleRuneLoadingOverlay({
  caption,
  ariaLabel,
  dismissRequested,
  onDismissed,
  zIndex,
  lottiePath,
  portal = false,
}: DismissibleRuneLoadingOverlayProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(!portal);
  const dismissedRef = useRef(false);

  useLayoutEffect(() => {
    if (!portal) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- body 포탈은 클라이언트 마운트 후에만 가능
    setMounted(true);
  }, [portal]);

  useEffect(() => {
    if (!dismissRequested || fadeOut) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFadeOut(true);
  }, [dismissRequested, fadeOut]);

  /** 모바일 Safari 등에서 onAnimationComplete 미호출 시 페이드 후 강제 해제 */
  useEffect(() => {
    if (!fadeOut) return;
    const fallbackMs = Math.ceil(FADE_S * 1000) + 150;
    const timerId = window.setTimeout(() => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      onDismissed();
    }, fallbackMs);
    return () => window.clearTimeout(timerId);
  }, [fadeOut, onDismissed]);

  const handleAnimationComplete = () => {
    if (!fadeOut || dismissedRef.current) return;
    dismissedRef.current = true;
    onDismissed();
  };

  if (!mounted) return null;

  const overlay = (
    <FullscreenRuneLoadingOverlay
      zIndex={zIndex}
      lottiePath={lottiePath}
      caption={caption}
      ariaLabel={ariaLabel}
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

  if (!portal) return overlay;

  return createPortal(overlay, document.body);
}
