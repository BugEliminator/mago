"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  applyWizardDraftForUser,
  hasTarotReadingSetupPendingForUser,
  readWizardDraftForUser,
  setTarotGuestBrowseActive,
  writeTarotReadingSetupForUser,
} from "@/lib/tarotLocalDraft";
import {
  TAROT_WIZARD_INITIAL_FORM,
  useTarotSetupStore,
} from "@/stores/tarotSetupStore";
import SpaceBackground from "@/components/common/background/SpaceBackground";
import {
  SetupPageRoot,
  SetupSpaceBackdrop,
  SetupContentLayer,
  CardStage,
  CardSlideShell,
  CardFlipInner,
  CardFaceFront,
  CardFrontPanel,
  CardFaceBack,
  CardBackPanel,
} from "./page.style";
import { STEP_TOTAL, type SetupStep } from "./SetupStepHeader";
import StepOneSelection from "./stepOne/StepOneSelection";
import StepTwoIntent from "./stepTwo/StepTwoIntent";
import StepThreePanel from "./stepThree/StepThreePanel";
import SetupFinalConfirmModal from "./SetupFinalConfirmModal";
import SetupExitConfirmModal from "./SetupExitConfirmModal";
import SetupInsufficientCoinModal from "./SetupInsufficientCoinModal";
import { getTarotCoinCost } from "@/lib/tarotCoinCost";
import { requestSpendTarotCoinFromClient } from "@/lib/requestSpendTarotCoinFromClient";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import type { CardSpread } from "@/types/tarot";

const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FLIP_MS = 650;
const ENTER_MS = 1600;
const EXIT_MS = 1400;
const CENTER_PAUSE_MS = 150;
const EXIT_AFTER_FLIP_PAUSE_MS = 100;

function replaceStepQuery(step: SetupStep): void {
  const url = new URL(window.location.href);
  url.searchParams.set("step", String(step));
  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
}

/**
 * 타로 설정 페이지 — 우주 배경 + 3D 카드 골격(앞면 내용은 추후).
 * 뒷면 진입 → 앞면 플립 → 확인 → 뒷면 플립 → 왼쪽 퇴장 흐름만 검증합니다.
 */
export default function TarotSetupPage({
  initialStep,
  initialBrowse = false,
}: {
  initialStep: SetupStep;
  initialBrowse?: boolean;
}) {
  const router = useRouter();
  const step = useTarotSetupStore((s) => s.step);
  const formData = useTarotSetupStore((s) => s.formData);
  const setCardCount = useTarotSetupStore((s) => s.setCardCount);
  const setCategory = useTarotSetupStore((s) => s.setCategory);
  const setDetailTag = useTarotSetupStore((s) => s.setDetailTag);
  const patchFormData = useTarotSetupStore((s) => s.patchFormData);
  const setSituation = useTarotSetupStore((s) => s.setSituation);
  const setQuestion = useTarotSetupStore((s) => s.setQuestion);

  const initialStepRef = useRef(initialStep);
  initialStepRef.current = initialStep;
  const isGuestBrowseRef = useRef(initialBrowse);
  isGuestBrowseRef.current = initialBrowse;

  const [isFaceUp, setIsFaceUp] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isFinalConfirmOpen, setIsFinalConfirmOpen] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const [isInsufficientCoinOpen, setIsInsufficientCoinOpen] = useState(false);
  const [isSpendingCoin, setIsSpendingCoin] = useState(false);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  /** 게스트 둘러보기 — persist 없이 step1 / 로그인 유저 — owner 맞는 드래프트만 복구 */
  useEffect(() => {
    if (isGuestBrowseRef.current) {
      setTarotGuestBrowseActive(true);
      useTarotSetupStore.setState({
        ownerUserId: null,
        step: 1,
        formData: { ...TAROT_WIZARD_INITIAL_FORM },
      });
      replaceStepQuery(1);
      return () => {
        setTarotGuestBrowseActive(false);
        useTarotSetupStore.getState().resetWizard();
        useTarotSetupStore.setState({ ownerUserId: null });
      };
    }

    setTarotGuestBrowseActive(false);

    const applyStep = (userId: string) => {
      const draft = readWizardDraftForUser(userId);
      if (draft != null) {
        useTarotSetupStore.setState({
          ownerUserId: userId,
          step: draft.step,
          formData: draft.formData,
        });
      } else {
        applyWizardDraftForUser(userId);
        useTarotSetupStore.getState().setStep(initialStepRef.current);
      }
      replaceStepQuery(useTarotSetupStore.getState().step);
    };

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user == null) {
        router.push("/login");
        return;
      }
      applyStep(session.user.id);
    });
  }, [router]);

  useEffect(() => {
    replaceStepQuery(step);
  }, [step]);

  useEffect(() => {
    clearTimers();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsFaceUp(false);
    setIsLeaving(false);
    setIsTransitioning(true);

    const flipToFrontTimer = setTimeout(() => {
      setIsFaceUp(true);
    }, ENTER_MS + CENTER_PAUSE_MS);

    const readyTimer = setTimeout(
      () => {
        setIsTransitioning(false);
      },
      ENTER_MS + CENTER_PAUSE_MS + FLIP_MS,
    );

    timersRef.current = [flipToFrontTimer, readyTimer];

    return () => clearTimers();
  }, [clearTimers, step]);

  const moveToStep = (targetStep: SetupStep) => {
    if (isTransitioning) return;

    clearTimers();
    setIsTransitioning(true);
    setIsFaceUp(false);

    const leaveTimer = setTimeout(() => {
      setIsLeaving(true);
    }, FLIP_MS + EXIT_AFTER_FLIP_PAUSE_MS);

    const nextStepTimer = setTimeout(
      () => {
        useTarotSetupStore.getState().setStep(targetStep);
      },
      FLIP_MS + EXIT_AFTER_FLIP_PAUSE_MS + EXIT_MS,
    );

    timersRef.current = [leaveTimer, nextStepTimer];
  };

  /** 복채 차감 성공 후 저장하고 카드 뒤집기·퇴장 뒤 리딩 페이지로 이동합니다. */
  const exitToReading = useCallback(
    (userId: string) => {
    if (isTransitioning || isSpendingCoin) return;

    writeTarotReadingSetupForUser(
      userId,
      useTarotSetupStore.getState().formData,
    );
    setIsFinalConfirmOpen(false);
    clearTimers();
    setIsTransitioning(true);
    setIsFaceUp(false);

    const leaveTimer = setTimeout(() => {
      setIsLeaving(true);
    }, FLIP_MS + EXIT_AFTER_FLIP_PAUSE_MS);

    const routeTimer = setTimeout(
      () => {
        router.push("/tarot/reading");
      },
      FLIP_MS + EXIT_AFTER_FLIP_PAUSE_MS + EXIT_MS,
    );

    timersRef.current = [leaveTimer, routeTimer];
  },
    [clearTimers, isSpendingCoin, isTransitioning, router],
  );

  /** 복채 확인 모달 [확인하기] — 엽전 차감 후 리딩 시작 */
  const handleFinalConfirm = useCallback(async () => {
    if (isTransitioning || isSpendingCoin) return;

    const cardCount = formData.cardCount;
    if (cardCount == null) return;

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError != null || session?.access_token == null || session.user == null) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    const userId = session.user.id;
    useTarotSetupStore.getState().setOwnerUserId(userId);

    /** 이미 결제된 tarotSetup이 있으면 재차감 없이 리딩으로 */
    if (hasTarotReadingSetupPendingForUser(userId)) {
      exitToReading(userId);
      return;
    }

    setIsSpendingCoin(true);

    const result = await requestSpendTarotCoinFromClient({
      cardCount: cardCount as CardSpread,
      accessToken: session.access_token,
    });

    setIsSpendingCoin(false);

    if (!result.ok) {
      if (result.code === "INSUFFICIENT_BALANCE") {
        setIsFinalConfirmOpen(false);
        setIsInsufficientCoinOpen(true);
        return;
      }
      toast.error(result.error);
      return;
    }

    exitToReading(userId);
  }, [exitToReading, formData.cardCount, isSpendingCoin, isTransitioning]);

  const MIN_STEP3_CHARS = 30;
  const MAX_STEP3_TOTAL = 300;

  const handleConfirm = () => {
    if (step === 1 && formData.cardCount === null) return;
    if (step === 2 && formData.category === null) return;
    if (step === 2 && formData.detailTag.trim().length === 0) return;
    const step3Total =
      formData.situation.length + formData.question.length;
    if (
      step === 3 &&
      (step3Total < MIN_STEP3_CHARS || step3Total > MAX_STEP3_TOTAL)
    ) {
      return;
    }
    if (step === STEP_TOTAL) {
      if (isGuestBrowseRef.current) {
        toast.error("로그인이 필요합니다.", {
          description: "카드를 뽑고 타로를 보려면 로그인해 주세요.",
        });
        return;
      }
      setIsFinalConfirmOpen(true);
      return;
    }
    const nextStep = step >= STEP_TOTAL ? 1 : ((step + 1) as SetupStep);
    moveToStep(nextStep);
  };

  const handleBack = () => {
    if (isTransitioning) return;
    if (step === 1) {
      router.push("/");
      return;
    }
    moveToStep((step - 1) as SetupStep);
  };

  const handleCloseHome = () => {
    if (isTransitioning) return;
    setIsExitConfirmOpen(true);
  };

  const handleConfirmExitHome = () => {
    setIsExitConfirmOpen(false);
    router.push("/");
  };

  return (
    <SetupPageRoot>
      <SetupSpaceBackdrop aria-hidden>
        <SpaceBackground />
      </SetupSpaceBackdrop>
      <SetupContentLayer>
        <CardStage>
          <CardSlideShell
            key={step}
            initial={{ x: "130vw" }}
            animate={{
              x: isLeaving ? "-130vw" : 0,
              transition: {
                x: {
                  duration: isLeaving ? EXIT_MS / 1000 : ENTER_MS / 1000,
                  ease: SMOOTH_EASE,
                },
              },
            }}
          >
            <CardFlipInner
              initial={{ rotateY: 180 }}
              animate={{ rotateY: isFaceUp ? 0 : 180 }}
              transition={{ duration: FLIP_MS / 1000, ease: "easeInOut" }}
            >
              <CardFaceFront aria-label={`설정 ${step}단계 앞면`}>
                <CardFrontPanel>
                  {step === 1 ? (
                    <StepOneSelection
                      selectedCardCount={formData.cardCount}
                      onSelect={setCardCount}
                      onConfirm={handleConfirm}
                      onBack={handleBack}
                      onCloseHome={handleCloseHome}
                      disabled={isTransitioning}
                    />
                  ) : step === 2 ? (
                    <StepTwoIntent
                      selectedCategory={formData.category}
                      selectedDetailTag={formData.detailTag}
                      onSelectCategory={setCategory}
                      onSelectDetailTag={setDetailTag}
                      patchFormData={patchFormData}
                      onConfirm={handleConfirm}
                      onBack={handleBack}
                      onCloseHome={handleCloseHome}
                      disabled={isTransitioning}
                    />
                  ) : (
                    <StepThreePanel
                      category={formData.category}
                      detailTag={formData.detailTag}
                      situation={formData.situation}
                      question={formData.question}
                      onChangeSituation={setSituation}
                      onChangeQuestion={setQuestion}
                      onConfirm={handleConfirm}
                      onBack={handleBack}
                      onCloseHome={handleCloseHome}
                      disabled={isTransitioning}
                    />
                  )}
                </CardFrontPanel>
              </CardFaceFront>
              <CardFaceBack aria-hidden>
                <CardBackPanel />
              </CardFaceBack>
            </CardFlipInner>
          </CardSlideShell>
        </CardStage>
      </SetupContentLayer>
      {isExitConfirmOpen && (
        <SetupExitConfirmModal
          isGuestBrowse={initialBrowse}
          disabled={isTransitioning}
          onStay={() => setIsExitConfirmOpen(false)}
          onGoHome={handleConfirmExitHome}
        />
      )}
      {isFinalConfirmOpen && (
        <SetupFinalConfirmModal
          cardCount={formData.cardCount ?? 3}
          disabled={isTransitioning || isSpendingCoin}
          onCancel={() => setIsFinalConfirmOpen(false)}
          onConfirm={() => void handleFinalConfirm()}
        />
      )}
      {isInsufficientCoinOpen && (
        <SetupInsufficientCoinModal
          requiredCoin={getTarotCoinCost(formData.cardCount ?? 3)}
          onClose={() => setIsInsufficientCoinOpen(false)}
          onGoHome={() => router.push("/")}
          onGoCoins={() => router.push("/mypage/coins")}
        />
      )}
    </SetupPageRoot>
  );
}
