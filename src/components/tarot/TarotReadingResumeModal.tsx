"use client";

import { Layers } from "lucide-react";
import SurfaceModal from "@/components/common/modal/SurfaceModal";

type TarotReadingResumeModalProps = {
  onResume: () => void;
  onStartFresh: () => void;
  onDismiss: () => void;
};

/** 결제 완료 후 카드 선택을 이어갈지 선택 */
export default function TarotReadingResumeModal({
  onResume,
  onStartFresh,
  onDismiss,
}: TarotReadingResumeModalProps) {
  return (
    <SurfaceModal
      titleId="tarot-reading-resume-title"
      title="진행 중인 리딩이 있습니다."
      description={
        <>
          결제가 완료된 설정으로 카드 선택을 이어갈까요?
          <br />
          새로 시작하면 이전 설정은 사라지고 엽전이 다시 사용됩니다.
        </>
      }
      icon={<Layers size={28} strokeWidth={2} />}
      primaryLabel="리딩 이어하기"
      secondaryLabel="새로 시작하기"
      onPrimary={onResume}
      onSecondary={onStartFresh}
      onBackdropPress={onDismiss}
    />
  );
}
