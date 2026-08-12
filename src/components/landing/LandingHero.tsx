"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTarotSetupEntry } from "@/hooks/useTarotSetupEntry";
import TarotDraftResumeModal from "@/components/tarot/TarotDraftResumeModal";
import TarotReadingResumeModal from "@/components/tarot/TarotReadingResumeModal";
import TarotGuestEntryModal from "@/components/tarot/TarotGuestEntryModal";
import WarpSpeedBackground from "@/components/common/background/WarpSpeedBackground";
import SpreadTarotCard from "@/components/common/card/SpreadTarotCard";
import {
  LandingRoot,
  HeroMain,
  HeroCopy,
  HeroTitle,
  Highlight,
  HeroDeckFrame,
  DeckAnchor,
} from "./LandingHero.style";
import { preloadLandingDeckImages } from "@/lib/tarot/preload/preloadLandingDeckImages";
import {
  SPREAD_DECK_VISIBLE_COUNT,
  SPREAD_DECK_VISIBLE_COUNT_MOBILE,
  LANDING_MAJOR_ARCANA_FACE_PATHS,
} from "@/types/tarot";
import {
  MOBILE_MAX_PX,
  LAYOUT_DESKTOP_CARD_WIDTH_PX,
  LAYOUT_DESKTOP_SPREAD_STEP_PX,
  LAYOUT_MOBILE_CARD_WIDTH_PX,
  calcLandingSpreadStepPx,
} from "@/lib/layout/layout";

const SPREAD_MS = 500;
const TEXT_REVEAL_MS = 2000;

/**
 * 랜딩 히어로 — 워프 배경 + 세로 스택(상단 카드 → 텍스트 → 하단 카드)
 * (헤더는 `AppLayoutShell`의 `ConditionalHeader`에서 렌더)
 */
export default function LandingHero() {
  const {
    guestEntryOpen,
    readingResumeOpen,
    resumeOpen,
    handleGuestBrowse,
    handleGuestLogin,
    handleDismissGuestEntry,
    handleResumeReading,
    handleStartFreshFromReading,
    handleDismissReadingResume,
    handleResume,
    handleStartFresh,
    handleDismissResume,
  } = useTarotSetupEntry();
  const [isSpread, setIsSpread] = useState(false);
  const [showText, setShowText] = useState(false);
  const deckFrameRef = useRef<HTMLDivElement | null>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [deckCount, setDeckCount] = useState(SPREAD_DECK_VISIBLE_COUNT);
  const [isDesktopLayout, setIsDesktopLayout] = useState(true);

  /** ≤640px 모바일: 프레임 너비에 맞춰 스프레드 간격 계산 */
  useLayoutEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MOBILE_MAX_PX + 1}px)`);
    const readLayout = () => {
      const desktop = mq.matches;
      setIsDesktopLayout(desktop);
      setDeckCount(
        desktop ? SPREAD_DECK_VISIBLE_COUNT : SPREAD_DECK_VISIBLE_COUNT_MOBILE,
      );
    };
    readLayout();
    mq.addEventListener("change", readLayout);
    return () => mq.removeEventListener("change", readLayout);
  }, []);

  /** 모바일 전용 — 덱 프레임 실제 너비 측정 */
  useLayoutEffect(() => {
    if (isDesktopLayout) return;

    const el = deckFrameRef.current;
    if (!el) return;

    const read = () => {
      setContentWidth(el.getBoundingClientRect().width);
    };
    read();
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w != null) setContentWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isDesktopLayout]);

  const n = deckCount;
  /** ≥641px: 1240 고정 step / ≤640px: 프레임 너비 기준 유동 step */
  const spreadStepPx = isDesktopLayout
    ? LAYOUT_DESKTOP_SPREAD_STEP_PX
    : calcLandingSpreadStepPx(
        contentWidth,
        LAYOUT_MOBILE_CARD_WIDTH_PX,
        n,
      );
  const cardWidthPx = isDesktopLayout
    ? LAYOUT_DESKTOP_CARD_WIDTH_PX
    : LAYOUT_MOBILE_CARD_WIDTH_PX;
  const stackStepPx = Math.round(cardWidthPx * 0.025);

  /** 직접 URL 진입·캐시 미스 시 덱 이미지 선로드 */
  useEffect(() => {
    void preloadLandingDeckImages();
  }, []);

  useEffect(() => {
    const spreadTimer = setTimeout(() => {
      setIsSpread(true);
    }, SPREAD_MS);

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, TEXT_REVEAL_MS);

    return () => {
      clearTimeout(spreadTimer);
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <>
      {guestEntryOpen ? (
        <TarotGuestEntryModal
          onBrowse={handleGuestBrowse}
          onLogin={handleGuestLogin}
          onDismiss={handleDismissGuestEntry}
        />
      ) : null}
      {readingResumeOpen ? (
        <TarotReadingResumeModal
          onResume={handleResumeReading}
          onStartFresh={handleStartFreshFromReading}
          onDismiss={handleDismissReadingResume}
        />
      ) : null}
      {resumeOpen ? (
        <TarotDraftResumeModal
          onResume={handleResume}
          onStartFresh={handleStartFresh}
          onDismiss={handleDismissResume}
        />
      ) : null}
      <LandingRoot>
        <WarpSpeedBackground />

        <HeroMain>
          <HeroDeckFrame ref={deckFrameRef}>
            <DeckAnchor $placement="top" aria-hidden>
              {Array.from({ length: deckCount }, (_, i) => (
                <SpreadTarotCard
                  key={`top-${i}`}
                  isSpread={isSpread}
                  index={i}
                  isTop
                  spreadStepPx={spreadStepPx}
                  stackStepPx={stackStepPx}
                  deckCount={deckCount}
                  imageSrc={LANDING_MAJOR_ARCANA_FACE_PATHS[i]}
                />
              ))}
            </DeckAnchor>

            <HeroCopy $visible={showText}>
              <HeroTitle>
                타로와 현대 AI 기술이 만나 탄생한{" "}
                <Highlight>신비로운</Highlight> 타로 서비스
              </HeroTitle>
            </HeroCopy>

            <DeckAnchor $placement="bottom" aria-hidden>
              {Array.from({ length: deckCount }, (_, i) => (
                <SpreadTarotCard
                  key={`bottom-${i}`}
                  isSpread={isSpread}
                  index={i}
                  isTop={false}
                  spreadStepPx={spreadStepPx}
                  stackStepPx={stackStepPx}
                  deckCount={deckCount}
                />
              ))}
            </DeckAnchor>
          </HeroDeckFrame>
        </HeroMain>
      </LandingRoot>
    </>
  );
}
