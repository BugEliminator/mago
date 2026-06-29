"use client";

import { History } from "lucide-react";
import SurfaceModal from "@/components/common/modal/SurfaceModal";

type TarotDraftResumeModalProps = {
  onResume: () => void;
  onStartFresh: () => void;
  onDismiss: () => void;
};

/** 메인 등에서 이어쓰기 / 새로 작성 선택 */
export default function TarotDraftResumeModal({
  onResume,
  onStartFresh,
  onDismiss,
}: TarotDraftResumeModalProps) {
  return (
    <SurfaceModal
      titleId="tarot-draft-resume-title"
      title="작성 중인 고민이 있습니다."
      description={
        <>
          이전 단계에서 멈춘 기록을 불러올까요?
          <br />
          새로 시작하면 이전 내용은 사라집니다.
        </>
      }
      icon={<History size={28} strokeWidth={2} />}
      primaryLabel="이어 작성하기"
      secondaryLabel="새로 작성하기"
      onPrimary={onResume}
      onSecondary={onStartFresh}
      onBackdropPress={onDismiss}
    />
  );
}
