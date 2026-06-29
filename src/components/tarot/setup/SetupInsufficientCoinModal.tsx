"use client";

import { AlertCircle, CircleDollarSign } from "lucide-react";
import SurfaceModal from "@/components/common/modal/SurfaceModal";
import {
  NoticeBox,
  NoticeDescription,
  NoticeIcon,
  NoticeTextWrap,
  NoticeTitle,
} from "@/components/common/modal/SurfaceModal.style";

type SetupInsufficientCoinModalProps = {
  requiredCoin: number;
  /** 딤(바깥) 클릭 — 모달만 닫기 */
  onClose: () => void;
  onGoHome: () => void;
  onGoCoins: () => void;
};

/** 복채 확인 후 잔액 부족 시 — 메인/충전소 이동 안내 */
export default function SetupInsufficientCoinModal({
  requiredCoin,
  onClose,
  onGoHome,
  onGoCoins,
}: SetupInsufficientCoinModalProps) {
  return (
    <SurfaceModal
      titleId="setup-insufficient-coin-title"
      title="엽전이 부족합니다"
      description={
        <>
          리딩을 시작하려면 엽전이 더 필요합니다.
          <br />
          충전소에서 보상을 받거나 엽전을 충전해 주세요.
        </>
      }
      icon={<CircleDollarSign size={28} strokeWidth={2} />}
      primaryLabel="충전하기"
      secondaryLabel="다음에 오기"
      onPrimary={onGoCoins}
      onSecondary={onGoHome}
      onBackdropPress={onClose}
    >
      <NoticeBox>
        <NoticeIcon aria-hidden>
          <AlertCircle size={18} strokeWidth={2} />
        </NoticeIcon>
        <NoticeTextWrap>
          <NoticeTitle>
            <>
              이번 리딩에는 엽전 <strong>{requiredCoin}냥</strong>이 필요합니다.
            </>
          </NoticeTitle>
          <NoticeDescription>
            <>
              보유 엽전이 부족해 복채를 올릴 수 없습니다.
              <br />
              충전소에서 출석 보상을 받아 보세요.
            </>
          </NoticeDescription>
        </NoticeTextWrap>
      </NoticeBox>
    </SurfaceModal>
  );
}
