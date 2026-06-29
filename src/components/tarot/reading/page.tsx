"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NebulaBackground from "@/components/common/background/NebulaBackground";
import { clearTarotReadingLocalDraft } from "@/lib/clearTarotReadingLocalDraft";
import { readTarotReadingSetupForUser } from "@/lib/tarotLocalDraft";
import { preloadImage } from "@/lib/preloadImage";
import { preloadResultCardImages } from "@/lib/preloadResultCardImages";
import { requestSaveTarotSessionFromClient } from "@/lib/requestSaveTarotSessionFromClient";
import { supabase } from "@/lib/supabaseClient";
import { TAROT_CLASSIC_BACK_IMAGE_PATH } from "@/types/tarot";
import type { TarotSessionSetup } from "@/types/tarot";
import TarotReadingBootOverlay from "./TarotReadingBootOverlay";
import TarotReadingInterpretOverlay from "./TarotReadingInterpretOverlay";
import TarotReadingDeck, {
  type TarotReadingCompletePayload,
} from "./TarotReadingDeck";
import {
  Container,
  ContentLayer,
  ReadingStretchCardsWrap,
  ReadingStretchColumn,
} from "./page.style";

/** 로띠가 보여야 하는 최소 시간(ms) — 준비가 빨라도 이보다 짧게 끝내지 않습니다. */
const MIN_READING_BOOT_MS = 3000;

/** 해석 오버레이 최소 노출 시간(ms) — API가 빨리 끝나도 잠깐은 보여줍니다. */
const MIN_INTERPRET_OVERLAY_MS = 2000;

type PendingNavigation = {
  readingId: string;
  data: TarotReadingCompletePayload;
};

/**
 * 타로 카드 선택 페이지 — 설정에 따라 카드를 선택하는 화면
 */
export default function TarotReadingPage() {
  const router = useRouter();
  const [setup, setSetup] = useState<TarotSessionSetup | null>(null);
  const [setupReady, setSetupReady] = useState(false);

  const [bootOverlayVisible, setBootOverlayVisible] = useState(true);
  const [interpretOverlayVisible, setInterpretOverlayVisible] = useState(false);
  const pendingResultIdRef = useRef<string | null>(null);
  const overlayShownAtRef = useRef<number | null>(null);
  const pendingNavigationRef = useRef<PendingNavigation | null>(null);
  const navigateTimerRef = useRef<number | null>(null);
  const isCompletingRef = useRef(false);
  const [minBootElapsed, setMinBootElapsed] = useState(false);
  const [deckAssetReady, setDeckAssetReady] = useState(false);
  const [nebulaReady, setNebulaReady] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user == null) {
        router.push("/login");
        return;
      }
      setSetup(readTarotReadingSetupForUser(session.user.id));
      setSetupReady(true);
    });
  }, [router]);

  useEffect(() => {
    if (!setupReady) return;
    if (setup) return;
    router.push("/tarot/setup");
  }, [router, setup, setupReady]);

  useEffect(() => {
    if (!setup) return;
    const timerId = window.setTimeout(() => {
      setMinBootElapsed(true);
    }, MIN_READING_BOOT_MS);
    void preloadImage(TAROT_CLASSIC_BACK_IMAGE_PATH).finally(() => {
      setDeckAssetReady(true);
    });
    return () => window.clearTimeout(timerId);
  }, [setup]);

  useEffect(() => {
    return () => {
      if (navigateTimerRef.current != null) {
        window.clearTimeout(navigateTimerRef.current);
      }
    };
  }, []);

  const dismissBootOverlayRequested =
    setup !== null && minBootElapsed && deckAssetReady && nebulaReady;

  const handleBootDismissed = useCallback(() => {
    setBootOverlayVisible(false);
  }, []);

  /** 저장 실패·비로그인 시 리딩 진행 상태 초기화 */
  const resetReadingProgress = useCallback(() => {
    isCompletingRef.current = false;
    setInterpretOverlayVisible(false);
    pendingResultIdRef.current = null;
    overlayShownAtRef.current = null;
    pendingNavigationRef.current = null;
  }, []);

  const tryNavigateToResult = useCallback(async () => {
    if (isCompletingRef.current) return;

    const pending = pendingNavigationRef.current;
    const shownAt = overlayShownAtRef.current;
    if (pending == null || shownAt == null || setup == null) return;

    isCompletingRef.current = true;

    const elapsed = Date.now() - shownAt;
    const remaining = Math.max(0, MIN_INTERPRET_OVERLAY_MS - elapsed);

    const overlayWait = new Promise<void>((resolve) => {
      if (navigateTimerRef.current != null) {
        window.clearTimeout(navigateTimerRef.current);
      }
      navigateTimerRef.current = window.setTimeout(() => {
        navigateTimerRef.current = null;
        resolve();
      }, remaining);
    });

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError != null || session?.access_token == null) {
      resetReadingProgress();
      toast.error("로그인이 필요합니다. 다시 로그인 후 시도해 주세요.");
      return;
    }

    const savePromise = requestSaveTarotSessionFromClient({
      sessionId: pending.readingId,
      setup,
      llm: pending.data.result,
      accessToken: session.access_token,
    });

    const preloadPromise = preloadResultCardImages(
      pending.data.result.res_readings,
    );

    const [saveResult] = await Promise.all([
      savePromise,
      overlayWait,
      preloadPromise,
    ]);

    if (!saveResult.ok) {
      resetReadingProgress();
      toast.error(saveResult.error);
      return;
    }

    clearTarotReadingLocalDraft(session.user.id);
    router.push(`/tarot/result/${pending.readingId}`);
  }, [router, setup, resetReadingProgress]);

  /** 스프레드 매수만큼 카드 확정 완료 → 해석 중 오버레이 표시 */
  const handleAllSlotsPicked = useCallback(() => {
    pendingResultIdRef.current =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `reading-${Date.now()}`;
    overlayShownAtRef.current = Date.now();
    setInterpretOverlayVisible(true);
  }, []);

  /** LLM 해석 완료 → Supabase 저장 후 결과 페이지 이동 */
  const handleReadingComplete = useCallback(
    (data: TarotReadingCompletePayload) => {
      const readingId = pendingResultIdRef.current;
      if (readingId == null) return;

      pendingNavigationRef.current = { readingId, data };
      void tryNavigateToResult();
    },
    [tryNavigateToResult],
  );

  /** LLM 해석 실패 → 오버레이 닫고 토스트 */
  const handleReadingFailed = useCallback((message: string) => {
    resetReadingProgress();
    toast.error(message);
  }, [resetReadingProgress]);

  if (!setup) {
    return (
      <Container>
        <NebulaBackground />
        <ContentLayer></ContentLayer>
      </Container>
    );
  }

  return (
    <Container>
      <NebulaBackground onSnapshotReady={() => setNebulaReady(true)} />
      <ReadingStretchColumn>
        <ReadingStretchCardsWrap>
          <TarotReadingDeck
            setup={setup}
            onAllSlotsPicked={handleAllSlotsPicked}
            onReadingComplete={handleReadingComplete}
            onReadingFailed={handleReadingFailed}
          />
        </ReadingStretchCardsWrap>
      </ReadingStretchColumn>
      {interpretOverlayVisible ? <TarotReadingInterpretOverlay /> : null}
      {bootOverlayVisible && (
        <TarotReadingBootOverlay
          dismissRequested={dismissBootOverlayRequested}
          onDismissed={handleBootDismissed}
        />
      )}
    </Container>
  );
}
