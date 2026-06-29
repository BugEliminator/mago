"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import type { TarotSessionSetup } from "@/types/tarot";
import { TAROT_CLASSIC_BACK_IMAGE_PATH } from "@/types/tarot";
import type {
  PickModalState,
  PickedSlotEntry,
  ProfileRowForLlm,
  ReadingCardState,
  ReadingViewState,
} from "@/types/tarotReadingDeck";
import { TarotCardToastIcon } from "@/components/common/toast/ToastIcons";
import {
  buildVisibleDeckCards,
  createDeterministicDeckEntries,
  createFreshDeckEntries,
  formatDeckForConsole,
  shuffleDeck,
} from "@/lib/tarotReadingDeckDeck";
import {
  SPREAD_STAGE_MIN_HEIGHT_PX,
  SPREAD_STAGE_MIN_WIDTH_PX,
  TAROT_PICK_PROMPT_TOAST_DURATION_MS,
  TAROT_PICK_PROMPT_TOAST_ID,
  TOTAL_CARDS,
} from "@/lib/tarotReadingDeckConstants";
import { useTarotDeckShuffle } from "@/hooks/useTarotDeckShuffle";
import { useTarotReadingDeckTimers } from "@/hooks/useTarotReadingDeckTimers";
import { useTarotSpreadMotion } from "@/hooks/useTarotSpreadMotion";
import type {
  BasePickedCardForLlm,
  EnrichedPickedCardForLlm,
} from "@/lib/tarotReadingLlmPayload";
import type { MagoLlmResult } from "@/types/magoResult";
import {
  buildTarotReadingLlmPayload,
  enrichPickedCardsFromSupabase,
} from "@/lib/tarotReadingLlmPayload";
import { requestMagoReadingFromClient } from "@/lib/requestMagoReadingFromClient";
import { tarotPickSlotLabelKr } from "@/lib/tarotPickSlotLabel";
import { getTarotSpreadPositionMeta } from "@/lib/tarotSpreadPositionMeta";
import { supabase } from "@/lib/supabaseClient";
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
  onAllSlotsPicked,
  onReadingComplete,
  onReadingFailed,
}: TarotReadingDeckProps) {
  const desiredPickCount = setup.cardCount ?? 0;
  const pickSlotCount = Math.max(0, desiredPickCount);
  const [viewState, setViewState] = useState<ReadingViewState>("deck");
  const [isShuffling, setIsShuffling] = useState(false);
  const [isSpreading, setIsSpreading] = useState(false);

  const initialDeck = useMemo(() => createDeterministicDeckEntries(), []);

  /**
   * 단일 진실: 78장 물리적 순서(아래→위). index가 클수록 위. isReversed는 셔플마다 갱신
   * 하이드레이션 안정성을 위해 초기 렌더(SSR 포함)에서는 랜덤을 쓰지 않습니다.
   */
  const [deck, setDeck] = useState(initialDeck);
  const [deckReady, setDeckReady] = useState(false);
  const deckRef = useRef(initialDeck);
  const [profile, setProfile] = useState<ProfileRowForLlm | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [deckCards, setDeckCards] = useState(() =>
    buildVisibleDeckCards(initialDeck),
  );
  const [spreadCards, setSpreadCards] = useState<ReadingCardState[] | null>(
    null,
  );

  const [pickedSlots, setPickedSlots] = useState<(PickedSlotEntry | null)[]>(
    [],
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

  /** 프로필 로드 — nickname/생년월일/태어난시간/성별/국가(없으면 한국) */
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (cancelled) return;
        if (sessionError) {
          console.warn("[MAGO][타로 리딩] 세션 조회 실패", sessionError);
          setProfile(null);
          setProfileLoaded(true);
          return;
        }

        const uid = session?.user.id;
        if (!uid) {
          setProfile(null);
          setProfileLoaded(true);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("nickname,gender,birth_date,born_time,language")
          .eq("id", uid)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.warn("[MAGO][타로 리딩] 프로필 조회 실패", error);
          setProfile(null);
          setProfileLoaded(true);
          return;
        }

        setProfile((data ?? null) as ProfileRowForLlm | null);
        setProfileLoaded(true);
      } catch (e) {
        if (cancelled) return;
        console.warn("[MAGO][타로 리딩] 프로필 로드 예외", e);
        setProfile(null);
        setProfileLoaded(true);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  /** 최초 1회: 마운트 후 덱을 한 번 셔플 */
  useEffect(() => {
    if (deckReady) return;
    const id = window.requestAnimationFrame(() => {
      const shuffled = shuffleDeck(createFreshDeckEntries());
      setDeck(shuffled);
      setDeckCards(buildVisibleDeckCards(shuffled));
      setDeckReady(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, [deckReady]);

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

  const handleConfirmPickModal = useCallback(() => {
    setPickModal((m) => {
      if (!m) return null;
      const deckIndex = deckRef.current.findIndex((e) => e.id === m.cardId);
      const fromTopIndex = deckIndex >= 0 ? TOTAL_CARDS - 1 - deckIndex : null;

      console.log("[MAGO][타로 리딩] 카드 확정", {
        카드번호: m.cardId,
        방향: m.isReversed ? "역방향" : "정방향",
        슬롯: m.slotIndex,
        덱인덱스_아래에서부터: deckIndex >= 0 ? deckIndex : null,
        덱인덱스_위에서부터: fromTopIndex,
      });

      setPickedSlots((prev) => {
        const next = [...prev];
        next[m.slotIndex] = { cardId: m.cardId, isReversed: m.isReversed };
        return next;
      });
      return null;
    });
  }, []);

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
  }, [
    viewState,
    isSpreading,
    pickSlotCount,
    pickedSlots,
    onAllSlotsPicked,
  ]);

  const didLogLlmPayloadRef = useRef(false);
  const onReadingCompleteRef = useRef(onReadingComplete);
  const onReadingFailedRef = useRef(onReadingFailed);

  useEffect(() => {
    onReadingCompleteRef.current = onReadingComplete;
    onReadingFailedRef.current = onReadingFailed;
  }, [onReadingComplete, onReadingFailed]);

  useEffect(() => {
    if (!profileLoaded) return;
    if (viewState !== "spread") return;
    if (isSpreading) return;
    if (pickSlotCount <= 0) return;
    if (pickedSlots.length !== pickSlotCount) return;
    if (pickedSlots.some((s) => s === null)) return;
    if (didLogLlmPayloadRef.current) return;

    didLogLlmPayloadRef.current = true;

    const now = new Date();
    const basePicked: BasePickedCardForLlm[] = pickedSlots.map((s, idx) => {
      const meta =
        setup.cardCount != null && setup.category != null
          ? getTarotSpreadPositionMeta(
              setup.cardCount,
              setup.category,
              idx,
              setup.detailTag,
            )
          : null;

      const slot = s as PickedSlotEntry;
      return {
        순서: idx + 1,
        카드번호: slot.cardId,
        방향: slot.isReversed ? "역방향" : "정방향",
        해석포지션: meta
          ? {
              번호: meta.pos,
              라벨: meta.label,
              설명: meta.desc,
            }
          : null,
      };
    });

    const run = async () => {
      const result = await enrichPickedCardsFromSupabase(basePicked);
      const pickedForLog:
        | readonly EnrichedPickedCardForLlm[]
        | readonly BasePickedCardForLlm[] = result.ok
        ? result.pickedCards
        : basePicked;

      if (!result.ok) {
        if (result.meaningError != null) {
          console.warn(
            "[MAGO][타로 리딩] card_meanings 조회 실패",
            result.meaningError,
          );
        }
        if (result.cardsError != null) {
          console.warn("[MAGO][타로 리딩] cards 조회 실패", result.cardsError);
        }
      }

      const consolePayload = buildTarotReadingLlmPayload(
        now,
        profile,
        setup,
        pickedForLog,
      );
      console.log("[MAGO][타로 리딩] LLM 전달 payload(최종)", consolePayload);

      const apiResult = await requestMagoReadingFromClient(consolePayload);
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
    };

    void run();
  }, [
    profileLoaded,
    viewState,
    isSpreading,
    pickSlotCount,
    pickedSlots,
    profile,
    setup,
  ]);

  const handleCardClick = useCallback(
    (cardId: number, isReversed: boolean) => {
      if (!canInteractCards) return;
      if (committedPickIds.has(cardId)) return;
      const slotIndex = pickedSlots.findIndex((s) => s === null);
      if (slotIndex < 0) return;

      const deckIndex = deckRef.current.findIndex((e) => e.id === cardId);
      const fromTopIndex = deckIndex >= 0 ? TOTAL_CARDS - 1 - deckIndex : null;

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
        key={c.cardId}
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
          {viewState === "deck" ? (
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
          $spreadMinHeightPx={SPREAD_STAGE_MIN_HEIGHT_PX}
          $spreadMinWidthPx={SPREAD_STAGE_MIN_WIDTH_PX}
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
                $spreadMinHeightPx={SPREAD_STAGE_MIN_HEIGHT_PX}
                $spreadMinWidthPx={SPREAD_STAGE_MIN_WIDTH_PX}
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
