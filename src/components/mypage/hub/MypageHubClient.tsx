"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FolderClock,
  UserCog,
  CircleDollarSign,
  Package,
  Headphones,
  FileSpreadsheet,
  ChevronRight,
  Copy,
  Check,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DESKTOP_MIN_PX } from "@/lib/layout";
import { supabase } from "@/lib/supabaseClient";
import BannerEmailLine from "@/components/mypage/profile/BannerEmailLine";
import {
  BannerCard,
  BannerLeft,
  OrbWrap,
  OrbRingOuter,
  OrbRingInner,
  OrbBody,
  BannerNameBlock,
  MagoCodeBlock,
  MagoCodeLabel,
  MagoCodeRow,
  MagoCodeText,
  CopyButton,
} from "@/components/mypage/profile/ProfilePageClient.style";
import {
  BannerLogoutButton,
  HubBannerNickname,
  HubRoot,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
  MenuItemChevron,
} from "./MypageHubClient.style";

type HubProps = {
  nickname: string;
  email: string;
  uid: string;
};

type MenuItemConfig = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type MenuGroupConfig = {
  groupLabel: string;
  items: MenuItemConfig[];
};

/** 사이드바와 동일한 메뉴 구성 */
const MENU_GROUPS: MenuGroupConfig[] = [
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
 * 모바일 마이페이지 허브 — 프로필 배너 + 메뉴 리스트
 * 데스크톱(≥641px)에서는 /mypage/history로 자동 이동
 */
export default function MypageHubClient({ nickname, email, uid }: HubProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /** 데스크톱 진입 시 히스토리로 즉시 이동 */
  useEffect(() => {
    if (window.matchMedia(`(min-width: ${DESKTOP_MIN_PX}px)`).matches) {
      router.replace("/mypage/history");
    }
  }, [router]);

  /** 마고 코드(uid) 클립보드 복사 */
  const handleCopy = async () => {
    if (!uid) return;
    try {
      await navigator.clipboard.writeText(uid);
      setCopied(true);
      toast.success("코드가 복사되었습니다.", {
        description: "친구에게 전달해서 엽전을 얻어보세요!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  /** 로그아웃 — Header와 동일 흐름 */
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    const { error } = await supabase.auth.signOut();
    setIsLoggingOut(false);

    if (error) {
      toast.error("로그아웃에 실패했습니다.");
      return;
    }

    toast.success("로그아웃되었습니다.");
    router.refresh();
    router.push("/");
  };

  const displayName = nickname.trim() || "닉네임 없음";

  return (
    <HubRoot>
      {/* 프로필 배너 — 프로필 설정과 동일 스타일 */}
      <BannerCard>
        <BannerLogoutButton
          type="button"
          aria-label="로그아웃"
          disabled={isLoggingOut}
          onClick={() => void handleLogout()}
        >
          <LogOut size={13} aria-hidden />
          {isLoggingOut ? "처리 중…" : "로그아웃"}
        </BannerLogoutButton>

        <BannerLeft>
          <OrbWrap>
            <OrbRingOuter />
            <OrbRingInner />
            <OrbBody>
              <span>
                <span className="orb-glow" />
                <span className="orb-dot" />
              </span>
            </OrbBody>
          </OrbWrap>

          <BannerNameBlock>
            <HubBannerNickname>{displayName}</HubBannerNickname>
            <BannerEmailLine email={email} />
          </BannerNameBlock>
        </BannerLeft>

        <MagoCodeBlock>
          <MagoCodeLabel>내 마고 코드 (초대 ID)</MagoCodeLabel>
          <MagoCodeRow>
            <MagoCodeText>{uid || "—"}</MagoCodeText>
            <CopyButton
              type="button"
              $copied={copied}
              onClick={handleCopy}
              disabled={!uid}
            >
              {copied ? (
                <>
                  <Check size={11} />
                  완료
                </>
              ) : (
                <>
                  <Copy size={11} />
                  복사
                </>
              )}
            </CopyButton>
          </MagoCodeRow>
        </MagoCodeBlock>
      </BannerCard>

      {/* 활동 / 지원 메뉴 그룹 */}
      {MENU_GROUPS.map((group) => (
        <MenuGroup key={group.groupLabel}>
          <MenuGroupLabel>{group.groupLabel}</MenuGroupLabel>
          {group.items.map((item) => {
            const Icon = item.icon;
            return (
              <MenuItem key={item.href} href={item.href}>
                <MenuItemIcon>
                  <Icon size={18} />
                </MenuItemIcon>
                <MenuItemLabel>{item.label}</MenuItemLabel>
                <MenuItemChevron>
                  <ChevronRight size={16} />
                </MenuItemChevron>
              </MenuItem>
            );
          })}
        </MenuGroup>
      ))}
    </HubRoot>
  );
}
