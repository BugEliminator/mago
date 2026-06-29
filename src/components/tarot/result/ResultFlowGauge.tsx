"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Percent } from "lucide-react";
import { getFortuneFlowScoreTheme } from "@/lib/fortuneFlowScoreTheme";
import {
  DonutCenter,
  DonutScore,
  DonutScoreUnit,
  DonutScoreValue,
  DonutStatusBadge,
  DonutSvg,
  DonutWrap,
  GaugeCard,
  GaugeCopyColumn,
  GaugeDescription,
  GaugeTitle,
  GaugeVisualColumn,
} from "./ResultFlowGauge.style";

const DONUT_RADIUS = 42;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
const DONUT_TRACK_STROKE = "#e8eaf6";
const COUNT_UP_MS = 600;

type ResultFlowGaugeProps = {
  /** 0~100 — LLM·DB 연동 전 퍼블리싱용 목값 */
  score: number;
};

/**
 * 운세 흐름 지수 — 좌: 제목·설명 / 우: 도넛 게이지 (가로 카드)
 */
export default function ResultFlowGauge({ score }: ResultFlowGaugeProps) {
  const glowFilterId = useId().replace(/:/g, "");
  const clampedScore = Math.min(100, Math.max(0, score));
  const theme = getFortuneFlowScoreTheme(clampedScore);
  const [animatedScore, setAnimatedScore] = useState(0);
  const animStartRef = useRef(0);

  useEffect(() => {
    const start = animStartRef.current;
    const end = clampedScore;
    if (start === end) return;

    const range = end - start;
    let startTime: number | null = null;
    let frameId = 0;

    const step = (timestamp: number) => {
      if (startTime == null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / COUNT_UP_MS, 1);
      setAnimatedScore(Math.floor(start + range * progress));
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      } else {
        animStartRef.current = end;
      }
    };

    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [clampedScore]);

  const strokeDashoffset =
    DONUT_CIRCUMFERENCE - (animatedScore / 100) * DONUT_CIRCUMFERENCE;

  return (
    <GaugeCard
      aria-label={`운세 흐름 지수 ${clampedScore}퍼센트, ${theme.label}, ${theme.description}`}
    >
      <GaugeCopyColumn>
        <GaugeTitle>운세 흐름 지수</GaugeTitle>
        <GaugeDescription>{theme.description}</GaugeDescription>
      </GaugeCopyColumn>

      <GaugeVisualColumn aria-hidden>
        <DonutWrap>
          <DonutSvg viewBox="0 0 100 100">
            <defs>
              <filter
                id={glowFilterId}
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <circle
              cx="50"
              cy="50"
              r={DONUT_RADIUS}
              stroke={DONUT_TRACK_STROKE}
              strokeWidth="6.5"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={DONUT_RADIUS}
              stroke={theme.color}
              strokeWidth="6.5"
              fill="transparent"
              strokeDasharray={DONUT_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              filter={`url(#${glowFilterId})`}
              style={{
                transition:
                  "stroke-dashoffset 0.8s cubic-bezier(0.1, 0.8, 0.2, 1), stroke 0.5s ease-in-out",
              }}
            />
          </DonutSvg>

          <DonutCenter>
            <DonutScore>
              <DonutScoreValue $color={theme.color}>
                {animatedScore}
              </DonutScoreValue>
              <DonutScoreUnit>
                <Percent size={12} strokeWidth={2.5} aria-hidden />
              </DonutScoreUnit>
            </DonutScore>
            <DonutStatusBadge $color={theme.color}>
              {theme.label}
            </DonutStatusBadge>
          </DonutCenter>
        </DonutWrap>
      </GaugeVisualColumn>
    </GaugeCard>
  );
}
