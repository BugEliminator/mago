"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import WarpSpeedBackground from "@/components/common/background/WarpSpeedBackground";
import SpreadTarotCard from "@/components/common/card/SpreadTarotCard";
import {
  LandingRoot,
  HeroMain,
  HeroCopy,
  HeroTitle,
  Highlight,
  CtaButton,
  CtaShine,
  CTA_SHINE_CLASS,
  HeroDeckFrame,
  DeckAnchor,
} from "./LandingHero.style";
import {
  SPREAD_DECK_VISIBLE_COUNT,
  LANDING_MAJOR_ARCANA_FACE_PATHS,
} from "@/types/tarot";

const SPREAD_MS = 500;
const TEXT_REVEAL_MS = 2000;

/**
 * 랜딩 히어로 — 워프 캔버스 배경, 카드 덱, 중앙 카피·CTA
 * (고정 헤더는 `ConditionalHeader`에서 렌더)
 */
export default function LandingHero() {
  const [isSpread, setIsSpread] = useState(false);
  const [showText, setShowText] = useState(false);
  const deckFrameRef = useRef<HTMLDivElement | null>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [cardWidthPx, setCardWidthPx] = useState(90);

  /**
   * 헤더 정렬 박스와 동일한 폭 — 이 너비에 맞게 스프레드 간격(px) 계산
   */
  useLayoutEffect(() => {
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
    return () => {
      ro.disconnect();
    };
  }, []);

  /** sm 브레이크포인트(와 일치)에 맞는 카드 실제 px 너비 */
  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const read = () => {
      setCardWidthPx(mq.matches ? 130 : 90);
    };
    read();
    mq.addEventListener("change", read);
    return () => {
      mq.removeEventListener("change", read);
    };
  }, []);

  const n = SPREAD_DECK_VISIBLE_COUNT;
  /** 프레임(헤더와 동일 폭) 꽉 채울 때 인접 카드 간 가로 px — `LAYOUT_CONTENT_MAX_WIDTH` 를 줄이면 겹침이 늘어남 */
  const spreadStepPx =
    contentWidth > 0 && n > 1
      ? Math.max(0, (contentWidth - cardWidthPx) / (n - 1))
      : 0;
  const stackStepPx = cardWidthPx * 0.025;

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
    <LandingRoot>
      <WarpSpeedBackground />

      <HeroMain>
        <HeroCopy $visible={showText}>
          <HeroTitle>
            타로와 현대 AI 기술이 만나 탄생한
            <br />
            <Highlight>신비로운</Highlight> 타로 서비스
          </HeroTitle>

          <CtaButton href="/tarot/setup">
            <CtaShine className={CTA_SHINE_CLASS} />
            무료 타로 시작하기
          </CtaButton>
        </HeroCopy>

        <HeroDeckFrame ref={deckFrameRef}>
          <DeckAnchor $placement="top" aria-hidden>
            {Array.from({ length: SPREAD_DECK_VISIBLE_COUNT }, (_, i) => (
              <SpreadTarotCard
                key={`top-${i}`}
                isSpread={isSpread}
                index={i}
                isTop
                spreadStepPx={spreadStepPx}
                stackStepPx={stackStepPx}
                imageSrc={LANDING_MAJOR_ARCANA_FACE_PATHS[i]}
              />
            ))}
          </DeckAnchor>

          <DeckAnchor $placement="bottom" aria-hidden>
            {Array.from({ length: SPREAD_DECK_VISIBLE_COUNT }, (_, i) => (
              <SpreadTarotCard
                key={`bottom-${i}`}
                isSpread={isSpread}
                index={i}
                isTop={false}
                spreadStepPx={spreadStepPx}
                stackStepPx={stackStepPx}
              />
            ))}
          </DeckAnchor>
        </HeroDeckFrame>
      </HeroMain>
    </LandingRoot>
  );
}
