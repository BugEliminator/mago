"use client";

import { useEffect, useRef } from "react";
import { WarpLayerRoot, WarpCanvas } from "./WarpSpeedBackground.style";
import {
  WARP_CLEAR_COLOR,
  WARP_DPR_MAX,
  WARP_NUM_STARS_DESKTOP,
  WARP_NUM_STARS_NARROW,
  WARP_SPEED,
} from "./warpConstants";

const NARROW_BP = 768;

class Star {
  x = 0;
  y = 0;
  z = 0;
  size = 0;

  constructor(
    private cw: number,
    private ch: number
  ) {
    this.reset();
  }

  setDimensions(cw: number, ch: number) {
    this.cw = cw;
    this.ch = ch;
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

function pickStarCount(width: number): number {
  return width < NARROW_BP ? WARP_NUM_STARS_NARROW : WARP_NUM_STARS_DESKTOP;
}

/**
 * 랜딩 전용: 3D 투영 스타필드(워프) 캔버스 — public `SpaceBackground`는 정적/깜빡임용
 */
export default function WarpSpeedBackground() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let animationId = 0;
    let logicalW = 0;
    let logicalH = 0;

    const syncCanvasSize = () => {
      const w = Math.max(1, wrap.clientWidth);
      const h = Math.max(1, wrap.clientHeight);
      const dpr = Math.min(
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
        WARP_DPR_MAX
      );
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      logicalW = w;
      logicalH = h;
    };

    const buildStars = () => {
      const n = pickStarCount(logicalW);
      stars = [];
      for (let i = 0; i < n; i += 1) {
        const s = new Star(logicalW, logicalH);
        stars.push(s);
      }
    };

    const resize = () => {
      syncCanvasSize();
      const target = pickStarCount(logicalW);
      if (stars.length === 0) {
        buildStars();
        return;
      }
      if (target !== stars.length) {
        buildStars();
        return;
      }
      for (const s of stars) {
        s.setDimensions(logicalW, logicalH);
        s.reset();
      }
    };

    const drawFrame = () => {
      if (logicalW < 1 || logicalH < 1) {
        animationId = requestAnimationFrame(drawFrame);
        return;
      }
      ctx.fillStyle = WARP_CLEAR_COLOR;
      ctx.fillRect(0, 0, logicalW, logicalH);
      for (const star of stars) {
        star.update();
        star.draw(ctx);
      }
      animationId = requestAnimationFrame(drawFrame);
    };

    syncCanvasSize();
    buildStars();
    resize();
    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(wrap);
    drawFrame();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <WarpLayerRoot ref={wrapRef} aria-hidden>
      <WarpCanvas ref={canvasRef} />
    </WarpLayerRoot>
  );
}
