"use client";

import { create } from "zustand";

type CoinStore = {
  /** null — 아직 조회 전 */
  balance: number | null;
  /** null — 아직 조회 전 */
  hasCheckedInToday: boolean | null;
  setBalance: (balance: number) => void;
  setHasCheckedInToday: (checked: boolean) => void;
  reset: () => void;
};

/**
 * 엽전(냥) 잔액·출석 상태 전역 store
 * — 헤더·충전소·타로 소모 등에서 동기화
 */
export const useCoinStore = create<CoinStore>((set) => ({
  balance: null,
  hasCheckedInToday: null,
  setBalance: (balance) => set({ balance }),
  setHasCheckedInToday: (hasCheckedInToday) => set({ hasCheckedInToday }),
  reset: () => set({ balance: null, hasCheckedInToday: null }),
}));
