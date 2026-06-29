"use client";

import { AlertCircle, LogOut } from "lucide-react";
import SurfaceModal from "@/components/common/modal/SurfaceModal";
import {
  NoticeBox,
  NoticeDescription,
  NoticeIcon,
  NoticeTextWrap,
  NoticeTitle,
} from "@/components/common/modal/SurfaceModal.style";

type SetupExitConfirmModalProps = {
  /** 게스트 둘러보기 — persist 없음 안내 */
  isGuestBrowse: boolean;
  disabled?: boolean;
  onStay: () => void;
  onGoHome: () => void;
};

/** X(나가기) — 메인 이동 전 확인 */
export default function SetupExitConfirmModal({
  isGuestBrowse,
  disabled = false,
  onStay,
  onGoHome,
}: SetupExitConfirmModalProps) {
  return (
    <SurfaceModal
      titleId="setup-exit-confirm-title"
      title="설정을 종료할까요?"
      description={
        <>
          메인으로 돌아가면
          <br />
          타로 설정을 중단합니다.
        </>
      }
      icon={<LogOut size={28} strokeWidth={2} />}
      primaryLabel="메인으로"
      secondaryLabel="계속 작성"
      onPrimary={onGoHome}
      onSecondary={onStay}
      disabled={disabled}
      onBackdropPress={onStay}
    >
      <NoticeBox>
        <NoticeIcon aria-hidden>
          <AlertCircle size={18} strokeWidth={2} />
        </NoticeIcon>
        <NoticeTextWrap>
          <NoticeTitle>
            {isGuestBrowse
              ? "게스트 둘러보기에서는 입력 내용이 저장되지 않습니다."
              : "지금까지 입력한 내용은 임시 저장됩니다."}
          </NoticeTitle>
          <NoticeDescription>
            {isGuestBrowse
              ? "로그인 후 타로를 시작하면 작성 중인 내용을 이어갈 수 있습니다."
              : "다시 타로를 시작할 때 이어서 작성할 수 있습니다."}
          </NoticeDescription>
        </NoticeTextWrap>
      </NoticeBox>
    </SurfaceModal>
  );
}
