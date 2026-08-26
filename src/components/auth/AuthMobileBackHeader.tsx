"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { MypageMobileFixedTopBarSpacer } from "@/components/mypage/common/mypageMobileFixedTopBar.style";
import { AuthMobileTopBar, BackButton } from "./AuthMobileTopBar.style";

type AuthMobileBackHeaderProps = {
  /** 뒤로가기 이동 경로 */
  backHref: string;
  /** 접근성 라벨 */
  backAriaLabel: string;
  /** 있으면 기본 이동 대신 호출 (세션 정리 등) */
  onBack?: () => void;
};

/** 인증 화면 모바일 — fixed TopBar + 뒤로가기 */
export default function AuthMobileBackHeader({
  backHref,
  backAriaLabel,
  onBack,
}: AuthMobileBackHeaderProps) {
  const router = useRouter();

  return (
    <>
      <AuthMobileTopBar>
        <BackButton
          type="button"
          aria-label={backAriaLabel}
          onClick={() => {
            if (onBack != null) {
              onBack();
              return;
            }
            router.push(backHref);
          }}
        >
          <ChevronLeft size={18} />
        </BackButton>
      </AuthMobileTopBar>
      <MypageMobileFixedTopBarSpacer aria-hidden />
    </>
  );
}
