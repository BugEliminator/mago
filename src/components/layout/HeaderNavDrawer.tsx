"use client";

import { useEffect, useRef } from "react";
import { X, Wand2, UserCircle, LogOut, LogIn, UserPlus } from "lucide-react";
import {
  DrawerOverlay,
  DrawerPanel,
  DrawerHeader,
  DrawerCloseButton,
  DrawerNav,
  DrawerNavItem,
  DrawerNavLink,
  DrawerDivider,
} from "./HeaderNavDrawer.style";

export type DrawerNavCallbacks = {
  onStartTarot: () => void;
  onLogout: () => void;
  onClose: () => void;
  isLoggedIn: boolean;
};

const DRAWER_TRANSITION = {
  type: "tween" as const,
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

/**
 * 모바일 헤더 햄버거 메뉴 — 오른쪽 슬라이드 드로어
 * AnimatePresence 대신 animate prop으로 열기/닫기 제어 (React 19 호환)
 */
export default function HeaderNavDrawer({
  isOpen,
  onStartTarot,
  onLogout,
  onClose,
  isLoggedIn,
}: { isOpen: boolean } & DrawerNavCallbacks) {
  /** 닫힘 애니 완료 후 실행할 액션(모달·로그아웃 등) */
  const pendingActionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      pendingActionRef.current = null;
    }
  }, [isOpen]);

  /** 닫기 요청 + (선택) 애니 끝난 뒤 실행할 콜백 예약 */
  const requestClose = (afterClose?: () => void) => {
    if (afterClose) {
      pendingActionRef.current = afterClose;
    }
    onClose();
  };

  /** 패널 닫힘 슬라이드 완료 시 — 스크롤 해제·예약 액션 실행 */
  const handlePanelAnimationComplete = () => {
    if (isOpen) return;

    document.body.style.overflow = "";
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
  };

  return (
    <>
      <DrawerOverlay
        aria-hidden={!isOpen}
        initial={false}
        animate={{ opacity: isOpen ? 0.5 : 0 }}
        transition={DRAWER_TRANSITION}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
        onClick={() => requestClose()}
      />
      <DrawerPanel
        aria-hidden={!isOpen}
        initial={false}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={DRAWER_TRANSITION}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
        onAnimationComplete={handlePanelAnimationComplete}
      >
        <DrawerHeader>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#212121" }}>
            메뉴
          </span>
          <DrawerCloseButton
            type="button"
            onClick={() => requestClose()}
            aria-label="메뉴 닫기"
          >
            <X size={20} />
          </DrawerCloseButton>
        </DrawerHeader>

        <DrawerNav>
          <DrawerNavItem
            type="button"
            onClick={() => requestClose(onStartTarot)}
          >
            <Wand2 size={18} />
            타로 시작하기
          </DrawerNavItem>

          {isLoggedIn ? (
            <>
              <DrawerDivider />
              <DrawerNavLink href="/mypage/history" onClick={() => requestClose()}>
                <UserCircle size={18} />
                마이페이지
              </DrawerNavLink>
              <DrawerNavItem
                type="button"
                onClick={() => requestClose(onLogout)}
              >
                <LogOut size={18} />
                로그아웃
              </DrawerNavItem>
            </>
          ) : (
            <>
              <DrawerDivider />
              <DrawerNavLink href="/login" onClick={() => requestClose()}>
                <LogIn size={18} />
                로그인
              </DrawerNavLink>
              <DrawerNavLink href="/signup" onClick={() => requestClose()}>
                <UserPlus size={18} />
                회원가입
              </DrawerNavLink>
            </>
          )}
        </DrawerNav>
      </DrawerPanel>
    </>
  );
}
