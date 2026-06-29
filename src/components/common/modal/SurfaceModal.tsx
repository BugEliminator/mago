"use client";

import type { ReactNode } from "react";
import {
  ActionColumn,
  ModalBackdrop,
  ModalBody,
  ModalDescription,
  ModalLayer,
  ModalPanel,
  ModalTitle,
  ModalTop,
  PrimaryButton,
  SecondaryButton,
  IconCircle,
} from "./SurfaceModal.style";

export type SurfaceModalProps = {
  /** 접근성 — 제목(id)과 aria-labelledby 연결 */
  titleId: string;
  title: ReactNode;
  description: ReactNode;
  icon: ReactNode;
  /** 상단 원형 테두리·아이콘 색(미지정 시 기본 골드) */
  iconAccentColor?: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  disabled?: boolean;
  /** 제목 아래·버튼 위 추가 블록(복채 안내 박스 등) */
  children?: ReactNode;
  /** 딤(패널 바깥) 클릭 시 — 없으면 바깥 탭으로 닫지 않음 */
  onBackdropPress?: () => void;
};

/**
 * MAGO 공통 다크 서피스 모달 — 복채 확인·작성 이어가기 등에 재사용
 */
export default function SurfaceModal({
  titleId,
  title,
  description,
  icon,
  iconAccentColor,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  disabled = false,
  children,
  onBackdropPress,
}: SurfaceModalProps) {
  return (
    <ModalLayer role="presentation">
      <ModalBackdrop
        aria-hidden
        onClick={() => {
          if (disabled) return;
          onBackdropPress?.();
        }}
      />
      <ModalPanel
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalTop>
          <IconCircle $accentColor={iconAccentColor} aria-hidden>
            {icon}
          </IconCircle>
          <ModalTitle id={titleId}>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
        </ModalTop>

        {children != null ? <ModalBody>{children}</ModalBody> : null}

        <ActionColumn>
          <PrimaryButton
            type="button"
            disabled={disabled}
            onClick={onPrimary}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            {primaryLabel}
          </PrimaryButton>
          <SecondaryButton
            type="button"
            disabled={disabled}
            onClick={onSecondary}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            {secondaryLabel}
          </SecondaryButton>
        </ActionColumn>
      </ModalPanel>
    </ModalLayer>
  );
}
