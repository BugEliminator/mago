"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { shouldUseFixedLayoutShell } from "@/lib/layoutShellPaths";
import { shouldShowBottomNav } from "@/lib/bottomNavPaths";
import ConditionalHeader from "./ConditionalHeader";
import ConditionalBottomNav from "./ConditionalBottomNav";
import { MobilePageBottomInset } from "./BottomNav.style";
import { AppScrollRoot, AppFixedFrame } from "./AppLayoutShell.style";

type AppLayoutShellProps = {
  children: ReactNode;
};

/**
 * 하이브리드 레이아웃 셸
 * — ≤640px: 모바일 유동 / ≥641px: 1240px 고정 + 가로 스크롤
 * — setup·reading·auth 등은 셸 제외
 */
export default function AppLayoutShell({ children }: AppLayoutShellProps) {
  const pathname = usePathname();
  const useShell = shouldUseFixedLayoutShell(pathname);
  const showBottomNav = shouldShowBottomNav(pathname);

  const body = (
    <MobilePageBottomInset $enabled={showBottomNav}>
      {children}
    </MobilePageBottomInset>
  );

  if (!useShell) {
    return (
      <>
        <ConditionalHeader />
        {body}
        <ConditionalBottomNav />
      </>
    );
  }

  return (
    <AppScrollRoot>
      <AppFixedFrame>
        <ConditionalHeader />
        {body}
      </AppFixedFrame>
      <ConditionalBottomNav />
    </AppScrollRoot>
  );
}
