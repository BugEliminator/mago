"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TarotCardFaceFrame } from "@/components/common/card/TarotCardFaceShell.style";
import TarotCardBackShell from "@/components/tarot/TarotCardBackShell";
import {
  FlipFaceBack,
  FlipFaceFront,
  FlipFaceImageInner,
  FlipInner,
  FlipOuterWrap,
  FlipScene,
} from "./ResultCardFlipFace.style";

/** 첫 장 시작 지연 후 슬롯마다 이 간격만큼 순차 뒤집기 */
const FLIP_STAGGER_MS = 200;
const FLIP_INITIAL_DELAY_MS = 500;

export type ResultCardFlipFaceProps = {
  /** 0부터 — 순차 플립 지연 계산용 */
  slotIndex: number;
  /** Supabase Storage 앞면 URL — null이면 플립·앞면 렌더 안 함 */
  faceSrc: string | null;
  isReversed: boolean;
  /** true일 때만 플립 애니메이션 시작 (Storage URL 확보 후) */
  canFlip: boolean;
  sizes: string;
  backAlt: string;
  faceAlt: string;
  /** 한눈에 보기처럼 셀 너비를 채울 때 true */
  fluid?: boolean;
  /** 비-fluid일 때 카드 박스 최대 가로 */
  frameMaxWidth?: string;
  /** 호버 링 등 외부 타깃용 클래스(한눈에 보기) */
  frameClassName?: string;
};

/**
 * 결과 페이지 공통 카드 플립 — 뒷면(back.png) 노출 후 조회 완료 시 Y축 플립
 */
export default function ResultCardFlipFace({
  slotIndex,
  faceSrc,
  isReversed,
  canFlip,
  sizes,
  backAlt,
  faceAlt,
  fluid = false,
  frameMaxWidth,
  frameClassName,
}: ResultCardFlipFaceProps) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!canFlip) {
      setFlipped(false);
      return;
    }
    const delay = FLIP_INITIAL_DELAY_MS + slotIndex * FLIP_STAGGER_MS;
    const id = window.setTimeout(() => {
      setFlipped(true);
    }, delay);
    return () => window.clearTimeout(id);
  }, [slotIndex, canFlip]);

  return (
    <FlipOuterWrap $fluid={fluid} $frameMaxWidth={frameMaxWidth}>
      <FlipScene>
        <FlipInner $flipped={flipped}>
          <FlipFaceBack>
            <TarotCardBackShell
              fluid={fluid}
              className={frameClassName}
              alt={backAlt}
              sizes={sizes}
              frameMaxWidth={frameMaxWidth}
            />
          </FlipFaceBack>
          {canFlip && faceSrc != null ? (
            <FlipFaceFront aria-hidden={!flipped}>
              <TarotCardFaceFrame>
                <FlipFaceImageInner $isReversed={isReversed}>
                  <Image
                    src={faceSrc}
                    alt={faceAlt}
                    fill
                    sizes={sizes}
                    draggable={false}
                  />
                </FlipFaceImageInner>
              </TarotCardFaceFrame>
            </FlipFaceFront>
          ) : null}
        </FlipInner>
      </FlipScene>
    </FlipOuterWrap>
  );
}
