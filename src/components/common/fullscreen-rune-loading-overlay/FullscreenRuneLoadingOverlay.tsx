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

/** 기본 룬 로띠 — 이후 페이지별 다른 json을 `lottiePath`로 넘기면 됨 */
export const DEFAULT_RUNE_LOADING_LOTTIE_PATH = "/lottie/rune-loading.json";

export type FullscreenRuneLoadingOverlayProps = {
  /** 한 줄 안내 문구 */
  caption: React.ReactNode;
  /** 스크린 리더용 전체 설명 */
  ariaLabel: string;
  ariaBusy?: boolean;
  zIndex?: number;
  /** 로띠 JSON 경로 — 미지정 시 기본 룬 */
  lottiePath?: string;
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
  lottiePath = DEFAULT_RUNE_LOADING_LOTTIE_PATH,
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
              path={lottiePath}
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
