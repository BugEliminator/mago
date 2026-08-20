"use client";

import { BookOpen, Share2 } from "lucide-react";
import { toast } from "sonner";
import { getIntentCategoryOption } from "@/components/tarot/setup/setupIntentCatalog";
import type { TarotResultSelectionSummaryProps } from "@/types/tarotResult";
import ResultFlowGauge from "./ResultFlowGauge";
import {
  BlockLabel,
  BlockStack,
  CategoryValueWrap,
  FieldLabel,
  FieldValue,
  HeadingRow,
  IntentTag,
  Panel,
  PanelHeading,
  QuestionBox,
  InfoRow,
  ScrollBody,
  ShareButton,
  SituationBox,
  SummaryGaugeColumn,
  SummaryInfoStack,
  SummaryMetaRow,
} from "./ResultSelectionSummary.style";

const SHARE_BUTTON_ICON_SIZE = 14;

/**
 * 결과 상단 — 사용자가 설정·입력한 운세 요약(내가 선택한 운세)
 */
export default function ResultSelectionSummary({
  drawnCardsLabel,
  categoryId,
  categoryLabel,
  intentTagLabel,
  situation,
  question,
  flowScore,
}: TarotResultSelectionSummaryProps) {
  /** setup 스텝 3 CapsuleTag와 동일 lookup */
  const categoryAccentColor =
    getIntentCategoryOption(categoryId)?.accentColor ?? "#d4af37";

  /** 현재 결과 URL을 클립보드에 복사합니다. */
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("링크가 복사되었습니다.");
    } catch {
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  return (
    <Panel aria-labelledby="tarot-result-selection-heading">
      <HeadingRow>
        <PanelHeading id="tarot-result-selection-heading">
          <BookOpen size={16} aria-hidden />
          내가 선택한 운세
        </PanelHeading>
        <ShareButton type="button" onClick={() => void handleShare()}>
          <Share2 size={SHARE_BUTTON_ICON_SIZE} aria-hidden />
          공유하기
        </ShareButton>
      </HeadingRow>

      <SummaryMetaRow>
        <SummaryInfoStack>
          <InfoRow>
            <FieldLabel>뽑은 카드</FieldLabel>
            <FieldValue>{drawnCardsLabel}</FieldValue>
          </InfoRow>
          <InfoRow>
            <FieldLabel>카테고리</FieldLabel>
            <CategoryValueWrap>
              <FieldValue>{categoryLabel}</FieldValue>
              <IntentTag $accentColor={categoryAccentColor}>
                # {intentTagLabel}
              </IntentTag>
            </CategoryValueWrap>
          </InfoRow>
        </SummaryInfoStack>
        <SummaryGaugeColumn>
          <ResultFlowGauge score={flowScore} />
        </SummaryGaugeColumn>
      </SummaryMetaRow>

      <ScrollBody>
        <BlockStack>
          <BlockLabel>현재 상황</BlockLabel>
          <SituationBox>{situation}</SituationBox>
        </BlockStack>

        <BlockStack>
          <BlockLabel>질문 내용</BlockLabel>
          <QuestionBox>{question}</QuestionBox>
        </BlockStack>
      </ScrollBody>
    </Panel>
  );
}
