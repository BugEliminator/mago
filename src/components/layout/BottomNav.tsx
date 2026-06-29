"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { BookOpenText, CircleUserRound, Home } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { TarotCardToastIcon } from "@/components/common/toast/ToastIcons";
import { useTarotSetupEntry } from "@/hooks/useTarotSetupEntry";
import TarotDraftResumeModal from "@/components/tarot/TarotDraftResumeModal";
import TarotReadingResumeModal from "@/components/tarot/TarotReadingResumeModal";
import TarotGuestEntryModal from "@/components/tarot/TarotGuestEntryModal";
import BottomNavTarotIcon from "./icons/BottomNavTarotIcon";
import {
  BottomNavIcon,
  BottomNavItem,
  BottomNavLabel,
  BottomNavList,
  BottomNavRoot,
} from "./BottomNav.style";

const NAV_ICON_SIZE = 20;
const NAV_ICON_STROKE = 2;

type BottomNavItemConfig = {
  id: string;
  label: string;
  renderIcon: () => ReactNode;
  isActive: (pathname: string) => boolean;
};

const BOTTOM_NAV_ITEMS: BottomNavItemConfig[] = [
  {
    id: "main",
    label: "홈",
    renderIcon: () => (
      <Home size={NAV_ICON_SIZE} strokeWidth={NAV_ICON_STROKE} aria-hidden />
    ),
    isActive: (pathname) => pathname === "/",
  },
  {
    id: "tarot-start",
    label: "타로",
    renderIcon: () => (
      <BottomNavTarotIcon size={NAV_ICON_SIZE} strokeWidth={NAV_ICON_STROKE} />
    ),
    isActive: (pathname) =>
      pathname.startsWith("/tarot/setup") ||
      pathname.startsWith("/tarot/reading"),
  },
  {
    id: "tarot-history",
    label: "도감",
    renderIcon: () => (
      <BookOpenText
        size={NAV_ICON_SIZE}
        strokeWidth={NAV_ICON_STROKE}
        aria-hidden
      />
    ),
    /** 도감 페이지 미구현 — 추후 경로 추가 시 여기 반영 */
    isActive: () => false,
  },
  {
    id: "mypage",
    label: "마이",
    renderIcon: () => (
      <CircleUserRound
        size={NAV_ICON_SIZE}
        strokeWidth={NAV_ICON_STROKE}
        aria-hidden
      />
    ),
    isActive: (pathname) => pathname.startsWith("/mypage"),
  },
];

/**
 * 모바일 하단 탭 nav — 홈·타로·도감·마이(비로그인 시 로그인) 이동
 */
export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const isLoggedIn = authReady && user != null;

  useEffect(() => {
    let cancelled = false;

    const syncSession = (nextUser: User | null) => {
      if (!cancelled) {
        setUser(nextUser);
        setAuthReady(true);
      }
    };

    void supabase.auth.getSession().then(({ data: { session } }) => {
      syncSession(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const {
    requestTarotSetup,
    guestEntryOpen,
    readingResumeOpen,
    resumeOpen,
    handleGuestBrowse,
    handleGuestLogin,
    handleDismissGuestEntry,
    handleResumeReading,
    handleStartFreshFromReading,
    handleDismissReadingResume,
    handleResume,
    handleStartFresh,
    handleDismissResume,
  } = useTarotSetupEntry();

  const handleNavClick = (id: string) => {
    switch (id) {
      case "main":
        if (pathname !== "/") {
          router.push("/");
        }
        return;
      case "tarot-start":
        requestTarotSetup();
        return;
      case "tarot-history":
        toast("준비중입니다", { icon: <TarotCardToastIcon /> });
        return;
      case "mypage":
        router.push(isLoggedIn ? "/mypage" : "/login");
        return;
      default:
        return;
    }
  };

  return (
    <>
      {guestEntryOpen ? (
        <TarotGuestEntryModal
          onBrowse={handleGuestBrowse}
          onLogin={handleGuestLogin}
          onDismiss={handleDismissGuestEntry}
        />
      ) : null}
      {readingResumeOpen ? (
        <TarotReadingResumeModal
          onResume={handleResumeReading}
          onStartFresh={handleStartFreshFromReading}
          onDismiss={handleDismissReadingResume}
        />
      ) : null}
      {resumeOpen ? (
        <TarotDraftResumeModal
          onResume={handleResume}
          onStartFresh={handleStartFresh}
          onDismiss={handleDismissResume}
        />
      ) : null}

      <BottomNavRoot aria-label="하단 메뉴">
        <BottomNavList role="tablist">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const label =
              item.id === "mypage" && authReady && !isLoggedIn
                ? "로그인"
                : item.label;
            const active =
              item.id === "mypage"
                ? isLoggedIn
                  ? pathname.startsWith("/mypage")
                  : pathname === "/login" || pathname === "/signup"
                : item.isActive(pathname);
            return (
              <BottomNavItem
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={label}
                $active={active}
                onClick={() => handleNavClick(item.id)}
              >
                <BottomNavIcon $active={active}>{item.renderIcon()}</BottomNavIcon>
                <BottomNavLabel $active={active}>{label}</BottomNavLabel>
              </BottomNavItem>
            );
          })}
        </BottomNavList>
      </BottomNavRoot>
    </>
  );
}
