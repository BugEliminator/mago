"use client";

import { MessageSquare } from "lucide-react";
import { TAROT_CARD_BACK_SHELL_WIDTH_DETAIL } from "@/components/tarot/TarotCardBackShell.style";
import type { TarotResultCardDetailProps } from "@/types/tarotResult";
import ResultCardFlipFace from "./ResultCardFlipFace";
import {
  CardColumn,
  CardOrderFooter,
  CardTitle,
  InterpretBody,
  InterpretHeading,
  InterpretPanel,
  OrderRule,
  OrderText,
  PhaseBadge,
  PhaseLabel,
  PhaseRow,
  Row,
  SectionRoot,
  SummaryLine,
  TextPanel,
} from "./ResultCardDetail.style";

const DETAIL_CARD_SIZES = "(max-width: 768px) 70vw, 248px";

/**
 * 카드 1장 분량 — 뒷면 → Storage 앞면 플립 + 페이즈·요약·마고 해석
 */
export default function ResultCardDetail({
  orderIndex,
  phaseNumber,
  phaseLabel,
  cardName,
  summaryLine,
  magoInterpretation,
  thumbSlot,
}: TarotResultCardDetailProps) {
  /** 한눈에 보기 썸 캡션과 동일하게 `CARD n` (OrderText가 uppercase 적용) */
  const orderLabel = `Card ${orderIndex}`;
  const slotIndex = orderIndex - 1;
  const canFlip = thumbSlot?.resolved === true && thumbSlot.faceSrc != null;

  return (
    <SectionRoot
      id={`tarot-result-card-detail-${orderIndex}`}
      aria-labelledby={`tarot-result-card-detail-title-${orderIndex}`}
    >
      <Row>
        <CardColumn>
          <ResultCardFlipFace
            slotIndex={slotIndex}
            faceSrc={thumbSlot?.faceSrc ?? null}
            isReversed={thumbSlot?.isReversed ?? false}
            canFlip={canFlip}
            sizes={DETAIL_CARD_SIZES}
            backAlt={`${cardName} 자리 카드 뒷면`}
            faceAlt={`${cardName} 앞면`}
            frameMaxWidth={TAROT_CARD_BACK_SHELL_WIDTH_DETAIL}
          />
          <CardOrderFooter>
            <OrderRule aria-hidden />
            <OrderText>{orderLabel}</OrderText>
            <OrderRule aria-hidden />
          </CardOrderFooter>
        </CardColumn>

        <TextPanel>
          <PhaseRow>
            <PhaseBadge>PHASE {phaseNumber}</PhaseBadge>
            <PhaseLabel>{phaseLabel}:</PhaseLabel>
            <SummaryLine>{summaryLine}</SummaryLine>
          </PhaseRow>

          <CardTitle id={`tarot-result-card-detail-title-${orderIndex}`}>
            {cardName}
          </CardTitle>

          <InterpretPanel>
            <InterpretHeading>
              <MessageSquare size={18} aria-hidden />
              마고의 해석
            </InterpretHeading>
            <InterpretBody>{magoInterpretation}</InterpretBody>
          </InterpretPanel>
        </TextPanel>
      </Row>
    </SectionRoot>
  );
}
