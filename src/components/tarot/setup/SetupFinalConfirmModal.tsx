"use client";

import { AlertCircle, Coins } from "lucide-react";
import SurfaceModal from "@/components/common/modal/SurfaceModal";
import {
  CoinAmount,
  NoticeBox,
  NoticeDescription,
  NoticeIcon,
  NoticeTextWrap,
  NoticeTitle,
} from "@/components/common/modal/SurfaceModal.style";
import { getTarotCoinCost } from "@/lib/tarotCoinCost";
import type { CardSpread } from "@/types/tarot";

type SetupFinalConfirmModalProps = {
  /** 카드 장수 — 내부에서 10배 환산해 냥 표시 */
  cardCount: CardSpread;
  disabled: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/** Step 3 최종 확인 — 리딩 시작 전 수정 불가 안내 모달 */
export default function SetupFinalConfirmModal({
  cardCount,
  disabled,
  onCancel,
  onConfirm,
}: SetupFinalConfirmModalProps) {
  const coinCount = getTarotCoinCost(cardCount);
  return (
    <SurfaceModal
      titleId="setup-final-confirm-title"
      title="복채를 올리시겠습니까?"
      description={
        <>
          운명을 확인하기 위해
          <br />
          정성을 담아 복채를 올립니다.
        </>
      }
      icon={<Coins size={28} strokeWidth={2} />}
      primaryLabel="확인하기"
      secondaryLabel="수정하기"
      onPrimary={onConfirm}
      onSecondary={onCancel}
      disabled={disabled}
      onBackdropPress={onCancel}
    >
      <NoticeBox>
        <NoticeIcon aria-hidden>
          <AlertCircle size={18} strokeWidth={2} />
        </NoticeIcon>
        <NoticeTextWrap>
          <NoticeTitle>
            확인하기 버튼을 누르면{" "}
            <CoinAmount>엽전 {coinCount}냥</CoinAmount>이 소모됩니다.
          </NoticeTitle>
          <NoticeDescription>
            리딩이 시작된 후에는 내용을 수정하거나 취소할 수 없습니다.
          </NoticeDescription>
        </NoticeTextWrap>
      </NoticeBox>
    </SurfaceModal>
  );
}
