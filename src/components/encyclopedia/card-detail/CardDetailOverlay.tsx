"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { findEncyclopediaCardDetail } from "@/lib/encyclopedia/cardDetailCatalog";
import type {
  EncyclopediaCard,
  EncyclopediaCardMeaning,
  EncyclopediaCardPin,
} from "@/types/encyclopedia";
import CardDetailCopy from "./CardDetailCopy";
import CardDetailFigure from "./CardDetailFigure";
import {
  CardDetailBackdrop,
  CardDetailChrome,
  CardDetailClose,
  CardDetailCluster,
  CardDetailFigureNavSlot,
  CardDetailFigureRow,
  CardDetailIcon,
  CardDetailLayer,
  CardDetailNav,
  CardDetailRightRail,
  CardDetailSlide,
  CardDetailStage,
  CardDetailViewport,
} from "./CardDetailOverlay.style";

const SLIDE_EASE = [0.4, 0, 0.2, 1] as const;
const SLIDE_DURATION = 0.4;
/** 하스스톤처럼 짧게만 민다. 화면 전체(100%)가 아니라 약 1/4 */
const SLIDE_OFFSET = "25%";
const ICON_STROKE = 1.75;

const slideTransition = { duration: SLIDE_DURATION, ease: SLIDE_EASE };

type CardPack = {
  card: EncyclopediaCard;
  meaning: EncyclopediaCardMeaning | null;
};

type LeavingPack = CardPack & {
  direction: number;
};

type SlideViewProps = {
  card: EncyclopediaCard;
  meaning: EncyclopediaCardMeaning | null;
  pins: readonly EncyclopediaCardPin[];
  x: string | number;
  opacity: number;
  zIndex: number;
  enterFrom?: string | null;
  onLeaveComplete?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  showFigureNav?: boolean;
};

function enterX(direction: number): string {
  return direction > 0 ? SLIDE_OFFSET : `-${SLIDE_OFFSET}`;
}

function leaveX(direction: number): string {
  return direction > 0 ? `-${SLIDE_OFFSET}` : SLIDE_OFFSET;
}

/** 이전·다음 셰브론 */
function NavArrow({ side }: { side: "prev" | "next" }) {
  const Icon = side === "prev" ? ChevronLeft : ChevronRight;
  return (
    <CardDetailIcon>
      <Icon strokeWidth={ICON_STROKE} aria-hidden />
    </CardDetailIcon>
  );
}

/** 한 장의 카드+해설 — Presence 없이 animate로만 이동·페이드 */
function SlideView({
  card,
  meaning,
  pins,
  x,
  opacity,
  zIndex,
  enterFrom = null,
  onLeaveComplete,
  onPrev,
  onNext,
  showFigureNav = false,
}: SlideViewProps) {
  return (
    <CardDetailSlide
      initial={
        enterFrom == null
          ? false
          : { x: enterFrom, opacity: 0 }
      }
      animate={{ x, opacity }}
      transition={slideTransition}
      style={{
        zIndex,
        pointerEvents: onLeaveComplete != null ? "none" : "auto",
      }}
      onAnimationComplete={() => {
        onLeaveComplete?.();
      }}
    >
      <CardDetailCluster>
        <CardDetailFigureRow>
          {showFigureNav && onPrev != null ? (
            <CardDetailNav
              type="button"
              $side="prev"
              $placement="figure"
              aria-label="이전 카드"
              onClick={onPrev}
            >
              <NavArrow side="prev" />
            </CardDetailNav>
          ) : (
            <CardDetailFigureNavSlot />
          )}
          <CardDetailFigure card={card} pins={pins} />
          {showFigureNav && onNext != null ? (
            <CardDetailNav
              type="button"
              $side="next"
              $placement="figure"
              aria-label="다음 카드"
              onClick={onNext}
            >
              <NavArrow side="next" />
            </CardDetailNav>
          ) : (
            <CardDetailFigureNavSlot />
          )}
        </CardDetailFigureRow>
        <CardDetailCopy card={card} meaning={meaning} pins={pins} />
      </CardDetailCluster>
    </CardDetailSlide>
  );
}

type CardDetailOverlayProps = {
  card: EncyclopediaCard;
  meaning: EncyclopediaCardMeaning | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

/**
 * 목록 위에 올리는 카드 상세 껍데기 — 페이지 이동 없이 열고 닫는다.
 * React 19에서 AnimatePresence exit가 자주 생략되어, 나가는 카드는 state로 남겨 직접 페이드한다.
 */
export default function CardDetailOverlay({
  card,
  meaning,
  onClose,
  onPrev,
  onNext,
}: CardDetailOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [direction, setDirection] = useState(1);
  const [pack, setPack] = useState<CardPack>({ card, meaning });
  const [leaving, setLeaving] = useState<LeavingPack | null>(null);

  if (card.id !== pack.card.id) {
    setLeaving({ ...pack, direction });
    setPack({ card, meaning });
  } else if (pack.meaning !== meaning) {
    setPack({ card, meaning });
  }

  const shownPins = findEncyclopediaCardDetail(pack.card.id)?.pins ?? [];
  const leavingPins =
    leaving == null
      ? []
      : (findEncyclopediaCardDetail(leaving.card.id)?.pins ?? []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    onPrev?.();
  }, [onPrev]);

  const handleNext = useCallback(() => {
    setDirection(1);
    onNext?.();
  }, [onNext]);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- body 포탈은 클라이언트 마운트 후에만 가능
    setMounted(true);
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        handlePrev();
        return;
      }
      if (event.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, handlePrev, handleNext]);

  if (!mounted) return null;

  return createPortal(
    <CardDetailLayer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      <CardDetailBackdrop
        type="button"
        aria-label="카드 상세 닫기"
        onClick={onClose}
      />
      <CardDetailStage
        role="dialog"
        aria-modal="true"
        aria-label={`${pack.card.name} 상세`}
      >
        <CardDetailChrome>
          {onPrev != null ? (
            <CardDetailNav
              type="button"
              $side="prev"
              $placement="cluster"
              aria-label="이전 카드"
              onClick={handlePrev}
            >
              <NavArrow side="prev" />
            </CardDetailNav>
          ) : null}
          <CardDetailViewport>
            {leaving != null ? (
              <SlideView
                key={leaving.card.id}
                card={leaving.card}
                meaning={leaving.meaning}
                pins={leavingPins}
                x={leaveX(leaving.direction)}
                opacity={0}
                zIndex={2}
                onLeaveComplete={() => {
                  setLeaving(null);
                }}
              />
            ) : null}
            <SlideView
              key={pack.card.id}
              card={pack.card}
              meaning={pack.meaning}
              pins={shownPins}
              x={0}
              opacity={1}
              zIndex={1}
              enterFrom={leaving == null ? null : enterX(leaving.direction)}
              onPrev={onPrev != null ? handlePrev : undefined}
              onNext={onNext != null ? handleNext : undefined}
              showFigureNav
            />
          </CardDetailViewport>
          <CardDetailRightRail>
            <CardDetailClose type="button" aria-label="닫기" onClick={onClose}>
              <CardDetailIcon>
                <X strokeWidth={ICON_STROKE} aria-hidden />
              </CardDetailIcon>
            </CardDetailClose>
            {onNext != null ? (
              <CardDetailNav
                type="button"
                $side="next"
                $placement="cluster"
                aria-label="다음 카드"
                onClick={handleNext}
              >
                <NavArrow side="next" />
              </CardDetailNav>
            ) : null}
          </CardDetailRightRail>
        </CardDetailChrome>
      </CardDetailStage>
    </CardDetailLayer>,
    document.body,
  );
}
