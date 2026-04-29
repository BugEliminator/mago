"use client";

import {
  CardRoot,
  CardImageFill,
  CardBackImage,
} from "./SpreadTarotCard.style";
import { TAROT_CLASSIC_BACK_IMAGE_PATH } from "@/types/tarot";

export interface SpreadTarotCardProps {
  /** true면 가로로 펼침 */
  isSpread: boolean;
  /** 덱 내 순서 (0…N-1) */
  index: number;
  /** upper deck(오른쪽 피벗) vs lower deck(왼쪽 피벗) — 이동 방향·z-index */
  isTop: boolean;
  /** 스프레드 시 index 한 칸당 가로 px */
  spreadStepPx: number;
  /** 겹쳤을 때 index 한 칸당 가로 px */
  stackStepPx: number;
  /** 없으면 뒷면 — 있으면 이 경로(public)로 카드 면 노출 */
  imageSrc?: string;
}

/**
 * 카드 면 이미지 + 겹침/스프레드 애니 — `imageSrc` 미지정 시 클래식 뒷면
 */
export default function SpreadTarotCard({
  isSpread,
  index,
  isTop,
  spreadStepPx,
  stackStepPx,
  imageSrc,
}: SpreadTarotCardProps) {
  const src = imageSrc ?? TAROT_CLASSIC_BACK_IMAGE_PATH;

  return (
    <CardRoot
      $isSpread={isSpread}
      $index={index}
      $isTop={isTop}
      $spreadStepPx={spreadStepPx}
      $stackStepPx={stackStepPx}
      role="presentation"
    >
      <CardImageFill>
        <CardBackImage
          src={src}
          alt=""
          fill
          sizes="(max-width: 639px) 90px, 130px"
          priority={isTop && index < 2}
        />
      </CardImageFill>
    </CardRoot>
  );
}
