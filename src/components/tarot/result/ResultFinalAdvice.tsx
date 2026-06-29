"use client";

import { Scroll } from "lucide-react";
import type { TarotResultFinalAdviceProps } from "@/types/tarotResult";
import { Panel, PanelTitle, Quote } from "./ResultFinalAdvice.style";

/**
 * 결과 하단 — 마고의 마무리 조언(다크 카드)
 */
export default function ResultFinalAdvice({
  adviceText,
}: TarotResultFinalAdviceProps) {
  return (
    <Panel aria-labelledby="tarot-result-final-advice-heading">
      <PanelTitle id="tarot-result-final-advice-heading">
        <Scroll size={22} aria-hidden />
        마고의 마무리 조언
      </PanelTitle>
      <Quote>{adviceText}</Quote>
    </Panel>
  );
}
