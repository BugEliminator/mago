"use client";

import type { HTMLMotionProps } from "framer-motion";
import Lottie from "react-lottie-player";
import {
  Caption,
  FullscreenRuneLoadingBackdropMotion,
  LoadingStack,
  LottieTint,
  LottieWrap,
} from "./FullscreenRuneLoadingOverlay.style";

type DivMotion = HTMLMotionProps<"div">;

export type FullscreenRuneLoadingOverlayProps = {
  /** 한 줄 안내 문구 */
  caption: React.ReactNode;
  /** 스크린 리더용 전체 설명 */
  ariaLabel: string;
  ariaBusy?: boolean;
  zIndex?: number;
  initial?: DivMotion["initial"];
  animate?: DivMotion["animate"];
  transition?: DivMotion["transition"];
  onAnimationComplete?: DivMotion["onAnimationComplete"];
};

/**
 * 검정 배경 + 룬 로딩 로띠 + 금색 캡션 — 리딩 부트·해석 대기 등 공통 풀스크린
 */
export default function FullscreenRuneLoadingOverlay({
  caption,
  ariaLabel,
  ariaBusy = true,
  zIndex = 50,
  initial,
  animate,
  transition,
  onAnimationComplete,
}: FullscreenRuneLoadingOverlayProps) {
  return (
    <FullscreenRuneLoadingBackdropMotion
      $zIndex={zIndex}
      role="status"
      aria-live="polite"
      aria-busy={ariaBusy}
      aria-label={ariaLabel}
      initial={initial}
      animate={animate}
      transition={transition}
      onAnimationComplete={onAnimationComplete}
    >
      <LoadingStack>
        <LottieWrap>
          <LottieTint>
            <Lottie
              path="/lottie/rune-loading.json"
              loop
              play
              style={{ width: "100%", height: "100%" }}
            />
          </LottieTint>
        </LottieWrap>
        <Caption>{caption}</Caption>
      </LoadingStack>
    </FullscreenRuneLoadingBackdropMotion>
  );
}
