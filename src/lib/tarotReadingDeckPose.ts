import type { CardPose } from "@/types/tarotReadingDeck";
import {
  CARDS_PER_ROW,
  SPREAD_COL_SPACING,
  SPREAD_MS_CENTER,
  SPREAD_MS_ROW_FAN,
  SPREAD_ORIGIN_X,
  SPREAD_ROW_CENTER,
  SPREAD_ROW_FAN_STAGGER_MS,
  SPREAD_ROW_SPACING,
  SPREAD_SLIDE_COL_STAGGER_MS,
  SPREAD_SLIDE_DURATION_MS,
  SPREAD_SLIDE_LEAD_PX,
  SPREAD_SLIDE_ROW_START_GAP_MS,
} from "@/lib/tarotReadingDeckConstants";

export function getBasePose(indexInDeck: number): CardPose {
  return {
    x: 0,
    y: 0,
    rotateDeg: (indexInDeck % 10) - 5,
    scale: 1,
    zIndex: indexInDeck,
    durationMs: 0,
    delayMs: 0,
  };
}

export function poseDiffuseFromCenter(base: CardPose): CardPose {
  return {
    ...base,
    durationMs: 700,
    delayMs: 0,
    x: (Math.random() - 0.5) * 1000,
    y: (Math.random() - 0.5) * 620,
    rotateDeg: Math.random() * 740 - 420,
    scale: 1.05,
  };
}

export function poseReturnToCenter(indexInDeck: number): CardPose {
  return {
    ...getBasePose(indexInDeck),
    durationMs: 1100,
    delayMs: Math.floor(indexInDeck * 2),
  };
}

export function spreadRowY(row: number): number {
  return (row - SPREAD_ROW_CENTER) * SPREAD_ROW_SPACING;
}

/** 1단계: 무대 정중앙 덱 */
export function poseSpreadCenterStack(indexFromTop: number): CardPose {
  return {
    x: 0,
    y: 0,
    rotateDeg: 0,
    scale: 1,
    durationMs: SPREAD_MS_CENTER,
    delayMs: 0,
    zIndex: indexFromTop,
  };
}

/** 2단계: 행 슬롯으로 세로 벌림 */
export function poseSpreadRowAnchors(indexFromTop: number): CardPose {
  const row = Math.floor(indexFromTop / CARDS_PER_ROW);
  const anchorX = SPREAD_ORIGIN_X - SPREAD_SLIDE_LEAD_PX;
  return {
    x: anchorX,
    y: spreadRowY(row),
    rotateDeg: 0,
    scale: 1,
    durationMs: SPREAD_MS_ROW_FAN,
    delayMs: Math.floor(row * SPREAD_ROW_FAN_STAGGER_MS),
    zIndex: indexFromTop,
  };
}

/** 3단계: 최종 그리드 열 */
export function poseSlideToGrid(indexFromTop: number): CardPose {
  const row = Math.floor(indexFromTop / CARDS_PER_ROW);
  const col = indexFromTop % CARDS_PER_ROW;
  const rowDelayMs = Math.floor(row * SPREAD_SLIDE_ROW_START_GAP_MS);
  const colDelayMs = Math.floor(
    (CARDS_PER_ROW - 1 - col) * SPREAD_SLIDE_COL_STAGGER_MS,
  );

  return {
    x: SPREAD_ORIGIN_X + col * SPREAD_COL_SPACING,
    y: spreadRowY(row),
    rotateDeg: 0,
    scale: 1,
    durationMs: SPREAD_SLIDE_DURATION_MS,
    delayMs: rowDelayMs + colDelayMs,
    zIndex: indexFromTop,
  };
}

/** 스프레드 애니 종료 후 전환 정리 */
export function poseAfterSpreadMotionSettled(pose: CardPose): CardPose {
  return { ...pose, durationMs: 0, delayMs: 0 };
}
