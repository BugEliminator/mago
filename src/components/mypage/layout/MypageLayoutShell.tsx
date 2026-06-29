"use client";

import { usePathname } from "next/navigation";
import SpaceBackground from "@/components/common/background/SpaceBackground";
import MypageSidebar from "@/components/mypage/sidebar/MypageSidebar";
import {
  MypageChrome,
  MypageStack,
  MypageInner,
  MypageMain,
  SpaceBackgroundSlot,
} from "./MypageLayoutShell.style";
import { isMypageImmersiveMobilePath } from "./mypageImmersiveMobilePaths";
import { useMypageImmersiveMobileSurface } from "./useMypageImmersiveMobileSurface";

/**
 * 마이페이지 시각 쉘 — SpaceBackground + 사이드바 + 콘텐츠 래퍼
 * app/mypage/layout.tsx(서버)에서 auth 체크 후 렌더
 */
export default function MypageLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMobileHub = pathname === "/mypage";
  const isImmersiveMobileShell = isMypageImmersiveMobilePath(pathname);

  useMypageImmersiveMobileSurface(isImmersiveMobileShell);

  return (
    <MypageChrome $isImmersiveMobileShell={isImmersiveMobileShell}>
      <SpaceBackgroundSlot $hideOnImmersiveMobile={isImmersiveMobileShell}>
        <SpaceBackground />
      </SpaceBackgroundSlot>
      <MypageStack
        $isMobileHub={isMobileHub}
        $isImmersiveMobileShell={isImmersiveMobileShell}
      >
        <MypageInner $isImmersiveMobileShell={isImmersiveMobileShell}>
          <MypageSidebar />
          <MypageMain $isImmersiveMobileShell={isImmersiveMobileShell}>
            {children}
          </MypageMain>
        </MypageInner>
      </MypageStack>
    </MypageChrome>
  );
}
