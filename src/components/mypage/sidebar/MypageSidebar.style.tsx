import styled from "@emotion/styled";
import Link from "next/link";
import { DESKTOP_MIN_WIDTH, MYPAGE_BELOW_HEADER_OFFSET } from "@/lib/layout";

/**
 * 사이드바 루트 — 흰 카드, 16.25rem(260px) 고정 너비
 * 모바일: fixed 헤더 아래 sticky / 데스크톱: MypageStack padding-top(1.5rem)과 동일
 */
export const SidebarRoot = styled.nav`
  width: 16.25rem;
  flex-shrink: 0;
  margin: 0;
  background: #fdfcf8;
  border-radius: 1rem;
  padding: 2rem 0.75rem;
  box-shadow: 0 4px 24px #030407;
  position: sticky;
  top: ${MYPAGE_BELOW_HEADER_OFFSET};
  max-height: calc(100vh - ${MYPAGE_BELOW_HEADER_OFFSET} - 2.5rem);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    top: 1.5rem;
    max-height: calc(100vh - 1.5rem - 2.5rem);
  }

  /* 모바일에서는 허브 페이지가 사이드바 역할을 대신함 */
  @media (max-width: 640px) {
    display: none;
  }
`;

/** 그룹 라벨 — 소문자 표기로 한국어 가독성 유지 */
export const GroupLabel = styled.p`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #9e9e9e;
  margin: 0;
  padding: 0 0.75rem;
`;

/** 그룹 내 메뉴 아이템 목록 */
export const NavItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

/** 사이드바 메뉴 그룹 */
export const SidebarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

/** 스타일 전용 prop — DOM으로 전달하지 않음 */
const navActivePropOptions = {
  shouldForwardProp: (prop: string) => prop !== "active",
};

/** 사이드바 내비게이션 아이템 */
export const NavItem = styled(Link, navActivePropOptions)<{
  active?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.625rem;
  background: ${({ active }) => (active ? "#eef0fc" : "transparent")};
  text-decoration: none;
  cursor: pointer;
  transition: background 150ms ease-in-out;

  &:hover {
    background: ${({ active }) => (active ? "#eef0fc" : "#f5f5f5")};
  }
`;

/** 아이콘 래퍼 */
export const NavItemIcon = styled("span", navActivePropOptions)<{
  active?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ active }) => (active ? "#1a237e" : "#9e9e9e")};
  transition: color 150ms ease-in-out;
`;

/** 메뉴 텍스트 */
export const NavItemLabel = styled("span", navActivePropOptions)<{
  active?: boolean;
}>`
  font-size: 0.875rem;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  color: ${({ active }) => (active ? "#1a237e" : "#424242")};
  transition: color 150ms ease-in-out;
`;

/** 그룹 구분선 */
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 0;
`;
