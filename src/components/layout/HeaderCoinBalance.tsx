"use client";

import { Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { HeaderCoinChip } from "./Header.style";

type HeaderCoinBalanceProps = {
  userId: string | null;
  authReady: boolean;
};

/**
 * 헤더 우측 — 로그인 사용자 보유 엽전(냥) 표시
 */
export default function HeaderCoinBalance({
  userId,
  authReady,
}: HeaderCoinBalanceProps) {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!authReady || userId == null) {
      setBalance(null);
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

    return () => {
      cancelled = true;
    };
  }, [authReady, userId]);

  if (!authReady || userId == null || balance == null) {
    return null;
  }

  const label = `${String(balance).padStart(3, "0")} 냥`;

  return (
    <HeaderCoinChip aria-label={`보유 엽전 ${label}`}>
      <Coins size={14} strokeWidth={2} aria-hidden />
      <span>{label}</span>
    </HeaderCoinChip>
  );
}
