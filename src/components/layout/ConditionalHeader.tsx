"use client";

import styled from "@emotion/styled";
import { usePathname } from "next/navigation";
import Header from "./Header";

/** 마이페이지 경로에서 모바일 헤더 숨김 — 각 서브페이지가 자체 탑바를 갖고 있음 */
const MobileHideOnMypage = styled.div<{ $hide: boolean }>`
  ${({ $hide }) =>
    $hide &&
    `
    @media (max-width: 640px) {
      display: none;
    }
  `}
`;

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
    "/reset-password",
    "/auth/callback",
    "/tarot/setup",
    "/tarot/reading",
  ];

  const shouldHideHeader =
    hideHeaderPaths.includes(pathname) || pathname === "/mypage";

  /** `app/tarot/result/layout.tsx`에서 헤더를 렌더하므로 중복 방지 */
  const tarotResultUsesNestedHeader = pathname.startsWith("/tarot/result/");

  if (shouldHideHeader || tarotResultUsesNestedHeader) {
    return null;
  }

  /** 마이페이지 서브 경로 — 모바일에서는 각 페이지의 탑바가 대신 함 */
  const isMypageSubPath =
    pathname.startsWith("/mypage/") && pathname !== "/mypage";

  return (
    <MobileHideOnMypage $hide={isMypageSubPath}>
      <Header fixed />
    </MobileHideOnMypage>
  );
}
