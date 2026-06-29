"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type MutableRefObject,
} from "react";

/**
 * 타로 덱 셔플·스프레드 시퀀스에서 공유하는 `setTimeout` 핸들 정리
 */
export function useTarotReadingDeckTimers(): {
  timersRef: MutableRefObject<number[]>;
  clearTimers: () => void;
} {
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return { timersRef, clearTimers };
}
