"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { CardTiltInner, CardTiltScene } from "./CardBundleGrid.style";

const MAX_TILT_X = 12;
const MAX_TILT_Y = 14;
const HOVER_SCALE = 1.05;

const SPRING = { stiffness: 220, damping: 18, mass: 0.6 };

type CardTiltProps = {
  children: ReactNode;
  lifted: boolean;
  onLiftChange: (lifted: boolean) => void;
  /** 상세가 열려 있으면 호버를 끄고 더 이상 기울이지 않는다 */
  hoverSuspended?: boolean;
  /** 금빛 글로. 그리드는 켜고 상세는 끈다 */
  glow?: boolean;
};

/**
 * 그리드·상세 카드 — 마우스 위치에 따라 살짝 기울인다. 상단 묶음에는 쓰지 않는다.
 */
export default function CardTilt({
  children,
  lifted,
  onLiftChange,
  hoverSuspended = false,
  glow = true,
}: CardTiltProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const blockUntilLeaveRef = useRef(false);
  const [hoverCapable, setHoverCapable] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);
  const springX = useSpring(rotateX, SPRING);
  const springY = useSpring(rotateY, SPRING);
  const springScale = useSpring(scale, SPRING);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setHoverCapable(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!hoverSuspended) return;
    blockUntilLeaveRef.current = true;
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    onLiftChange(false);
  }, [hoverSuspended, onLiftChange, rotateX, rotateY, scale]);

  const resetTilt = () => {
    blockUntilLeaveRef.current = false;
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    onLiftChange(false);
  };

  return (
    <CardTiltScene
      ref={sceneRef}
      onMouseEnter={() => {
        if (
          !hoverCapable ||
          hoverSuspended ||
          blockUntilLeaveRef.current
        ) {
          return;
        }
        scale.set(HOVER_SCALE);
        onLiftChange(true);
      }}
      onMouseMove={(event) => {
        if (!hoverCapable || hoverSuspended || sceneRef.current == null)
          return;
        const rect = sceneRef.current.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) return;
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        rotateY.set(nx * MAX_TILT_Y * 2);
        rotateX.set(-ny * MAX_TILT_X * 2);
      }}
      onMouseLeave={resetTilt}
    >
      <CardTiltInner
        $lifted={lifted}
        $glow={glow}
        style={{
          rotateX: springX,
          rotateY: springY,
          scale: springScale,
          originX: 0.5,
          originY: 0.5,
        }}
      >
        {children}
      </CardTiltInner>
    </CardTiltScene>
  );
}
