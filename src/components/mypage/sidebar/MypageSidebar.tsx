"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import {
  FolderClock,
  UserCog,
  CircleDollarSign,
  Package,
  Headphones,
  FileSpreadsheet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  SidebarRoot,
  SidebarGroup,
  GroupLabel,
  NavItemList,
  NavItem,
  NavItemIcon,
  NavItemLabel,
  Divider,
} from "./MypageSidebar.style";

type SidebarMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type SidebarMenuGroup = {
  groupLabel: string;
  items: SidebarMenuItem[];
};

/** 사이드바 메뉴 구성 */
const SIDEBAR_GROUPS: SidebarMenuGroup[] = [
  {
    groupLabel: "활동",
    items: [
      {
        label: "내 운세 히스토리",
        href: "/mypage/history",
        icon: FolderClock,
      },
      { label: "프로필 설정", href: "/mypage/profile", icon: UserCog },
      {
        label: "엽전 충전소",
        href: "/mypage/coins",
        icon: CircleDollarSign,
      },
      { label: "상점 보관함", href: "/mypage/inventory", icon: Package },
    ],
  },
  {
    groupLabel: "지원",
    items: [
      { label: "문의하기", href: "/mypage/inquiry", icon: Headphones },
      {
        label: "고객지원 및 약관",
        href: "/mypage/support",
        icon: FileSpreadsheet,
      },
    ],
  },
];

/**
 * 마이페이지 좌측 사이드바 — 현재 경로 기반 활성 상태 표시
 */
export default function MypageSidebar() {
  const pathname = usePathname();

  return (
    <SidebarRoot>
      {SIDEBAR_GROUPS.map((group, idx) => (
        <Fragment key={group.groupLabel}>
          {idx > 0 && <Divider />}
          <SidebarGroup>
            <GroupLabel>{group.groupLabel}</GroupLabel>
            <NavItemList>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <NavItem key={item.href} href={item.href} active={isActive}>
                    <NavItemIcon active={isActive}>
                      <Icon size={18} />
                    </NavItemIcon>
                    <NavItemLabel active={isActive}>{item.label}</NavItemLabel>
                  </NavItem>
                );
              })}
            </NavItemList>
          </SidebarGroup>
        </Fragment>
      ))}
    </SidebarRoot>
  );
}
