"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ChevronLeft } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { syncLanguageOnAuth } from "@/lib/syncLanguageOnAuth";
import {
  HeaderContainer,
  HeaderContent,
  LeftSection,
  Logo,
  LogoMark,
  LogoWordmark,
  RightSection,
  NavLink,
  NavTextButton,
  DesktopOnly,
  MobileOnly,
  HeaderHomeLink,
  HeaderBackButton,
} from "./Header.style";
import HeaderCoinBalance from "./HeaderCoinBalance";
import { useTarotSetupEntry } from "@/hooks/useTarotSetupEntry";
import TarotDraftResumeModal from "@/components/tarot/TarotDraftResumeModal";
import TarotReadingResumeModal from "@/components/tarot/TarotReadingResumeModal";
import TarotGuestEntryModal from "@/components/tarot/TarotGuestEntryModal";
import LanguageSwitcher from "@/components/common/dropdown/LanguageSwitcher";
import useSmartHeaderScroll from "@/hooks/useSmartHeaderScroll";

export type HeaderProps = {
  /** false면 고정 해제(타로 결과 등 스크롤과 함께 이동) */
  fixed?: boolean;
  /** result: 모바일 우측 홈 아이콘 / 데스크톱은 default와 동일 우측 메뉴 */
  variant?: "default" | "result";
  /** true면 스크롤 방향에 따라 헤더 표시/숨김 (결과 페이지 전용) */
  smartHide?: boolean;
};

const HEADER_HOME_ICON_SIZE = 20;
const HEADER_HOME_ICON_STROKE = 2;
const HEADER_BACK_ICON_SIZE = 20;
const HEADER_BACK_ICON_STROKE = 2;

/** 상단 헤더: 세션 유무에 따라 로그인/회원가입 또는 마이페이지/로그아웃 */
export default function Header({
  fixed = true,
  variant = "default",
  smartHide = false,
}: HeaderProps) {
  const router = useRouter();
  const smartHidden = useSmartHeaderScroll({ enabled: smartHide });
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
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

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
    } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUser = session?.user ?? null;
      syncSession(nextUser);

      /** 로그인/가입: 양방향 싱크 (localStorage 있으면 push, 없으면 DB pull) */
      if (event === "SIGNED_IN" && nextUser != null) {
        void syncLanguageOnAuth(nextUser.id);
      }
      /** 기존 세션으로 페이지 진입: localStorage 없을 때만 DB pull (매 로드 push 방지) */
      if (event === "INITIAL_SESSION" && nextUser != null) {
        void syncLanguageOnAuth(nextUser.id, { onlyPullIfEmpty: true });
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("로그아웃에 실패했습니다.");
      return;
    }
    toast.success("로그아웃되었습니다.");
    router.refresh();
    router.push("/");
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

      <HeaderContainer
        $fixed={fixed}
        $smartHide={smartHide}
        $smartHidden={smartHidden}
      >
        <HeaderContent>
          {/* 좌측: 로고 또는 [결과] 뒤로가기 + [데스크톱] 타로 시작하기 */}
          <LeftSection>
            {variant === "result" ? (
              <HeaderBackButton
                type="button"
                aria-label="뒤로가기"
                onClick={() => router.back()}
              >
                <ChevronLeft
                  size={HEADER_BACK_ICON_SIZE}
                  strokeWidth={HEADER_BACK_ICON_STROKE}
                  aria-hidden
                />
              </HeaderBackButton>
            ) : (
              <Logo>
                <Link href="/">
                  <LogoMark src="/icon/favicon.svg" alt="" width={103} height={153} />
                  <LogoWordmark src="/logo.png" alt="MAGO" />
                </Link>
              </Logo>
            )}

            {/* 데스크톱 전용 — 타로 시작하기 */}
            {variant === "default" ? (
              <DesktopOnly>
                <NavLink>
                  <NavTextButton type="button" onClick={requestTarotSetup}>
                    타로 시작하기
                  </NavTextButton>
                </NavLink>
              </DesktopOnly>
            ) : null}
          </LeftSection>

          {/* 우측 */}
          <RightSection>
            {variant === "result" ? (
              <MobileOnly>
                <HeaderHomeLink href="/" aria-label="홈">
                  <Home
                    size={HEADER_HOME_ICON_SIZE}
                    strokeWidth={HEADER_HOME_ICON_STROKE}
                    aria-hidden
                  />
                </HeaderHomeLink>
              </MobileOnly>
            ) : null}

            {variant === "default" ? (
              <>
                <HeaderCoinBalance userId={user?.id ?? null} authReady={authReady} />
                <LanguageSwitcher userId={user?.id ?? null} />
              </>
            ) : (
              <DesktopOnly>
                <HeaderCoinBalance userId={user?.id ?? null} authReady={authReady} />
                <LanguageSwitcher userId={user?.id ?? null} />
              </DesktopOnly>
            )}

            {/* 데스크톱 전용 — 마이페이지 / 로그아웃 / 로그인·회원가입 */}
            <DesktopOnly>
              {authReady && user ? (
                <>
                  <NavLink>
                    <Link href="/mypage/history">마이페이지</Link>
                  </NavLink>
                  <NavLink>
                    <NavTextButton type="button" onClick={handleLogout}>
                      로그아웃
                    </NavTextButton>
                  </NavLink>
                </>
              ) : authReady ? (
                <>
                  <NavLink>
                    <Link href="/login">로그인</Link>
                  </NavLink>
                  <NavLink>
                    <Link href="/signup">회원가입</Link>
                  </NavLink>
                </>
              ) : null}
            </DesktopOnly>
          </RightSection>
        </HeaderContent>
      </HeaderContainer>
    </>
  );
}
