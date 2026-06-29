"use client";

import FullscreenRuneLoadingOverlay from "@/components/common/fullscreen-rune-loading-overlay/FullscreenRuneLoadingOverlay";

/**
 * 카드를 모두 뽑은 뒤 결과로 넘어가기 전 — 마고 해석 중 안내
 */
export default function TarotReadingInterpretOverlay() {
  return (
    <FullscreenRuneLoadingOverlay
      caption="마고가 해석을 엮는 중…"
      ariaLabel="마고가 해석을 엮는 중입니다. 결과를 준비합니다."
      ariaBusy={true}
      zIndex={70}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    />
  );
}
