import { useEffect, useRef } from "react";

/** react-mobile-picker itemHeight 와 동일 */
export const PICKER_ITEM_HEIGHT = 36;

/**
 * 트랙패드·마우스 휠을 한 칸씩 이동하도록 정규화하는 누적 임계값(px)
 * — 라이브러리 기본값은 이벤트마다 최소 1칸 점프해 트랙패드에서 과민 반응
 */
const WHEEL_STEP_THRESHOLD = 50;

/** 터치 드래그 1칸 이동 임계값 — itemHeight와 동일 */
const TOUCH_STEP_THRESHOLD = PICKER_ITEM_HEIGHT;

/** 제스처 간격이 이 값(ms)보다 길면 누적값 초기화 */
const GESTURE_GAP_MS = 120;

type UseWheelStepPickerOptions = {
  items: readonly string[];
  value: string;
  onValueChange: (next: string) => void;
  disabled?: boolean;
};

type StepRefs = {
  items: readonly string[];
  value: string;
  onValueChange: (next: string) => void;
};

/** 누적 델타가 임계값을 넘을 때마다 1칸씩 이동 */
function applyAccumulatedStep(
  accumulated: number,
  threshold: number,
  refs: StepRefs,
): number {
  let remaining = accumulated;

  while (Math.abs(remaining) >= threshold) {
    const direction = remaining > 0 ? 1 : -1;
    remaining -= direction * threshold;

    const currentIndex = refs.items.indexOf(refs.value);
    if (currentIndex === -1) continue;

    const nextIndex = Math.max(
      0,
      Math.min(refs.items.length - 1, currentIndex + direction),
    );
    if (nextIndex !== currentIndex) {
      const next = refs.items[nextIndex];
      if (next !== undefined) {
        refs.onValueChange(next);
        refs.value = next;
      }
    }
  }

  return remaining;
}

/**
 * 휠·터치 델타를 누적해 임계값 이상일 때만 1칸 이동
 * — wheelMode="off" 인 Picker 셸에 부착
 * — 모바일 touchmove도 처리해 부모 스크롤 연쇄(scroll chaining) 방지
 */
export function useWheelStepPicker({
  items,
  value,
  onValueChange,
  disabled = false,
}: UseWheelStepPickerOptions) {
  const shellRef = useRef<HTMLDivElement>(null);
  const wheelAccumulatedRef = useRef(0);
  const touchAccumulatedRef = useRef(0);
  const lastWheelAtRef = useRef(0);
  const lastTouchYRef = useRef(0);

  const itemsRef = useRef(items);
  const valueRef = useRef(value);
  const onValueChangeRef = useRef(onValueChange);

  itemsRef.current = items;
  valueRef.current = value;
  onValueChangeRef.current = onValueChange;

  useEffect(() => {
    const el = shellRef.current;
    if (!el || disabled) return;

    const getRefs = (): StepRefs => ({
      items: itemsRef.current,
      value: valueRef.current,
      onValueChange: (next) => {
        valueRef.current = next;
        onValueChangeRef.current(next);
      },
    });

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastWheelAtRef.current > GESTURE_GAP_MS) {
        wheelAccumulatedRef.current = 0;
      }
      lastWheelAtRef.current = now;

      wheelAccumulatedRef.current += e.deltaY;
      wheelAccumulatedRef.current = applyAccumulatedStep(
        wheelAccumulatedRef.current,
        WHEEL_STEP_THRESHOLD,
        getRefs(),
      );
    };

    const onTouchStart = (e: TouchEvent) => {
      lastTouchYRef.current = e.touches[0].clientY;
      touchAccumulatedRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!el.contains(e.target as Node)) return;

      e.preventDefault();
      e.stopPropagation();

      const currentY = e.touches[0].clientY;
      /* 양수 dy = 손가락 위로 = 다음 항목 */
      const dy = lastTouchYRef.current - currentY;
      lastTouchYRef.current = currentY;

      if (dy === 0) return;

      touchAccumulatedRef.current += dy;
      touchAccumulatedRef.current = applyAccumulatedStep(
        touchAccumulatedRef.current,
        TOUCH_STEP_THRESHOLD,
        getRefs(),
      );
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [disabled]);

  return shellRef;
}
