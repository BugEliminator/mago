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
  EncyclopediaCardPin,
} from "@/types/encyclopedia";
import CardTilt from "../CardTilt";
import {
  CardDetailFigureRoot,
  CardDetailPin,
  CardDetailPinLayer,
} from "./CardDetailOverlay.style";

type CardDetailFigureProps = {
  card: EncyclopediaCard;
  pins: readonly EncyclopediaCardPin[];
};

/** 상세 오버레이 왼쪽 — 고른 카드 앞면 + 키워드 점 */
export default function CardDetailFigure({
  card,
  pins,
}: CardDetailFigureProps) {
  const [lifted, setLifted] = useState(false);

  return (
    <CardDetailFigureRoot>
      <CardTilt lifted={lifted} glow={false} onLiftChange={setLifted}>
        <TarotCardFaceFrame className={CARD_FACE_FRAME_CLASS}>
          <TarotCardFaceImageFill>
            <Image
              src={card.src}
              alt={card.name}
              fill
              sizes="(max-width: 640px) 72vw, 264px"
              style={{ objectFit: "cover" }}
            />
            {pins.length > 0 ? (
              <CardDetailPinLayer>
                {pins.map((pin, index) => (
                  <CardDetailPin key={pin.id} $x={pin.x} $y={pin.y}>
                    {index + 1}
                  </CardDetailPin>
                ))}
              </CardDetailPinLayer>
            ) : null}
          </TarotCardFaceImageFill>
        </TarotCardFaceFrame>
      </CardTilt>
    </CardDetailFigureRoot>
  );
}
