"use client";

import { useEffect, useRef } from "react";
import { WarpLayerRoot, WarpCanvas } from "./WarpSpeedBackground.style";
import { MOBILE_MAX_PX } from "@/lib/layout";
import {
  WARP_CLEAR_COLOR,
  WARP_DPR_MAX,
  WARP_NUM_STARS_DESKTOP,
  WARP_NUM_STARS_NARROW,
  WARP_SPEED,
} from "./warpConstants";

class Star {
  x = 0;
  y = 0;
  z = 0;
  size = 0;

  constructor(
    private cw: number,
    private ch: number,
  ) {
    this.reset();
  }

  reset() {
    this.x = (Math.random() - 0.5) * this.cw * 2;
    this.y = (Math.random() - 0.5) * this.ch * 2;
    this.z = Math.random() * this.cw;
    this.size = Math.random() * 1.5 + 0.5;
  }

  update() {
    this.z -= WARP_SPEED;
    if (this.z < 1) {
      this.reset();
      this.z = this.cw;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { cw, ch } = this;
    const cx = cw / 2;
    const cy = ch / 2;
    const sx = (this.x / this.z) * cw + cx;
    const sy = (this.y / this.z) * cw + cy;
    if (sx < 0 || sx > cw || sy < 0 || sy > ch) return;
    const r = (1 - this.z / cw) * this.size * 2;
    const opacity = 1 - this.z / cw;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.max(0.15, r), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fill();
  }
}

function pickStarCount(viewportWidth: number): number {
  return viewportWidth <= MOBILE_MAX_PX
    ? WARP_NUM_STARS_NARROW
    : WARP_NUM_STARS_DESKTOP;
}

/**
 * 랜딩 전용: 3D 투영 스타필드(워프) 캔버스
 * — 마운트 시 뷰포트 크기로 1회 초기화, 리사이즈 시 재생성하지 않음
 */
export default function WarpSpeedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /** 뷰포트 기준 1회 고정 — 너비 변경 시 캔버스·별 재초기화 없음 */
    const logicalW = Math.max(1, window.innerWidth);
    const logicalH = Math.max(1, window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, WARP_DPR_MAX);

    canvas.width = Math.floor(logicalW * dpr);
    canvas.height = Math.floor(logicalH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const stars: Star[] = [];
    const starCount = pickStarCount(logicalW);
    for (let i = 0; i < starCount; i += 1) {
      stars.push(new Star(logicalW, logicalH));
    }

    let animationId = 0;

    const drawFrame = () => {
      ctx.fillStyle = WARP_CLEAR_COLOR;
      ctx.fillRect(0, 0, logicalW, logicalH);
      for (const star of stars) {
        star.update();
        star.draw(ctx);
      }
      animationId = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <WarpLayerRoot aria-hidden>
      <WarpCanvas ref={canvasRef} />
    </WarpLayerRoot>
  );
}
