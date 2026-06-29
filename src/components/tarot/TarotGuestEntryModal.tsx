"use client";

import { Eye } from "lucide-react";
import SurfaceModal from "@/components/common/modal/SurfaceModal";

type TarotGuestEntryModalProps = {
  onBrowse: () => void;
  onLogin: () => void;
  onDismiss: () => void;
};

/** 비로그인 타로 진입 — 둘러보기 / 로그인 선택 */
export default function TarotGuestEntryModal({
  onBrowse,
  onLogin,
  onDismiss,
}: TarotGuestEntryModalProps) {
  return (
    <SurfaceModal
      titleId="tarot-guest-entry-title"
      title="타로 리딩을 시작하시겠어요?"
      description={
        <>
          타로 카드를 직접 뽑고 해석을 확인하려면 마고(MAGO) 로그인이 필요해요.
          <br />
          로그인 없이 구성을 먼저 둘러볼 수도 있습니다.
        </>
      }
      icon={<Eye size={28} strokeWidth={2} />}
      primaryLabel="로그인 하기"
      secondaryLabel="둘러보기"
      onPrimary={onLogin}
      onSecondary={onBrowse}
      onBackdropPress={onDismiss}
    />
  );
}
