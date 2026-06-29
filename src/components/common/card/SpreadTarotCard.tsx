"use client";

import {
  CardRoot,
  CardFaceFrame,
  CardImageFill,
  CardBackImage,
  CardFaceImage,
  CARD_FACE_FRAME_CLASS,
} from "./SpreadTarotCard.style";
import {
  SPREAD_DECK_VISIBLE_COUNT,
  TAROT_CLASSIC_BACK_IMAGE_PATH,
} from "@/types/tarot";

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
  /** 현재 덱 총 카드 수 — 스태거 타이밍 계산에 사용 */
  deckCount?: number;
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
  deckCount = SPREAD_DECK_VISIBLE_COUNT,
  imageSrc,
}: SpreadTarotCardProps) {
  const isFace = imageSrc != null;
  const src = imageSrc ?? TAROT_CLASSIC_BACK_IMAGE_PATH;

  return (
    <CardRoot
      $isFace={isFace}
      $isSpread={isSpread}
      $index={index}
      $isTop={isTop}
      $spreadStepPx={spreadStepPx}
      $stackStepPx={stackStepPx}
      $deckCount={deckCount}
      role="presentation"
    >
      {isFace ? (
        <CardFaceFrame className={CARD_FACE_FRAME_CLASS}>
          <CardImageFill>
            <CardFaceImage
              src={src}
              alt=""
              fill
              sizes="(min-width: 641px) 156px, 130px"
              priority={index === deckCount - 1}
            />
          </CardImageFill>
        </CardFaceFrame>
      ) : (
        <CardImageFill>
          <CardBackImage
            src={src}
            alt=""
            fill
            sizes="(min-width: 641px) 156px, 130px"
            priority={index === deckCount - 1}
          />
        </CardImageFill>
      )}
    </CardRoot>
  );
}
