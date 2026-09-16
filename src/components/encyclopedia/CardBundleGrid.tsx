"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import {
  CARD_FACE_FRAME_CLASS,
  TarotCardFaceFrame,
  TarotCardFaceImageFill,
} from "@/components/common/card/TarotCardFaceShell.style";
import { DESKTOP_MIN_PX } from "@/lib/layout/layout";
import {
  ENCYCLOPEDIA_BUNDLE_GRID_COLUMNS_DESKTOP,
  ENCYCLOPEDIA_BUNDLE_GRID_COLUMNS_MOBILE,
} from "@/lib/encyclopedia/cardBundleCatalog";
import type {
  EncyclopediaCard,
  EncyclopediaCardBundle,
  EncyclopediaCardId,
} from "@/types/encyclopedia";
import {
  CardBundleGridCardMotion,
  CardBundleGridHit,
  CardBundleGridRoot,
  CARD_BUNDLE_GRID_GAP_DESKTOP,
  CARD_BUNDLE_GRID_GAP_MOBILE,
} from "./CardBundleGrid.style";
import CardTilt from "./CardTilt";

const GRID_EASE = [0.6, -0.05, 0.01, 0.99] as [number, number, number, number];

type CardBundleGridProps = {
  bundle: EncyclopediaCardBundle;
  onSelectCard: (cardId: EncyclopediaCardId) => void;
  hoverSuspended?: boolean;
};

type CardBundleGridEntryProps = {
  card: EncyclopediaCard;
  col: number;
  row: number;
  gap: string;
  hoverSuspended: boolean;
  onSelect: () => void;
};

/** 한 장 — 펼침 애니 위에 데스크톱 틸트를 얹는다 */
function CardBundleGridEntry({
  card,
  col,
  row,
  gap,
  hoverSuspended,
  onSelect,
}: CardBundleGridEntryProps) {
  const [lifted, setLifted] = useState(false);

  return (
    <CardBundleGridCardMotion
      $lifted={lifted}
      initial={{
        x: slideFromX(col, gap),
        y: -56 - row * 32,
        opacity: 0,
      }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        duration: 0.62,
        ease: GRID_EASE,
        delay: row * 0.05,
      }}
    >
      <CardBundleGridHit
        type="button"
        aria-label={`${card.name} 상세 보기`}
        onClick={(event) => {
          event.currentTarget.blur();
          onSelect();
        }}
      >
        <CardTilt
          lifted={lifted}
          hoverSuspended={hoverSuspended}
          onLiftChange={setLifted}
        >
          <TarotCardFaceFrame className={CARD_FACE_FRAME_CLASS}>
            <TarotCardFaceImageFill>
              <Image
                src={card.src}
                alt={card.name}
                fill
                sizes="(max-width: 640px) 25vw, 140px"
                style={{ objectFit: "cover" }}
              />
            </TarotCardFaceImageFill>
          </TarotCardFaceFrame>
        </CardTilt>
      </CardBundleGridHit>
    </CardBundleGridCardMotion>
  );
}

/** 행의 첫 장에서 오른쪽으로 펼쳐질 시작 x */
function slideFromX(col: number, gap: string): string {
  if (col === 0) return "0px";
  return `calc(-${col} * (100% + ${gap}))`;
}

/**
 * 선택한 묶음 전체 카드 — 첫 열이 내려오고 나머지 열이 동시에 오른쪽으로 펼쳐진다.
 */
export default function CardBundleGrid({
  bundle,
  onSelectCard,
  hoverSuspended = false,
}: CardBundleGridProps) {
  const [columns, setColumns] = useState<number | null>(null);

  useLayoutEffect(() => {
    const media = window.matchMedia(`(min-width: ${DESKTOP_MIN_PX}px)`);
    const sync = () => {
      setColumns(
        media.matches
          ? ENCYCLOPEDIA_BUNDLE_GRID_COLUMNS_DESKTOP
          : ENCYCLOPEDIA_BUNDLE_GRID_COLUMNS_MOBILE,
      );
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <CardBundleGridRoot aria-label={`${bundle.label} 목록`}>
      {columns == null
        ? null
        : bundle.cards.map((card, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const gap =
              columns === ENCYCLOPEDIA_BUNDLE_GRID_COLUMNS_DESKTOP
                ? CARD_BUNDLE_GRID_GAP_DESKTOP
                : CARD_BUNDLE_GRID_GAP_MOBILE;

            return (
              <CardBundleGridEntry
                key={card.id}
                card={card}
                col={col}
                row={row}
                gap={gap}
                hoverSuspended={hoverSuspended}
                onSelect={() => onSelectCard(card.id)}
              />
            );
          })}
    </CardBundleGridRoot>
  );
}
