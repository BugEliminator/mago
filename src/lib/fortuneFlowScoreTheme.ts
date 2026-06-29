/** 운세 흐름 지수 — 점수 구간별 표시 테마 */
export type FortuneFlowScoreTheme = {
  color: string;
  label: string;
  /** 구간별 한 줄 설명 — 게이지 하단에 표시 */
  description: string;
};

/** 80+ 구간만 theme `accent.gold` (#f9a825) — 나머지 UI 골드(#d4af37)와 분리 */
const FLOW_GOLD = "#f9a825";
const FLOW_INDIGO = "#5a67d8";
const FLOW_LIME = "#84cc16";
const FLOW_ROSE = "#e53e3e";

/**
 * 0~100 점수에 따른 링·뱃지 색·라벨·설명
 * 80+ 매우 긍정 · 50~79 안정/정체 · 26~49 흐름 준비 · ~25 조율 필요
 */
export function getFortuneFlowScoreTheme(score: number): FortuneFlowScoreTheme {
  if (score >= 80) {
    return {
      color: FLOW_GOLD,
      label: "매우 긍정",
      description: "운명의 흐름이 긍정적인 방향을 가리키고 있어요.",
    };
  }
  if (score >= 50) {
    return {
      color: FLOW_INDIGO,
      label: "안정/정체",
      description: "큰 변화보다는 안정과 균형을 지키는 시기예요.",
    };
  }
  if (score >= 26) {
    return {
      color: FLOW_LIME,
      label: "흐름 준비",
      description: "아직 준비 단계지만, 흐름이 서서히 자리 잡고 있어요.",
    };
  }
  return {
    color: FLOW_ROSE,
    label: "조율 필요",
    description: "지금은 방향을 다시 맞추고 에너지를 조율할 때예요.",
  };
}
