"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  applyWizardDraftForUser,
  clearTarotReadingLocalDraft,
  getTarotWizardResumeStepForUser,
  hasMeaningfulTarotWizardDraftForUser,
  hasTarotReadingSetupPendingForUser,
  setTarotGuestBrowseActive,
} from "@/lib/tarot/draft/tarotLocalDraft";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useTarotSetupStore } from "@/stores/tarotSetupStore";
import type { SetupStep } from "@/components/tarot/setup/SetupStepHeader";
import {
  isTarotDevRevealAllowed,
  withTarotDevReveal,
} from "@/lib/tarot/devReveal";

export type TarotSetupEntryOptions = {
  /** 로컬 dev 전용 — 리딩에서 카드 앞면 공개 */
  reveal?: boolean;
};

/**
 * 타로 설정 진입
 * — 비로그인: 게스트 모달 / 로그인: ① tarotSetup ② wizard draft ③ 신규
 */
export function useTarotSetupEntry() {
  const router = useRouter();
  const [guestEntryOpen, setGuestEntryOpen] = useState(false);
  const [readingResumeOpen, setReadingResumeOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const resumeStepRef = useRef<SetupStep>(1);
  /** 이번 진입이 로컬 앞면 공개 플로우인지 */
  const revealRef = useRef(false);

  const requestTarotSetup = useCallback((options?: TarotSetupEntryOptions) => {
    revealRef.current = Boolean(options?.reveal) && isTarotDevRevealAllowed();

    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user == null) {
        setGuestEntryOpen(true);
        return;
      }

      const userId = session.user.id;
      setTarotGuestBrowseActive(false);
      applyWizardDraftForUser(userId);

      if (hasTarotReadingSetupPendingForUser(userId)) {
        setReadingResumeOpen(true);
        return;
      }
      if (hasMeaningfulTarotWizardDraftForUser(userId)) {
        resumeStepRef.current = getTarotWizardResumeStepForUser(userId) ?? 1;
        setResumeOpen(true);
        return;
      }
      router.push(withTarotDevReveal("/tarot/setup", revealRef.current));
    })();
  }, [router]);

  const handleGuestBrowse = useCallback(() => {
    setGuestEntryOpen(false);
    setTarotGuestBrowseActive(true);
    useTarotSetupStore.getState().resetWizard();
    useTarotSetupStore.setState({ ownerUserId: null });
    router.push(
      withTarotDevReveal("/tarot/setup?browse=1&step=1", revealRef.current),
    );
  }, [router]);

  const handleGuestLogin = useCallback(() => {
    setGuestEntryOpen(false);
    router.push("/login");
  }, [router]);

  const handleDismissGuestEntry = useCallback(() => {
    setGuestEntryOpen(false);
  }, []);

  const handleResumeReading = useCallback(() => {
    setReadingResumeOpen(false);
    router.push(withTarotDevReveal("/tarot/reading", revealRef.current));
  }, [router]);

  const handleStartFreshFromReading = useCallback(() => {
    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user != null) {
        clearTarotReadingLocalDraft(session.user.id);
      }
      setReadingResumeOpen(false);
      router.push(withTarotDevReveal("/tarot/setup?step=1", revealRef.current));
    })();
  }, [router]);

  const handleDismissReadingResume = useCallback(() => {
    setReadingResumeOpen(false);
  }, []);

  const handleResume = useCallback(() => {
    setResumeOpen(false);
    router.push(
      withTarotDevReveal(
        `/tarot/setup?step=${resumeStepRef.current}`,
        revealRef.current,
      ),
    );
  }, [router]);

  const handleStartFresh = useCallback(() => {
    useTarotSetupStore.getState().resetWizard();
    setResumeOpen(false);
    router.push(withTarotDevReveal("/tarot/setup?step=1", revealRef.current));
  }, [router]);

  const handleDismissResume = useCallback(() => {
    setResumeOpen(false);
  }, []);

  return {
    guestEntryOpen,
    readingResumeOpen,
    resumeOpen,
    requestTarotSetup,
    handleGuestBrowse,
    handleGuestLogin,
    handleDismissGuestEntry,
    handleResumeReading,
    handleStartFreshFromReading,
    handleDismissReadingResume,
    handleResume,
    handleStartFresh,
    handleDismissResume,
  };
}
