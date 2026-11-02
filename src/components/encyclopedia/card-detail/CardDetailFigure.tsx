"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CARD_FACE_FRAME_CLASS,
  TarotCardFaceFrame,
  TarotCardFaceImageFill,
} from "@/components/common/card/TarotCardFaceShell.style";
import type {
  EncyclopediaCard,
  EncyclopediaCardSpot,
} from "@/types/encyclopedia";
import CardTilt from "../CardTilt";
import {
  CardDetailFigureRoot,
  CardDetailPin,
  CardDetailPinLayer,
} from "./CardDetailOverlay.style";

type CardDetailFigureProps = {
  card: EncyclopediaCard;
  spots: readonly EncyclopediaCardSpot[];
  activeSpotOrder: number | null;
  onSpotSelect: (spotOrder: number) => void;
};

/** 상세 오버레이 왼쪽 — 고른 카드 앞면 + 키워드 점 */
export default function CardDetailFigure({
  card,
  spots,
  activeSpotOrder,
  onSpotSelect,
}: CardDetailFigureProps) {
  const [lifted, setLifted] = useState(false);

  return (
    <CardDetailFigureRoot>
      <CardTilt lifted={lifted} glow={false} onLiftChange={setLifted}>
        <TarotCardFaceFrame className={CARD_FACE_FRAME_CLASS}>
          <TarotCardFaceImageFill>
            <Image
              src={card.src}
              alt={`${card.name} (${card.englishName}) 타로 카드`}
              fill
              sizes="(max-width: 640px) 72vw, 264px"
              style={{ objectFit: "cover" }}
            />
            {spots.length > 0 ? (
              <CardDetailPinLayer>
                {spots.flatMap((spot) =>
                  spot.positions.map((position, positionIndex) => (
                    <CardDetailPin
                      key={`${spot.spotOrder}-${positionIndex}`}
                      type="button"
                      aria-label={`Point ${spot.spotOrder}: ${spot.title}`}
                      aria-current={
                        activeSpotOrder === spot.spotOrder ? "true" : undefined
                      }
                      $x={position.x}
                      $y={position.y}
                      $active={activeSpotOrder === spot.spotOrder}
                      onClick={() => {
                        onSpotSelect(spot.spotOrder);
                      }}
                    >
                      {spot.spotOrder}
                    </CardDetailPin>
                  )),
                )}
              </CardDetailPinLayer>
            ) : null}
          </TarotCardFaceImageFill>
        </TarotCardFaceFrame>
      </CardTilt>
    </CardDetailFigureRoot>
  );
}
