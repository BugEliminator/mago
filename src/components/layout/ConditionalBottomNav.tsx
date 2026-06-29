"use client";

import { usePathname } from "next/navigation";
import { shouldShowBottomNav } from "@/lib/bottomNavPaths";
import BottomNav from "./BottomNav";

/**
 * 특정 경로에서는 하단 nav를 숨김
 */
export default function ConditionalBottomNav() {
  const pathname = usePathname();

  if (!shouldShowBottomNav(pathname)) {
    return null;
  }

  return <BottomNav />;
}
