"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { SetupStep } from "@/components/tarot/setup/SetupStepHeader";
import { isTarotGuestBrowseActive } from "@/lib/tarotGuestBrowse";
import { tarotWizardStorageKeyForUser } from "@/lib/tarotLocalDraftKeys";
import type { TarotCategory, TarotSessionSetup } from "@/types/tarot";

/** 타로 설정 마법사 persist 이름(접두사) — 실제 저장은 `:{userId}` 키 */
export const TAROT_SETUP_WIZARD_STORAGE_KEY =
  "mago-tarot-setup-wizard" as const;

/** Zustand 초기 폼 — draft 판별·reset에 공용 */
export const TAROT_WIZARD_INITIAL_FORM: TarotSessionSetup = {
  category: null,
  cardCount: 3,
  detailTag: "",
  situation: "",
  question: "",
};

function extractOwnerUserIdFromPersistValue(value: string): string | null {
  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed == null || typeof parsed !== "object") return null;
    const owner = (parsed as { state?: { ownerUserId?: unknown } }).state
      ?.ownerUserId;
    if (typeof owner !== "string" || owner.length === 0) return null;
    return owner;
  } catch {
    return null;
  }
}

/**
 * 유저별 localStorage — getItem은 전역 키 미사용(skipHydration과 함께)
 * setItem은 ownerUserId에 해당하는 키에만 저장
 */
const tarotWizardStateStorage: StateStorage = {
  getItem: () => null,
  setItem: (_name, value) => {
    if (typeof window === "undefined") return;
    if (isTarotGuestBrowseActive()) return;
    const owner = extractOwnerUserIdFromPersistValue(value);
    if (owner == null) return;
    localStorage.setItem(tarotWizardStorageKeyForUser(owner), value);
  },
  removeItem: (_name) => {
    if (typeof window === "undefined") return;
    const owner = useTarotSetupStore.getState().ownerUserId;
    if (owner == null) return;
    localStorage.removeItem(tarotWizardStorageKeyForUser(owner));
  },
};

type TarotSetupStore = {
  /** 드래프트 소유 유저 — persist 저장 키 결정 */
  ownerUserId: string | null;
  /** 설정 흐름 1 ~ 3 (리딩은 별도 라우트) */
  step: SetupStep;
  formData: TarotSessionSetup;
  setOwnerUserId: (ownerUserId: string | null) => void;
  setStep: (step: SetupStep) => void;
  patchFormData: (partial: Partial<TarotSessionSetup>) => void;
  setCategory: (category: TarotCategory | null) => void;
  setDetailTag: (detailTag: string) => void;
  setCardCount: (cardCount: TarotSessionSetup["cardCount"]) => void;
  setSituation: (situation: string) => void;
  setQuestion: (question: string) => void;
  /** 새로 작성 — 스텝·폼 초기화(ownerUserId 유지) */
  resetWizard: () => void;
};

/**
 * 타로 설정(스텝 1~3) 전역 상태 — 유저별 localStorage persist
 */
export const useTarotSetupStore = create<TarotSetupStore>()(
  persist(
    (set) => ({
      ownerUserId: null,
      step: 1,
      formData: { ...TAROT_WIZARD_INITIAL_FORM },
      setOwnerUserId: (ownerUserId) => set({ ownerUserId }),
      setStep: (step) => set({ step }),
      patchFormData: (partial) =>
        set((s) => ({ formData: { ...s.formData, ...partial } })),
      setCategory: (category) =>
        set((s) => ({
          formData: {
            ...s.formData,
            category,
            detailTag:
              s.formData.category === category ? s.formData.detailTag : "",
          },
        })),
      setDetailTag: (detailTag) =>
        set((s) => ({ formData: { ...s.formData, detailTag } })),
      setCardCount: (cardCount) =>
        set((s) => ({ formData: { ...s.formData, cardCount } })),
      setSituation: (situation) =>
        set((s) => ({ formData: { ...s.formData, situation } })),
      setQuestion: (question) =>
        set((s) => ({ formData: { ...s.formData, question } })),
      resetWizard: () =>
        set((s) => ({
          step: 1,
          formData: { ...TAROT_WIZARD_INITIAL_FORM },
          ownerUserId: s.ownerUserId,
        })),
    }),
    {
      name: TAROT_SETUP_WIZARD_STORAGE_KEY,
      storage: createJSONStorage(() => tarotWizardStateStorage),
      skipHydration: true,
      partialize: (state) => ({
        ownerUserId: state.ownerUserId,
        step: state.step,
        formData: state.formData,
      }),
      version: 4,
      migrate: (persisted, fromVersion) => {
        if (persisted == null || typeof persisted !== "object") return persisted;
        const rec = persisted as {
          ownerUserId?: unknown;
          step?: unknown;
          formData?: { category?: string | null };
        };

        if (fromVersion < 3) {
          const withOwner = { ...rec, ownerUserId: null };
          if (fromVersion < 2 && withOwner.formData?.category === "daily") {
            return {
              ...withOwner,
              formData: { ...withOwner.formData, category: "health" },
            };
          }
          return withOwner;
        }

        if (rec.formData?.category === "daily") {
          return {
            ...rec,
            formData: { ...rec.formData, category: "health" },
          };
        }
        return persisted;
      },
    },
  ),
);
