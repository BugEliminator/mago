"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import type { TarotSessionSetup } from "@/types/tarot";
import { TAROT_CLASSIC_BACK_IMAGE_PATH } from "@/types/tarot";
import { getTarotCardStoragePublicUrl } from "@/lib/tarot/map/tarotCardStorageUrl";
import type {
  PickModalState,
  PickedSlotEntry,
  ReadingCardState,
  ReadingViewState,
} from "@/types/tarotReadingDeck";
import { TarotCardToastIcon } from "@/components/common/toast/ToastIcons";
import {
  buildInterpretCatalogCards,
  buildVisibleDeckCards,
  createDeterministicDeckEntries,
  createFreshDeckEntries,
  createInterpretCatalogEntries,
  formatDeckForConsole,
  shuffleDeck,
} from "@/lib/tarot/reading/tarotReadingDeckDeck";
import {
  INTERPRET_SPREAD_STAGE_MIN_HEIGHT_PX,
  INTERPRET_SPREAD_STAGE_MIN_WIDTH_PX,
  SPREAD_STAGE_MIN_HEIGHT_PX,
  SPREAD_STAGE_MIN_WIDTH_PX,
  TAROT_PICK_PROMPT_TOAST_DURATION_MS,
  TAROT_PICK_PROMPT_TOAST_ID,
} from "@/lib/tarot/reading/tarotReadingDeckConstants";
import { useTarotDeckShuffle } from "@/hooks/useTarotDeckShuffle";
import { useTarotReadingDeckTimers } from "@/hooks/useTarotReadingDeckTimers";
import { useTarotSpreadMotion } from "@/hooks/useTarotSpreadMotion";
import type { MagoLlmResult } from "@/types/magoResult";
import { requestMagoReadingFromClient } from "@/lib/api/requestMagoReadingFromClient";
import {
  requestMagoCardDraftFromClient,
  requestMagoParallelSynthesisFromClient,
  type MagoCardDraftClientResult,
} from "@/lib/api/requestMagoParallelReadingFromClient";
import { assembleMagoParallelResult } from "@/lib/tarot/reading/assembleMagoParallelResult";
import { tarotPickSlotLabelKr } from "@/lib/tarot/reading/tarotPickSlotLabel";
import { getTarotSpreadPositionMeta } from "@/lib/tarot/spread/tarotSpreadPositionMeta";
import { supabase } from "@/lib/supabase/supabaseClient";
import PickCardConfirmModal from "./PickCardConfirmModal";
import {
  DeckOuter,
  SpreadScrollArea,
  SpreadScrollBody,
  SpreadDeckAlign,
  SpreadScrollTail,
  DeckStage,
  CardsLayer,
  CardSlot,
  CardInner,
  CardBackImage,
  CardBackSurface,
  CardGoldFrame,
  CardSheen,
  DeckActions,
  ActionButton,
  ActionLabel,
  StyledRefreshIcon,
} from "./TarotReadingDeck.style";

export type TarotReadingCompletePayload = {
  result: MagoLlmResult;
};

export interface TarotReadingDeckProps {
  setup: TarotSessionSetup;
  /** 로컬 dev 전용 — 뒷면 대신 앞면 이미지 표시 */
  showFaces?: boolean;
  /** 스프레드 장 수만큼 카드를 모두 확정했을 때 한 번 호출 (해석 오버레이 표시용) */
  onAllSlotsPicked?: () => void;
  /** LLM 해석 완료 시 호출 */
  onReadingComplete?: (data: TarotReadingCompletePayload) => void;
  /** LLM 해석 실패 시 호출 */
  onReadingFailed?: (message: string) => void;
}

/**
 * 타로 리딩 덱 — 진짜 셔플(덱 순서 자체를 섞음) + 스프레드 + 선택 UI
 */
export default function TarotReadingDeck({
  setup,
  showFaces = false,
  onAllSlotsPicked,
  onReadingComplete,
  onReadingFailed,
}: TarotReadingDeckProps) {
  const desiredPickCount = setup.cardCount ?? 0;
  const pickSlotCount = Math.max(0, desiredPickCount);
  const [viewState, setViewState] = useState<ReadingViewState>(
    showFaces ? "spread" : "deck",
  );
  const [isShuffling, setIsShuffling] = useState(false);
  const [isSpreading, setIsSpreading] = useState(false);

  const initialDeck = useMemo(
    () =>
      showFaces
        ? createInterpretCatalogEntries()
        : createDeterministicDeckEntries(),
    [showFaces],
  );

  /**
   * 단일 진실: 78장 물리적 순서(아래→위). index가 클수록 위. isReversed는 셔플마다 갱신
   * 하이드레이션 안정성을 위해 초기 렌더(SSR 포함)에서는 랜덤을 쓰지 않습니다.
   */
  const [deck, setDeck] = useState(initialDeck);
  const [deckReady, setDeckReady] = useState(false);
  const deckRef = useRef(initialDeck);

  const [deckCards, setDeckCards] = useState(() =>
    buildVisibleDeckCards(initialDeck),
  );
  const [spreadCards, setSpreadCards] = useState<ReadingCardState[] | null>(
    () => (showFaces ? buildInterpretCatalogCards(initialDeck) : null),
  );

  const [pickedSlots, setPickedSlots] = useState<(PickedSlotEntry | null)[]>(
    () => (showFaces ? Array.from({ length: pickSlotCount }, () => null) : []),
  );
  const [pickModal, setPickModal] = useState<PickModalState | null>(null);

  const [spreadLiftPx, setSpreadLiftPx] = useState(0);
  const [spreadLiftMotionReady, setSpreadLiftMotionReady] = useState(false);

  const committedPickIds = useMemo(
    () =>
      new Set(
        pickedSlots
          .filter((s): s is PickedSlotEntry => s !== null)
          .map((s) => s.cardId),
      ),
    [pickedSlots],
  );

  const { timersRef, clearTimers } = useTarotReadingDeckTimers();

  const { spreadScrollRef, handleSpread } = useTarotSpreadMotion({
    deckReady,
    deck,
    pickSlotCount,
    isSpreading,
    setIsSpreading,
    isShuffling,
    viewState,
    setViewState,
    setPickedSlots,
    setSpreadCards,
    setSpreadLiftPx,
    setSpreadLiftMotionReady,
    clearTimers,
    timersRef,
  });

  const { handleShuffle } = useTarotDeckShuffle({
    deckReady,
    isShuffling,
    setIsShuffling,
    isSpreading,
    viewState,
    deckRef,
    setDeck,
    setDeckCards,
    clearTimers,
    timersRef,
  });

  useEffect(() => {
    deckRef.current = deck;
  }, [deck]);

  /** 일반 리딩: 마운트 후 한 번 셔플. 해석 모드는 카탈로그를 그대로 씁니다. */
  useEffect(() => {
    if (deckReady) return;
    if (showFaces) {
      window.requestAnimationFrame(() => {
        setDeckReady(true);
      });
      return;
    }
    const id = window.requestAnimationFrame(() => {
      const shuffled = shuffleDeck(createFreshDeckEntries());
      setDeck(shuffled);
      setDeckCards(buildVisibleDeckCards(shuffled));
      setDeckReady(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, [deckReady, showFaces]);

  useEffect(() => {
    return () => {
      toast.dismiss(TAROT_PICK_PROMPT_TOAST_ID);
    };
  }, []);

  useEffect(() => {
    if (!deckReady) return;
    if (typeof window === "undefined") return;
    const key = "__MAGO_TAROT_DEBUG_INITIAL_DECK_LOGGED__";
    const w = window as unknown as Record<string, unknown>;
    if (w[key] === true) return;
    w[key] = true;
    console.log(
      "[MAGO][타로 리딩] 첫 로드 덱:",
      formatDeckForConsole(deckRef.current),
    );
  }, [deckReady]);

  useEffect(() => {
    if (viewState !== "spread") {
      toast.dismiss(TAROT_PICK_PROMPT_TOAST_ID);
    }
  }, [viewState]);

  useEffect(() => {
    if (viewState !== "spread" || isSpreading || pickSlotCount <= 0) return;

    const nextIdx = pickedSlots.findIndex((s) => s === null);
    if (nextIdx < 0) {
      toast.dismiss(TAROT_PICK_PROMPT_TOAST_ID);
      return;
    }

    const label = tarotPickSlotLabelKr(nextIdx);
    const meta =
      setup.category != null && setup.cardCount != null
        ? getTarotSpreadPositionMeta(
            setup.cardCount,
            setup.category,
            nextIdx,
            setup.detailTag,
          )
        : null;
    const title = `${label} 카드를 뽑아주세요.`;

    const description =
      meta != null ? (
        <>
          뽑게 되실 {label} 카드는 {meta.desc}을(를) 투영하고 있습니다.
        </>
      ) : undefined;

    toast(title, {
      id: TAROT_PICK_PROMPT_TOAST_ID,
      icon: <TarotCardToastIcon />,
      duration: TAROT_PICK_PROMPT_TOAST_DURATION_MS,
      ...(description != null ? { description } : {}),
    });
  }, [
    viewState,
    isSpreading,
    pickSlotCount,
    pickedSlots,
    setup.category,
    setup.cardCount,
    setup.detailTag,
  ]);

  const renderCards = viewState === "deck" ? deckCards : (spreadCards ?? []);
  const canInteractCards =
    viewState === "spread" &&
    !isShuffling &&
    !isSpreading &&
    pickModal === null;

  const handleDismissPickModal = useCallback(() => {
    setPickModal(null);
  }, []);

  const cardDraftPromisesRef = useRef<
    Map<number, Promise<MagoCardDraftClientResult>>
  >(new Map());

  const startCardDraft = useCallback(
    (
      slotIndex: number,
      pickedCard: { cardId: number; isReversed: boolean },
    ): Promise<MagoCardDraftClientResult> => {
      const existing = cardDraftPromisesRef.current.get(slotIndex);
      if (existing != null) return existing;

      const promise = (async (): Promise<MagoCardDraftClientResult> => {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error != null || session?.access_token == null) {
          return {
            ok: false,
            error: "카드 초안을 위한 로그인 정보를 확인하지 못했습니다.",
          };
        }

        return requestMagoCardDraftFromClient({
          accessToken: session.access_token,
          setup,
          pickedCard,
          slotIndex,
        });
      })().catch(() => ({
        ok: false as const,
        error: "카드 초안 생성 중 오류가 발생했습니다.",
      }));

      cardDraftPromisesRef.current.set(slotIndex, promise);
      return promise;
    },
    [setup],
  );

  const handleConfirmPickModal = useCallback(() => {
    if (pickModal == null) return;

    const deckIndex = deckRef.current.findIndex(
      (entry) =>
        entry.id === pickModal.cardId &&
        entry.isReversed === pickModal.isReversed,
    );
    const fromTopIndex =
      deckIndex >= 0 ? deckRef.current.length - 1 - deckIndex : null;

    console.log("[MAGO][타로 리딩] 카드 확정", {
      카드번호: pickModal.cardId,
      방향: pickModal.isReversed ? "역방향" : "정방향",
      슬롯: pickModal.slotIndex,
      덱인덱스_아래에서부터: deckIndex >= 0 ? deckIndex : null,
      덱인덱스_위에서부터: fromTopIndex,
    });

    const pickedCard = {
      cardId: pickModal.cardId,
      isReversed: pickModal.isReversed,
    };
    void startCardDraft(pickModal.slotIndex, pickedCard);
    setPickedSlots((previous) => {
      const next = [...previous];
      next[pickModal.slotIndex] = pickedCard;
      return next;
    });
    setPickModal(null);
  }, [pickModal, startCardDraft]);

  const didNotifyAllPickedRef = useRef(false);
  useEffect(() => {
    if (viewState !== "spread") return;
    if (isSpreading) return;
    if (pickSlotCount <= 0) return;
    if (pickedSlots.length !== pickSlotCount) return;
    if (pickedSlots.some((s) => s === null)) return;
    if (didNotifyAllPickedRef.current) return;
    didNotifyAllPickedRef.current = true;
    onAllSlotsPicked?.();
  }, [viewState, isSpreading, pickSlotCount, pickedSlots, onAllSlotsPicked]);

  const didLogLlmPayloadRef = useRef(false);
  const onReadingCompleteRef = useRef(onReadingComplete);
  const onReadingFailedRef = useRef(onReadingFailed);

  useEffect(() => {
    onReadingCompleteRef.current = onReadingComplete;
    onReadingFailedRef.current = onReadingFailed;
  }, [onReadingComplete, onReadingFailed]);

  useEffect(() => {
    if (viewState !== "spread") return;
    if (isSpreading) return;
    if (pickSlotCount <= 0) return;
    if (pickedSlots.length !== pickSlotCount) return;
    if (pickedSlots.some((s) => s === null)) return;
    if (didLogLlmPayloadRef.current) return;

    didLogLlmPayloadRef.current = true;

    const pickedCards = pickedSlots.map((s) => {
      const slot = s as PickedSlotEntry;
      return {
        cardId: slot.cardId,
        isReversed: slot.isReversed,
      };
    });

    const run = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        if (sessionError != null || accessToken == null) {
          console.error("[MAGO][타로 리딩] 인증 세션 조회 실패", sessionError);
          onReadingFailedRef.current?.("로그인 정보를 확인하지 못했습니다.");
          didLogLlmPayloadRef.current = false;
          return;
        }

        const parallelStartedAt = performance.now();
        const draftResultsPromise = Promise.all(
          pickedCards.map((pickedCard, slotIndex) =>
            startCardDraft(slotIndex, pickedCard),
          ),
        );
        const synthesisPromise = requestMagoParallelSynthesisFromClient({
          accessToken,
          setup,
          pickedCards,
        });
        const [draftResults, synthesisResult] = await Promise.all([
          draftResultsPromise,
          synthesisPromise,
        ]);
        const drafts = draftResults.flatMap((result) =>
          result.ok ? [result.draft] : [],
        );

        const parallelResult = synthesisResult.ok
          ? assembleMagoParallelResult(setup, drafts, synthesisResult.synthesis)
          : null;
        const apiResult =
          drafts.length === pickedCards.length && parallelResult != null
            ? { ok: true as const, result: parallelResult }
            : await requestMagoReadingFromClient({
                accessToken,
                setup,
                pickedCards,
              });

        if (parallelResult != null) {
          console.info("[MAGO][타로 리딩][병렬 전체 측정]", {
            cardCount: pickedCards.length,
            durationAfterLastPickMs: Number(
              (performance.now() - parallelStartedAt).toFixed(1),
            ),
          });
        } else if (!synthesisResult.ok) {
          console.warn(
            "[MAGO][타로 리딩] 병렬 종합 실패, 단일 호출로 복구",
            synthesisResult.error,
          );
        } else {
          console.warn(
            "[MAGO][타로 리딩] 카드 초안 또는 결과 조립 실패, 단일 호출로 복구",
          );
        }
        if (!apiResult.ok) {
          console.error("[MAGO][타로 리딩] LLM 요청 실패", apiResult.error);
          onReadingFailedRef.current?.(apiResult.error);
          didLogLlmPayloadRef.current = false;
          return;
        }

        console.log("[MAGO][타로 리딩] LLM 응답", apiResult.result);
        onReadingCompleteRef.current?.({
          result: apiResult.result,
        });
      } catch (error) {
        console.error("[MAGO][타로 리딩] 요청 처리 중 예외", error);
        onReadingFailedRef.current?.("리딩 요청 중 오류가 발생했습니다.");
        didLogLlmPayloadRef.current = false;
      }
    };

    void run();
  }, [
    viewState,
    isSpreading,
    pickSlotCount,
    pickedSlots,
    setup,
    startCardDraft,
  ]);

  const handleCardClick = useCallback(
    (cardId: number, isReversed: boolean) => {
      if (!canInteractCards) return;
      if (committedPickIds.has(cardId)) return;
      const slotIndex = pickedSlots.findIndex((s) => s === null);
      if (slotIndex < 0) return;

      const deckIndex = deckRef.current.findIndex(
        (e) => e.id === cardId && e.isReversed === isReversed,
      );
      const fromTopIndex =
        deckIndex >= 0 ? deckRef.current.length - 1 - deckIndex : null;

      console.log("[MAGO][타로 리딩] 카드 클릭", {
        카드번호: cardId,
        방향: isReversed ? "역방향" : "정방향",
        덱인덱스_아래에서부터: deckIndex >= 0 ? deckIndex : null,
        덱인덱스_위에서부터: fromTopIndex,
      });

      setPickModal({ cardId, isReversed, slotIndex });
    },
    [canInteractCards, committedPickIds, pickedSlots],
  );

  const cardSlotElements = renderCards.map((c, i) => {
    const committedPick =
      viewState !== "deck" && committedPickIds.has(c.cardId);
    return (
      <CardSlot
        key={`${c.cardId}-${c.isReversed ? "rev" : "up"}`}
        type="button"
        onClick={() => handleCardClick(c.cardId, c.isReversed)}
        disabled={!canInteractCards || committedPick}
        aria-disabled={!canInteractCards || committedPick}
        $x={c.pose.x}
        $y={c.pose.y}
        $rotateDeg={c.pose.rotateDeg}
        $scale={c.pose.scale}
        $zIndex={c.pose.zIndex}
        $durationMs={c.pose.durationMs}
        $delayMs={c.pose.delayMs}
        $isDisabled={!canInteractCards || committedPick}
        $spreadHover={canInteractCards && !committedPick}
        $committedPick={committedPick}
        $spreadPanScroll={viewState !== "deck"}
      >
        <CardInner>
          {showFaces ? (
            <CardBackSurface
              $faceSrc={getTarotCardStoragePublicUrl(c.cardId)}
              $isReversed={c.isReversed}
            />
          ) : viewState === "deck" ? (
            <CardBackImage
              src={TAROT_CLASSIC_BACK_IMAGE_PATH}
              alt=""
              fill
              sizes="170px"
              priority={i >= renderCards.length - 3}
            />
          ) : (
            <CardBackSurface />
          )}
          <CardGoldFrame />
          <CardSheen />
        </CardInner>
      </CardSlot>
    );
  });

  /** 모달 본문에만 쓰는 포지션 설명(desc) — 제목에는 순번만 표기 */
  const pickConfirmPositionDesc = useMemo(() => {
    if (
      pickModal == null ||
      setup.category == null ||
      setup.cardCount == null
    ) {
      return null;
    }
    return (
      getTarotSpreadPositionMeta(
        setup.cardCount,
        setup.category,
        pickModal.slotIndex,
        setup.detailTag,
      )?.desc ?? null
    );
  }, [pickModal, setup.category, setup.cardCount, setup.detailTag]);

  const isDeckMode = viewState === "deck";
  const spreadMinHeightPx = showFaces
    ? INTERPRET_SPREAD_STAGE_MIN_HEIGHT_PX
    : SPREAD_STAGE_MIN_HEIGHT_PX;
  const spreadMinWidthPx = showFaces
    ? INTERPRET_SPREAD_STAGE_MIN_WIDTH_PX
    : SPREAD_STAGE_MIN_WIDTH_PX;

  return (
    <DeckOuter $spreadViewportFill={!isDeckMode}>
      {pickModal ? (
        <PickCardConfirmModal
          slotIndex={pickModal.slotIndex}
          positionDesc={pickConfirmPositionDesc}
          category={setup.category}
          onCancel={handleDismissPickModal}
          onConfirm={handleConfirmPickModal}
        />
      ) : null}

      {isDeckMode ? (
        <DeckStage
          aria-label="타로 카드 덱"
          $isDeckMode={true}
          $spreadMinHeightPx={spreadMinHeightPx}
          $spreadMinWidthPx={spreadMinWidthPx}
        >
          <CardsLayer $spreadLiftPx={0} $spreadLiftMotion={false}>
            {cardSlotElements}
          </CardsLayer>
        </DeckStage>
      ) : (
        <SpreadScrollArea
          ref={spreadScrollRef}
          aria-label="펼친 카드 가로 탐색"
        >
          <SpreadScrollBody>
            <SpreadDeckAlign>
              <DeckStage
                aria-label="타로 카드 덱"
                $isDeckMode={false}
                $spreadMinHeightPx={spreadMinHeightPx}
                $spreadMinWidthPx={spreadMinWidthPx}
              >
                <CardsLayer
                  $spreadLiftPx={spreadLiftPx}
                  $spreadLiftMotion={spreadLiftMotionReady}
                >
                  {cardSlotElements}
                </CardsLayer>
              </DeckStage>
            </SpreadDeckAlign>
            <SpreadScrollTail aria-hidden />
          </SpreadScrollBody>
        </SpreadScrollArea>
      )}

      {viewState === "deck" ? (
        <DeckActions>
          <ActionButton
            onClick={handleShuffle}
            disabled={!deckReady || isShuffling || isSpreading}
          >
            <ActionLabel>
              <StyledRefreshIcon $isShuffling={isShuffling} size={14} />
              Shuffle
            </ActionLabel>
          </ActionButton>
          <ActionButton
            onClick={handleSpread}
            disabled={!deckReady || isShuffling || isSpreading}
          >
            <ActionLabel>
              <LayoutGrid size={14} />
              Spread Cards
            </ActionLabel>
          </ActionButton>
        </DeckActions>
      ) : null}
    </DeckOuter>
  );
}
