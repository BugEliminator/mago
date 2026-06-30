import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useMobileTouchScroll } from "@/hooks/useMobileTouchScroll";
import type { TarotCategory, TarotSessionSetup } from "@/types/tarot";
import {
  CHIPS_BY_CATEGORY,
  INTENT_CATEGORY_OPTIONS,
} from "../setupIntentCatalog";
import {
  SetupStepHeaderCopy,
  SetupStepHeaderNav,
} from "../SetupStepHeader";
import { StepHeaderDescriptionPhrase } from "../SetupStepHeader.style";
import { BackButton, ConfirmButton, SetupActionRow } from "../page.style";
import {
  CategoryButton,
  CategoryGrid,
  CategoryIcon,
  CategoryLabel,
  ChipEmptyText,
  ChipHash,
  ChipList,
  ChipScrollArea,
  DetailChip,
  DetailDivider,
  DetailDividerLabel,
  DetailDividerLine,
  StepTwoFooter,
  StepTwoRoot,
  StepTwoScrollArea,
} from "./StepTwoIntent.style";

type StepTwoIntentProps = {
  selectedCategory: TarotCategory | null;
  selectedDetailTag: string;
  onSelectCategory: (category: TarotCategory) => void;
  onSelectDetailTag: (detailTag: string) => void;
  /** setCategory는 카테고리 전환 시 detailTag를 비움 — 기본값만 채울 때는 병합 사용 */
  patchFormData: (partial: Partial<TarotSessionSetup>) => void;
  onConfirm: () => void;
  onBack: () => void;
  onCloseHome: () => void;
  disabled: boolean;
};

/** Step 2 — 카테고리와 세부 질문 태그를 선택합니다. */
export default function StepTwoIntent({
  selectedCategory,
  selectedDetailTag,
  onSelectCategory,
  onSelectDetailTag,
  patchFormData,
  onConfirm,
  onBack,
  onCloseHome,
  disabled,
}: StepTwoIntentProps) {
  const activeCategory = selectedCategory ?? "love";
  const hasSelectedDetailTag = selectedDetailTag.trim().length > 0;
  const activeChips = CHIPS_BY_CATEGORY[activeCategory];
  const contentScrollRef = useRef<HTMLDivElement | null>(null);

  /* iOS 3D 컨텍스트 안에서 터치 스크롤이 막히는 버그 우회 */
  useMobileTouchScroll(contentScrollRef);

  /**
   * UI 기본 강조가 연애(love)인데 스토어 category가 null이면
   * 리딩/저장 시 null로 남으므로 병합으로만 채움(detailTag 유지).
   * 페인트 전에 반영해 `다음` 클릭이 막히지 않도록 layout 이펙트 사용.
   */
  useLayoutEffect(() => {
    if (selectedCategory != null) return;
    patchFormData({ category: "love" });
  }, [selectedCategory, patchFormData]);

  /** 세부 태그를 먼저 누른 경우 category가 null이면 현재 분야와 함께 저장 */
  const handleSelectDetailTag = useCallback(
    (chip: string) => {
      if (selectedCategory === null) {
        patchFormData({ category: activeCategory, detailTag: chip });
        return;
      }
      onSelectDetailTag(chip);
    },
    [activeCategory, onSelectDetailTag, patchFormData, selectedCategory],
  );

  /**
   * 카드 앞면 패널과 겹치는 중첩 스크롤 때문에
   * 휠이 본문 영역에 적용되지 않는 경우가 있어, 캡처 단계에서 직접 스크롤합니다.
   */
  useEffect(() => {
    const el = contentScrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent): void => {
      if (!el.contains(e.target as Node)) return;

      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScrollTop = Math.max(0, scrollHeight - clientHeight);
      if (maxScrollTop <= 0) return;

      const dy = e.deltaY;
      if (dy === 0) return;

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

  /** 카테고리 변경 시 스크롤 위치를 초기화해 새 태그 목록이 위부터 보이게 합니다. */
  useEffect(() => {
    const el = contentScrollRef.current;
    if (el) {
      el.scrollTop = 0;
    }
  }, [activeCategory]);

  return (
    <StepTwoRoot>
      <SetupStepHeaderNav
        currentStep={2}
        onCloseHome={onCloseHome}
        disabled={disabled}
      />

      <SetupStepHeaderCopy
        eyebrow="Focus Your Intent"
        title="어떤 운명의 실타래를 풀어볼까요?"
        description={
          <>
            마고에게 물어볼 당신의 고민을 하나{" "}
            <StepHeaderDescriptionPhrase>선택해 주세요.</StepHeaderDescriptionPhrase>
          </>
        }
      />

      <StepTwoScrollArea ref={contentScrollRef}>
        <CategoryGrid>
          {INTENT_CATEGORY_OPTIONS.map((category) => {
            const active = activeCategory === category.id;
            const Icon = category.icon;

            return (
              <CategoryButton
                key={category.id}
                type="button"
                $active={active}
                disabled={disabled}
                aria-pressed={active}
                onClick={() => onSelectCategory(category.id)}
                whileHover={!disabled ? { y: -2 } : {}}
                whileTap={!disabled ? { scale: 0.97 } : {}}
              >
                <CategoryIcon
                  $active={active}
                  $accentColor={category.accentColor}
                >
                  <Icon size={21} strokeWidth={2} />
                </CategoryIcon>
                <CategoryLabel>{category.label}</CategoryLabel>
              </CategoryButton>
            );
          })}
        </CategoryGrid>

        <DetailDivider aria-hidden>
          <DetailDividerLine />
          <DetailDividerLabel>Detail Tags</DetailDividerLabel>
          <DetailDividerLine />
        </DetailDivider>

        <ChipScrollArea>
          {activeChips.length > 0 ? (
            <ChipList key={activeCategory} layout>
              {activeChips.map((chip) => {
                const active = selectedDetailTag === chip;

                return (
                  <DetailChip
                    key={chip}
                    type="button"
                    $active={active}
                    disabled={disabled}
                    aria-pressed={active}
                    onClick={() => handleSelectDetailTag(chip)}
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    whileTap={!disabled ? { scale: 0.96 } : {}}
                  >
                    <ChipHash $active={active}>#</ChipHash>
                    {chip}
                  </DetailChip>
                );
              })}
            </ChipList>
          ) : (
            <ChipEmptyText>선택 가능한 세부 태그가 없습니다.</ChipEmptyText>
          )}
        </ChipScrollArea>
      </StepTwoScrollArea>

      <StepTwoFooter>
        <SetupActionRow>
          <BackButton
            type="button"
            disabled={disabled}
            onClick={onBack}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            이전으로
          </BackButton>
          <ConfirmButton
            type="button"
            disabled={disabled || !hasSelectedDetailTag}
            onClick={onConfirm}
            whileHover={
              !disabled && hasSelectedDetailTag ? { scale: 1.02 } : {}
            }
            whileTap={
              !disabled && hasSelectedDetailTag ? { scale: 0.98 } : {}
            }
          >
            다음으로
          </ConfirmButton>
        </SetupActionRow>
      </StepTwoFooter>
    </StepTwoRoot>
  );
}
