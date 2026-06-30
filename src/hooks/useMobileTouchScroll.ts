import { useEffect } from "react";

type Options = {
  /** textarea를 포함한 중첩 스크롤 처리 여부 (Step 3에서 사용) */
  nestedTextarea?: boolean;
};

/**
 * iOS Safari에서 3D 변환(perspective/rotateY) 컨테이너 안의
 * 터치 스크롤이 막히는 WebKit 버그를 우회합니다.
 * touchmove 이벤트를 직접 캡처해 scrollTop을 수동으로 조정합니다.
 */
export function useMobileTouchScroll(
  ref: React.RefObject<HTMLElement | null>,
  { nestedTextarea = false }: Options = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastY = 0;

    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent): void => {
      if (!el.contains(e.target as Node)) return;

      const currentY = e.touches[0].clientY;
      /* 양수 dy = 손가락이 위로 이동 = 콘텐츠 아래로 스크롤 */
      const dy = lastY - currentY;
      lastY = currentY;

      if (dy === 0) return;

      /* textarea 내부 스크롤 먼저 처리 */
      if (nestedTextarea) {
        const target = e.target;
        const ta =
          target instanceof Element ? target.closest("textarea") : null;

        if (ta instanceof HTMLTextAreaElement) {
          const tMax = Math.max(0, ta.scrollHeight - ta.clientHeight);
          if (tMax > 0) {
            const tScroll = ta.scrollTop;
            const taCanUp = tScroll > 0.5;
            const taCanDown = tScroll < tMax - 0.5;
            if ((dy > 0 && taCanDown) || (dy < 0 && taCanUp)) {
              ta.scrollTop = Math.max(0, Math.min(tMax, tScroll + dy));
              e.preventDefault();
              e.stopPropagation();
              return;
            }
          }
        }
      }

      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);
      if (maxScroll <= 0) return;

      const canUp = scrollTop > 0.5;
      const canDown = scrollTop < maxScroll - 0.5;

      if ((dy > 0 && canDown) || (dy < 0 && canUp)) {
        el.scrollTop = Math.max(0, Math.min(maxScroll, scrollTop + dy));
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []); // ref는 변하지 않으므로 deps 불필요
}
