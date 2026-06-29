/** 게스트 둘러보기 — sessionStorage (wizard persist 비활성) */
export const TAROT_GUEST_BROWSE_SESSION_KEY = "mago-tarot-guest-browse" as const;

/** 게스트 둘러보기 모드 활성화 */
export function setTarotGuestBrowseActive(active: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (active) {
      sessionStorage.setItem(TAROT_GUEST_BROWSE_SESSION_KEY, "1");
    } else {
      sessionStorage.removeItem(TAROT_GUEST_BROWSE_SESSION_KEY);
    }
  } catch {
    // sessionStorage 접근 불가 무시
  }
}

/** 게스트 둘러보기 중이면 true */
export function isTarotGuestBrowseActive(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(TAROT_GUEST_BROWSE_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}
