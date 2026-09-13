"use client";

import Image from "next/image";
import {
  CARD_FACE_FRAME_CLASS,
  TarotCardFaceFrame,
  TarotCardFaceImageFill,
} from "@/components/common/card/TarotCardFaceShell.style";
import type { EncyclopediaCardBundle } from "@/types/encyclopedia";
import {
  CardBundleCardMotion,
  CardBundleLabel,
  CardBundleRoot,
  CardBundleStage,
} from "./CardBundle.style";

const FAN_TRANSITION = {
  duration: 0.45,
  ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
};

const CARD_SIZES = "(max-width: 640px) 48vw, 136px";

type CardBundleProps = {
  bundle: EncyclopediaCardBundle;
  expanded: boolean;
  selected: boolean;
  hoverCapable: boolean;
  onHoverChange: (open: boolean) => void;
  onSelect: () => void;
};

/** 접힘/펼침 시 카드 위치 — 가운데를 기준으로 부채꼴 */
function getFanPose(index: number, count: number, expanded: boolean) {
  const offset = index - (count - 1) / 2;
  const spreadX = count <= 2 ? 36 : 28;
  const spreadRotate = count <= 2 ? 10 : 11;

  if (!expanded) {
    return { x: offset * 5, rotate: offset * 1.5 };
  }

  return { x: offset * spreadX, rotate: offset * spreadRotate };
}

/**
 * 백과사전 카드 묶음 — 호버로 팬, 클릭으로 아래 목록을 연다.
 */
export default function CardBundle({
  bundle,
  expanded,
  selected,
  hoverCapable,
  onHoverChange,
  onSelect,
}: CardBundleProps) {
  const count = bundle.cardSrcs.length;

  return (
    <CardBundleRoot
      type="button"
      aria-expanded={expanded}
      aria-pressed={selected}
      aria-label={`${bundle.label} 보기`}
      onMouseEnter={() => {
        if (hoverCapable) onHoverChange(true);
      }}
      onMouseLeave={() => {
        if (hoverCapable && !selected) onHoverChange(false);
      }}
      onClick={onSelect}
    >
      <CardBundleLabel>{bundle.label}</CardBundleLabel>
      <CardBundleStage $expanded={expanded}>
        {bundle.cardSrcs.map((src, index) => {
          const pose = getFanPose(index, count, expanded);
          return (
            <CardBundleCardMotion
              key={src}
              style={{ zIndex: index + 1, originX: 0.5, originY: 1 }}
              initial={false}
              animate={{ x: pose.x, rotate: pose.rotate }}
              transition={FAN_TRANSITION}
            >
              <TarotCardFaceFrame className={CARD_FACE_FRAME_CLASS}>
                <TarotCardFaceImageFill>
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes={CARD_SIZES}
                    style={{ objectFit: "cover" }}
                  />
                </TarotCardFaceImageFill>
              </TarotCardFaceFrame>
            </CardBundleCardMotion>
          );
        })}
      </CardBundleStage>
    </CardBundleRoot>
  );
}
