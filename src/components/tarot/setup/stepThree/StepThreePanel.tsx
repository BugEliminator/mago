import { useEffect, useMemo, useRef } from "react";
import { useMobileTouchScroll } from "@/hooks/useMobileTouchScroll";
import { Heart, HelpCircle, PenLine } from "lucide-react";
import type { TarotCategory } from "@/types/tarot";
import {
  getIntentCategoryBadgeLabel,
  getIntentCategoryOption,
} from "../setupIntentCatalog";
import {
  SetupStepHeaderCopy,
  SetupStepHeaderNav,
} from "../SetupStepHeader";
import { StepHeaderDescriptionPhrase } from "../SetupStepHeader.style";
import { BackButton, ConfirmButton, SetupActionRow } from "../page.style";
import {
  CapsuleCategory,
  CapsuleDot,
  CapsuleTag,
  CategoryCapsule,
  FieldBlock,
  FieldLabel,
  GageCountCurrent,
  GageCountMax,
  GageCountWrap,
  GageFill,
  GageLeft,
  GageMarkTick,
  GageMessage,
  GageOptimalLabel,
  GageOptimalTick,
  GageOptimalWrap,
  GageSection,
  GageTitle,
  GageTitleDot,
  GageTitleRow,
  GageTopRow,
  GageTrack,
  GageTrackWrap,
  GageMarksRow,
  QuestionTextarea,
  SituTextarea,
  StepThreeFooter,
  StepThreeInnerStack,
  StepThreeRoot,
  StepThreeScrollArea,
  TextAreaWrap,
} from "./StepThreePanel.style";

/** 두 칸 합산 상한(필드 간 배분은 자유 — 예: 상황 300·질문 0 가능) */
const MAX_COMBINED = 300;
const MIN_REQUIRED = 30;

/** 상황 입력: 합계가 MAX_COMBINED를 넘지 않도록 자릅니다. */
function nextSituation(raw: string, questionLen: number): string {
  const maxLen = Math.max(0, MAX_COMBINED - questionLen);
  return raw.slice(0, maxLen);
}

/** 질문 입력: 합계가 MAX_COMBINED를 넘지 않도록 자릅니다. */
function nextQuestion(raw: string, situationLen: number): string {
  const maxLen = Math.max(0, MAX_COMBINED - situationLen);
  return raw.slice(0, maxLen);
}

type StepThreePanelProps = {
  category: TarotCategory | null;
  detailTag: string;
  situation: string;
  question: string;
  onChangeSituation: (value: string) => void;
  onChangeQuestion: (value: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  onCloseHome: () => void;
  disabled: boolean;
};

/** 게이지 안내 문구 — 입력 총 길이에 따라 바뀝니다. */
function getGageMessage(totalLength: number): string {
  if (totalLength === 0) return "마고에게 이야기를 들려주세요";
  if (totalLength < MIN_REQUIRED)
    return "마고가 이해하기에 조금 부족해요 (30자 이상)";
  if (totalLength < 100) return "좋아요, 조금 더 구체적이면 완벽해요";
  if (totalLength < 250) return "마고가 당신의 상황을 깊이 이해하고 있어요";
  return "충분합니다! 이제 마고는 완벽히 이해했어요";
}

/** Step 3 — 상황·질문 입력과 MAGO 게이지 */
export default function StepThreePanel({
  category,
  detailTag,
  situation,
  question,
  onChangeSituation,
  onChangeQuestion,
  onConfirm,
  onBack,
  onCloseHome,
  disabled,
}: StepThreePanelProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /* iOS 3D 컨텍스트 안에서 터치 스크롤이 막히는 버그 우회 (textarea 중첩 스크롤 포함) */
  useMobileTouchScroll(scrollRef, { nestedTextarea: true });

  const totalLength = situation.length + question.length;
  const canSubmit = totalLength >= MIN_REQUIRED && totalLength <= MAX_COMBINED;

  const gagePct = useMemo(
    () => Math.min((totalLength / MAX_COMBINED) * 100, 100),
    [totalLength],
  );

  const gageMessage = useMemo(() => getGageMessage(totalLength), [totalLength]);

  const activeCategoryId = category ?? "love";
  const categoryMeta = useMemo(
    () => getIntentCategoryOption(activeCategoryId),
    [activeCategoryId],
  );
  const categoryBadge = getIntentCategoryBadgeLabel(activeCategoryId);
  const CategoryIcon = categoryMeta?.icon ?? Heart;
  const categoryAccentColor = categoryMeta?.accentColor ?? "#d4af37";

  /**
   * 카드 패널과 겹치는 중첩 스크롤에서 휠이 먹도록 캡처 단계에서 처리합니다.
   */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent): void => {
      if (!el.contains(e.target as Node)) return;

      const dy = e.deltaY;
      if (dy === 0) return;

      const target = e.target;
      const ta = target instanceof Element ? target.closest("textarea") : null;

      if (ta instanceof HTMLTextAreaElement) {
        const tScroll = ta.scrollTop;
        const tMax = Math.max(0, ta.scrollHeight - ta.clientHeight);
        if (tMax > 0) {
          const canUp = tScroll > 0.5;
          const canDown = tScroll < tMax - 0.5;
          if ((dy < 0 && canUp) || (dy > 0 && canDown)) {
            ta.scrollTop = Math.max(0, Math.min(tMax, tScroll + dy));
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          const outerMax = Math.max(0, el.scrollHeight - el.clientHeight);
          const oScroll = el.scrollTop;
          const oCanUp = oScroll > 0.5;
          const oCanDown = oScroll < outerMax - 0.5;
          if (
            (dy > 0 && canDown === false && oCanDown) ||
            (dy < 0 && canUp === false && oCanUp)
          ) {
            el.scrollTop = Math.max(0, Math.min(outerMax, oScroll + dy));
            e.preventDefault();
            e.stopPropagation();
          }
          return;
        }
      }

      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScrollTop = Math.max(0, scrollHeight - clientHeight);
      if (maxScrollTop <= 0) return;

      const canScrollUp = scrollTop > 0.5;
      const canScrollDown = scrollTop < maxScrollTop - 0.5;

      if ((dy < 0 && canScrollUp) || (dy > 0 && canScrollDown)) {
        const next = Math.max(0, Math.min(maxScrollTop, scrollTop + dy));
        el.scrollTop = next;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const opts: AddEventListenerOptions = { capture: true, passive: false };
    el.addEventListener("wheel", onWheel, opts);
    return () => {
      el.removeEventListener("wheel", onWheel, opts);
    };
  }, []);

  return (
    <StepThreeRoot>
      <SetupStepHeaderNav
        currentStep={3}
        onCloseHome={onCloseHome}
        disabled={disabled}
      />

      <SetupStepHeaderCopy
        eyebrow="Finalize Your Question"
        title="마지막으로 질문을 정리해 볼까요?"
        description={
          <>
            현재 상황과 구체적인 질문을 입력해 주세요.
            <br />
            상세한 입력은 당신만의 리딩을 만드는{" "}
            <StepHeaderDescriptionPhrase>
              핵심이 됩니다.
            </StepHeaderDescriptionPhrase>
          </>
        }
      />

      <StepThreeScrollArea ref={scrollRef}>
        <StepThreeInnerStack>
          <CategoryCapsule>
            <CategoryIcon
              size={14}
              color={categoryAccentColor}
              strokeWidth={2}
              aria-hidden
            />
            <CapsuleCategory>{categoryBadge}</CapsuleCategory>
            <CapsuleDot aria-hidden />
            <CapsuleTag $accentColor={categoryAccentColor}>
              # {detailTag || "—"}
            </CapsuleTag>
          </CategoryCapsule>

          <FieldBlock>
            <FieldLabel htmlFor="setup-situation">
              <PenLine size={18} color="#60a5fa" strokeWidth={2} aria-hidden />
              지금 어떤 상황인가요?
            </FieldLabel>
            <TextAreaWrap>
              <SituTextarea
                id="setup-situation"
                value={situation}
                disabled={disabled}
                onChange={(e) =>
                  onChangeSituation(
                    nextSituation(e.target.value, question.length),
                  )
                }
                placeholder="예: 3년 사귄 연인과 최근 사소한 오해로 다투고 연락을 안 하고 있어요."
                autoComplete="off"
              />
            </TextAreaWrap>
          </FieldBlock>

          <FieldBlock>
            <FieldLabel htmlFor="setup-question">
              <HelpCircle
                size={18}
                color="#a78bfa"
                strokeWidth={2}
                aria-hidden
              />
              그 중 무엇이 가장 궁금한가요?
            </FieldLabel>
            <TextAreaWrap>
              <QuestionTextarea
                id="setup-question"
                value={question}
                disabled={disabled}
                onChange={(e) =>
                  onChangeQuestion(
                    nextQuestion(e.target.value, situation.length),
                  )
                }
                placeholder="예: 저희가 다시 예전처럼 가까워질 수 있을까요? 제가 먼저 연락해도 될까요?"
                autoComplete="off"
              />
            </TextAreaWrap>
          </FieldBlock>
        </StepThreeInnerStack>
      </StepThreeScrollArea>

      <GageSection>
        <GageTopRow>
          <GageLeft>
            <GageTitleRow>
              <GageTitleDot aria-hidden />
              <GageTitle>MAGO GAGE</GageTitle>
            </GageTitleRow>
            <GageMessage>{gageMessage}</GageMessage>
          </GageLeft>
          <GageCountWrap>
            <GageCountCurrent>{totalLength}</GageCountCurrent>
            <GageCountMax>/ {MAX_COMBINED}</GageCountMax>
          </GageCountWrap>
        </GageTopRow>

        <GageTrackWrap>
          <GageTrack>
            <GageFill
              $canOptimal={totalLength >= MIN_REQUIRED}
              $pct={gagePct}
            />
          </GageTrack>
          <GageMarksRow aria-hidden>
            <GageMarkTick style={{ left: 0 }} />
            <GageMarkTick style={{ right: 0 }} />
            <GageOptimalWrap>
              <GageOptimalTick />
              <GageOptimalLabel>OPTIMAL START</GageOptimalLabel>
            </GageOptimalWrap>
          </GageMarksRow>
        </GageTrackWrap>
      </GageSection>

      <StepThreeFooter>
        <SetupActionRow>
          <BackButton
            type="button"
            disabled={disabled}
            onClick={onBack}
            whileTap={!disabled ? { scale: 0.97 } : {}}
          >
            이전으로
          </BackButton>
          <ConfirmButton
            type="button"
            disabled={disabled || !canSubmit}
            onClick={onConfirm}
            whileHover={!disabled && canSubmit ? { scale: 1.02 } : {}}
            whileTap={!disabled && canSubmit ? { scale: 0.98 } : {}}
          >
            확인
          </ConfirmButton>
        </SetupActionRow>
      </StepThreeFooter>
    </StepThreeRoot>
  );
}
