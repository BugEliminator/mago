"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** localStorage 키 — syncLanguageOnAuth에서도 직접 참조 */
export const LANGUAGE_STORE_KEY = "mago-language" as const;

/** 지원 언어 코드 */
export type LanguageCode = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type LanguageStore = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
};

/**
 * 언어 설정 전역 상태 — localStorage persist
 * 로그인 시 Supabase profiles.language와 동기화 (syncLanguageOnAuth)
 */
export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "ko",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: LANGUAGE_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
