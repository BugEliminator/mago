"use client";

import {
  OverviewThumbScaleWrap,
  RESULT_CARD_OVERVIEW_THUMB_FRAME_CLASS,
} from "./ResultCardOverview.style";
import ResultCardFlipFace from "./ResultCardFlipFace";

type ResultOverviewFlipThumbProps = {
  slotIndex: number;
  /** Supabase Storage 앞면 URL — null이면 플립·앞면 렌더 안 함 */
  faceSrc: string | null;
  isReversed: boolean;
  /** true일 때만 플립 애니메이션 시작 (Storage URL 확보 후) */
  canFlip: boolean;
  sizes: string;
  backAlt: string;
};

/**
 * 결과 한눈에 보기 썸네일 — 뒷면(back.png) 노출 후 조회 완료 시 순차 Y축 플립
 */
export default function ResultOverviewFlipThumb({
  slotIndex,
  faceSrc,
  isReversed,
  canFlip,
  sizes,
  backAlt,
}: ResultOverviewFlipThumbProps) {
  return (
    <OverviewThumbScaleWrap>
      <ResultCardFlipFace
        slotIndex={slotIndex}
        faceSrc={faceSrc}
        isReversed={isReversed}
        canFlip={canFlip}
        sizes={sizes}
        backAlt={backAlt}
        faceAlt={`뽑은 카드 ${slotIndex + 1} 앞면`}
        fluid
        frameClassName={RESULT_CARD_OVERVIEW_THUMB_FRAME_CLASS}
      />
    </OverviewThumbScaleWrap>
  );
}
