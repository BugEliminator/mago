import styled from "@emotion/styled";
import Link from "next/link";
import { BannerNickname } from "@/components/mypage/profile/ProfilePageClient.style";

/** 허브 루트 — 모바일 전용 메뉴 리스트 */
export const HubRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.25rem 0 2rem;
`;

/** 배너 닉네임 — 로그아웃 버튼과 겹치지 않게 (이메일 행에는 적용하지 않음) */
export const HubBannerNickname = styled(BannerNickname)`
  padding-right: 4.75rem;
`;

/** 배너 우상단 로그아웃 */
export const BannerLogoutButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.625rem;
  font-family: inherit;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #9ea3c0;
  background: #0c0d1e;
  border: 1px solid #3a3d58;
  border-radius: 0.5rem;
  cursor: pointer;
  transition:
    color 150ms ease-in-out,
    border-color 150ms ease-in-out,
    background 150ms ease-in-out;

  &:hover {
    color: #e2e4f0;
    border-color: #64688a;
    background: #13162d;
  }

  &:active {
    background: #1a1d35;
  }
`;

/** 메뉴 그룹 컨테이너 */
export const MenuGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

/** 그룹 라벨 */
export const MenuGroupLabel = styled.p`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #64688a;
  margin: 0;
  padding: 0 0.25rem;
`;

/** 메뉴 아이템 — 다크 카드 */
export const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: #111325;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: background 150ms ease-in-out;

  &:hover,
  &:active {
    background: #13162d;
  }
`;

/** 메뉴 아이콘 */
export const MenuItemIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #9ea3c0;
`;

/** 메뉴 텍스트 */
export const MenuItemLabel = styled.span`
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #e2e4f0;
`;

/** 오른쪽 Chevron */
export const MenuItemChevron = styled.span`
  display: flex;
  align-items: center;
  color: #3a3d58;
  flex-shrink: 0;
`;
