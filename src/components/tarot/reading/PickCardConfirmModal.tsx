"use client";

import { AlertCircle, Sparkles } from "lucide-react";
import type { TarotCategory } from "@/types/tarot";
import SurfaceModal from "@/components/common/modal/SurfaceModal";
import {
  ModalTitlePhrase,
  NoticeBox,
  NoticeDescription,
  NoticeIcon,
  NoticeTextWrap,
  NoticeTitle,
} from "@/components/common/modal/SurfaceModal.style";
import { getIntentCategoryOption } from "@/components/tarot/setup/setupIntentCatalog";
import { tarotPickSlotLabelKr } from "@/lib/tarotPickSlotLabel";

type PickCardConfirmModalProps = {
  slotIndex: number;
  /** `tarotMasterConfig` 해당 슬롯의 해석 힌트(없으면 설명만 짧게) */
  positionDesc: string | null;
  category: TarotCategory | null;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * 스프레드에서 카드 탭 후 — 해당 순번으로 확정할지 확인하는 모달
 */
export default function PickCardConfirmModal({
  slotIndex,
  positionDesc,
  category,
  onCancel,
  onConfirm,
}: PickCardConfirmModalProps) {
  const label = tarotPickSlotLabelKr(slotIndex);
  const categoryOpt =
    category != null ? getIntentCategoryOption(category) : undefined;
  const CategoryIcon = categoryOpt?.icon ?? Sparkles;
  const iconAccentColor = categoryOpt?.accentColor;

  const trimmedDesc = positionDesc?.trim() ?? "";
  const descriptionText =
    trimmedDesc.length > 0 ? (
      <>
        이 카드는 {trimmedDesc}에 대한 정보가 담긴{" "}
        <ModalTitlePhrase>카드입니다.</ModalTitlePhrase>
      </>
    ) : (
      <>
        당신의 진심이 담긴 카드를{" "}
        <ModalTitlePhrase>고르셨습니다.</ModalTitlePhrase>
      </>
    );

  return (
    <SurfaceModal
      titleId="pick-card-confirm-title"
      title={
        <>
          {label} 카드로{" "}
          <ModalTitlePhrase>선택하시겠습니까?</ModalTitlePhrase>
        </>
      }
      description={descriptionText}
      icon={<CategoryIcon size={28} strokeWidth={2} aria-hidden />}
      iconAccentColor={iconAccentColor}
      primaryLabel="이 카드로 결정"
      secondaryLabel="다시 신중하게 고르기"
      onPrimary={onConfirm}
      onSecondary={onCancel}
      onBackdropPress={onCancel}
    >
      <NoticeBox>
        <NoticeIcon aria-hidden>
          <AlertCircle size={18} strokeWidth={2} />
        </NoticeIcon>
        <NoticeTextWrap>
          <NoticeTitle>
            한 번 정해진 운명의 흐름은{" "}
            <ModalTitlePhrase>되돌릴 수 없습니다.</ModalTitlePhrase>
          </NoticeTitle>
          <NoticeDescription>
            확인하시면 카드가 스프레드 위치에 고정 표시되며 이후에는{" "}
            <ModalTitlePhrase>취소할 수 없습니다.</ModalTitlePhrase>
          </NoticeDescription>
        </NoticeTextWrap>
      </NoticeBox>
    </SurfaceModal>
  );
}
