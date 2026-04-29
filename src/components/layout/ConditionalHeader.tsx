"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

/**
 * 특정 경로에서는 헤더를 숨기는 조건부 헤더 컴포넌트
 */
export default function ConditionalHeader() {
  const pathname = usePathname();

  // 헤더를 숨길 경로 목록
  const hideHeaderPaths = [
    "/login",
    "/signup",
    "/forget-password",
    "/tarot/setup",
    "/tarot/reading",
  ];

  // 결과 페이지도 숨기기 (동적 라우팅 포함)
  const shouldHideHeader =
    hideHeaderPaths.includes(pathname) || 
    pathname.startsWith("/tarot/result/");

  if (shouldHideHeader) {
    return null;
  }

  return <Header />;
}