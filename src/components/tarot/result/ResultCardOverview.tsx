"use client";

import { Layers, Lightbulb } from "lucide-react";
import TarotCardBackShell from "@/components/tarot/TarotCardBackShell";
import type { TarotResultCardOverviewProps } from "@/types/tarotResult";
import ResultOverviewFlipThumb from "./ResultOverviewFlipThumb";
import {
  InsightBox,
  InsightText,
  OverviewThumbScaleWrap,
  Panel,
  PanelHeading,
  RESULT_CARD_OVERVIEW_THUMB_FRAME_CLASS,
  ThumbFigure,
  ThumbGrid,
  ThumbLabel,
  ThumbLabelRule,
  ThumbLabelText,
  ThumbSlotButton,
} from "./ResultCardOverview.style";

const THUMB_SIZES = "(max-width: 768px) 28vw, 170px";

/** 한 슬롯 캡션 — 양쪽 라인으로 `-- CARD n --` 형태 */
function OverviewThumbCaption({ slotNumber }: { slotNumber: number }) {
  return (
    <ThumbLabel>
      <ThumbLabelRule aria-hidden />
      <ThumbLabelText>
        Card {slotNumber}
      </ThumbLabelText>
      <ThumbLabelRule aria-hidden />
    </ThumbLabel>
  );
}

function renderBackOnlyThumb(slotIndex: number) {
  return (
    <>
      <OverviewThumbScaleWrap>
        <TarotCardBackShell
          fluid
          className={RESULT_CARD_OVERVIEW_THUMB_FRAME_CLASS}
          alt={`뽑은 카드 ${slotIndex + 1} 뒷면`}
          sizes={THUMB_SIZES}
        />
      </OverviewThumbScaleWrap>
      <OverviewThumbCaption slotNumber={slotIndex + 1} />
    </>
  );
}

/**
 * 결과 상단 우측 — 뽑은 카드 슬롯 요약·한 줄 인사이트
 */
export default function ResultCardOverview({
  slotCount,
  insight,
  onSlotClick,
  thumbSlots,
}: TarotResultCardOverviewProps) {
  const slots = Array.from({ length: slotCount }, (_, i) => i);
  /** 5·7장 등 — 한 줄에 약 3장+α만 보이게 해 스크롤 유도 */
  const scrollThumbRow = slotCount > 3;
  const useThumbSlots =
    thumbSlots != null && thumbSlots.length >= slotCount;

  const renderThumb = (index: number) => {
    if (useThumbSlots && thumbSlots != null) {
      const slot = thumbSlots[index];
      const canFlip = slot.resolved && slot.faceSrc != null;
      return (
        <>
          <ResultOverviewFlipThumb
            slotIndex={index}
            faceSrc={slot.faceSrc}
            isReversed={slot.isReversed}
            canFlip={canFlip}
            sizes={THUMB_SIZES}
            backAlt={`뽑은 카드 ${index + 1} 뒷면`}
          />
          <OverviewThumbCaption slotNumber={index + 1} />
        </>
      );
    }
    return renderBackOnlyThumb(index);
  };

  return (
    <Panel aria-labelledby="tarot-result-overview-cards-heading">
      <div>
        <PanelHeading id="tarot-result-overview-cards-heading">
          <Layers size={16} aria-hidden />
          뽑은 카드 보기
        </PanelHeading>

        <ThumbGrid
          $scrollRow={scrollThumbRow}
          {...(scrollThumbRow
            ? {
                role: "region",
                "aria-label":
                  "뽑은 카드 목록. 가로로 스크롤하면 나머지 카드를 볼 수 있습니다.",
              }
            : {})}
        >
          {slots.map((index) =>
            onSlotClick ? (
              <ThumbSlotButton
                key={index}
                type="button"
                onClick={() => {
                  onSlotClick(index);
                }}
              >
                {renderThumb(index)}
              </ThumbSlotButton>
            ) : (
              <ThumbFigure key={index}>{renderThumb(index)}</ThumbFigure>
            ),
          )}
        </ThumbGrid>
      </div>
      <div>
        <PanelHeading id="tarot-result-overview-insight-heading">
          <Lightbulb size={16} aria-hidden />
          핵심 한줄 요약
        </PanelHeading>
        <InsightBox>
          <InsightText>{insight}</InsightText>
        </InsightBox>
      </div>
    </Panel>
  );
}
