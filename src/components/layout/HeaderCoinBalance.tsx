"use client";

import { Coins } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { fetchAttendanceStatusFromClient } from "@/lib/fetchAttendanceStatusFromClient";
import { COIN_REWARD_ATTENDANCE } from "@/lib/coinRewards";
import { useCoinStore } from "@/stores/coinStore";
import { HeaderCoinChipLink } from "./Header.style";
import AttendancePrompt from "@/components/common/tooltip/AttendancePrompt";

type HeaderCoinBalanceProps = {
  userId: string | null;
  authReady: boolean;
};

/**
 * 헤더 우측 — 로그인 사용자 보유 엽전(냥) 표시
 * coinStore 구독 + 마운트 시 DB 동기화
 */
export default function HeaderCoinBalance({
  userId,
  authReady,
}: HeaderCoinBalanceProps) {
  const balance = useCoinStore((s) => s.balance);
  const hasCheckedInToday = useCoinStore((s) => s.hasCheckedInToday);
  const setBalance = useCoinStore((s) => s.setBalance);
  const setHasCheckedInToday = useCoinStore((s) => s.setHasCheckedInToday);
  const reset = useCoinStore((s) => s.reset);

  /** 잔액·출석 상태 — 로그인 시 DB에서 store 동기화 */
  useEffect(() => {
    if (!authReady || userId == null) {
      reset();
      return;
    }

    let cancelled = false;

    void supabase
      .from("profiles")
      .select("coin")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;

        if (error != null || data == null) {
          setBalance(0);
          return;
        }

        const coin =
          typeof data.coin === "number" ? data.coin : Number(data.coin ?? 0);
        setBalance(Number.isFinite(coin) ? coin : 0);
      });

    void supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled || session?.access_token == null) return;

      const result = await fetchAttendanceStatusFromClient(session.access_token);
      if (cancelled) return;

      setHasCheckedInToday(result.ok ? result.hasCheckedInToday : true);
    });

    return () => {
      cancelled = true;
    };
  }, [authReady, userId, reset, setBalance, setHasCheckedInToday]);

  if (!authReady || userId == null || balance == null) {
    return null;
  }

  const label = `${String(balance).padStart(3, "0")} 냥`;
  const showPrompt = hasCheckedInToday === false;

  return (
    <AttendancePrompt
      visible={showPrompt}
      href="/mypage/coins"
      message={`오늘 출석하고 ${COIN_REWARD_ATTENDANCE}냥 받기`}
    >
      <HeaderCoinChipLink
        href="/mypage/coins"
        aria-label={`보유 엽전 ${label}, 엽전 보관함으로 이동`}
      >
        <Coins size={14} strokeWidth={2} aria-hidden />
        <span>{label}</span>
      </HeaderCoinChipLink>
    </AttendancePrompt>
  );
}
