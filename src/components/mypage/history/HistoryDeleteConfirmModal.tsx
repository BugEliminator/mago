"use client";

import { Trash2 } from "lucide-react";
import SurfaceModal from "@/components/common/modal/SurfaceModal";

type HistoryDeleteConfirmModalProps = {
  onConfirm: () => void;
  onDismiss: () => void;
  disabled?: boolean;
};

const DELETE_ICON_SIZE = 28;
const DELETE_ICON_ACCENT = "#c62828";

/**
 * 히스토리 소프트 삭제 재확인
 */
export default function HistoryDeleteConfirmModal({
  onConfirm,
  onDismiss,
  disabled = false,
}: HistoryDeleteConfirmModalProps) {
  return (
    <SurfaceModal
      titleId="history-delete-confirm-title"
      title="이 운세 기록을 삭제할까요?"
      description="목록에서 사라지고, 공유 링크도 더 이상 열리지 않습니다."
      icon={<Trash2 size={DELETE_ICON_SIZE} strokeWidth={2} />}
      iconAccentColor={DELETE_ICON_ACCENT}
      primaryLabel="삭제하기"
      secondaryLabel="취소"
      onPrimary={onConfirm}
      onSecondary={onDismiss}
      onBackdropPress={onDismiss}
      disabled={disabled}
    />
  );
}
