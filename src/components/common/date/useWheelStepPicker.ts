import { useEffect, useRef } from "react";

/** react-mobile-picker itemHeight 와 동일 */
export const PICKER_ITEM_HEIGHT = 36;

/**
 * 트랙패드·마우스 휠을 한 칸씩 이동하도록 정규화하는 누적 임계값(px)
 * — 라이브러리 기본값은 이벤트마다 최소 1칸 점프해 트랙패드에서 과민 반응
 */
const WHEEL_STEP_THRESHOLD = 50;

/** 제스처 간격이 이 값(ms)보다 길면 누적값 초기화 */
const WHEEL_GESTURE_GAP_MS = 120;

type UseWheelStepPickerOptions = {
  items: readonly string[];
  value: string;
  onValueChange: (next: string) => void;
  disabled?: boolean;
};

/**
 * 휠 델타를 누적해 임계값 이상일 때만 1칸 이동
 * — wheelMode="off" 인 Picker 셸에 부착
 */
export function useWheelStepPicker({
  items,
  value,
  onValueChange,
  disabled = false,
}: UseWheelStepPickerOptions) {
  const shellRef = useRef<HTMLDivElement>(null);
  const accumulatedRef = useRef(0);
  const lastWheelAtRef = useRef(0);

  const itemsRef = useRef(items);
  const valueRef = useRef(value);
  const onValueChangeRef = useRef(onValueChange);

  itemsRef.current = items;
  valueRef.current = value;
  onValueChangeRef.current = onValueChange;

  useEffect(() => {
    const el = shellRef.current;
    if (!el || disabled) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastWheelAtRef.current > WHEEL_GESTURE_GAP_MS) {
        accumulatedRef.current = 0;
      }
      lastWheelAtRef.current = now;

      accumulatedRef.current += e.deltaY;

      if (Math.abs(accumulatedRef.current) < WHEEL_STEP_THRESHOLD) return;

      const direction = accumulatedRef.current > 0 ? 1 : -1;
      accumulatedRef.current = 0;

      const currentItems = itemsRef.current;
      const currentValue = valueRef.current;
      const currentIndex = currentItems.indexOf(currentValue);
      if (currentIndex === -1) return;

      const nextIndex = Math.max(
        0,
        Math.min(currentItems.length - 1, currentIndex + direction),
      );
      if (nextIndex !== currentIndex) {
        const next = currentItems[nextIndex];
        if (next !== undefined) {
          onValueChangeRef.current(next);
        }
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [disabled]);

  return shellRef;
}
