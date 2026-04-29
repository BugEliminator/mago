"use client";

import { useMemo } from "react";
import {
  SpaceLayerRoot,
  BaseFill,
  DeepAuraLayer,
  StarfieldRoot,
  StarDot,
} from "./SpaceBackground.style";

const STAR_COUNT = 30;

type StarConfig = {
  id: number;
  size: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
};

function createStarConfig(): StarConfig[] {
  return Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    size: 1 + Math.random() * 3,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 2,
  }));
}

/**
 * 야간 우주 풀스크린 배경 — 베이스, 딥 오라, 별(마운트 시 1회 생성 후 고정)
 */
export default function SpaceBackground() {
  const stars = useMemo(() => createStarConfig(), []);

  return (
    <SpaceLayerRoot aria-hidden>
      <BaseFill />
      <DeepAuraLayer />
      <StarfieldRoot>
        {stars.map((s) => (
          <StarDot
            key={s.id}
            $size={s.size}
            $top={s.top}
            $left={s.left}
            $duration={s.duration}
            $delay={s.delay}
          />
        ))}
      </StarfieldRoot>
    </SpaceLayerRoot>
  );
}
