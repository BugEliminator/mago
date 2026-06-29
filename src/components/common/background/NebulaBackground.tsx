"use client";

import { useEffect, useRef, useState } from "react";
import { NebulaLayerRoot } from "./NebulaBackground.style";

/** 성운 파티클 수 */
const NEBULA_PARTICLE_COUNT = 80;
/** 별 수 */
const STAR_COUNT = 180;
/** DPR 상한 */
const DPR_MAX = 2;
/** 스냅샷 시 약간 여유를 두어 cover 시 품질 저하 완화 */
const SNAPSHOT_SUPER_SAMPLE = 1.35;

/** 항성 분광형별 색상 팔레트 */
const SPECTRAL_PALETTE: HslColor[] = [
  { h: 220, s: 90, l: 85 },
  { h: 200, s: 80, l: 90 },
  { h: 0, s: 0, l: 100 },
  { h: 50, s: 40, l: 95 },
  { h: 60, s: 80, l: 90 },
  { h: 30, s: 90, l: 80 },
  { h: 0, s: 95, l: 75 },
];

interface HslColor {
  h: number;
  s: number;
  l: number;
}

/** 성운 가스 파티클 */
class NebulaParticle {
  nx: number;
  ny: number;
  x: number;
  y: number;
  baseRadiusRatio: number;
  radius: number;
  colorBase: HslColor;
  opacity: number;
  vNX: number;
  vNY: number;
  pulse: number;
  pulseSpeed: number;
  pulseAmpRatio: number;

  constructor(
    private w: number,
    private h: number
  ) {
    this.nx = 0;
    this.ny = 0;
    this.x = 0;
    this.y = 0;
    this.baseRadiusRatio = 0;
    this.radius = 0;
    this.colorBase = { h: 0, s: 0, l: 0 };
    this.opacity = 0;
    this.vNX = 0;
    this.vNY = 0;
    this.pulse = 0;
    this.pulseSpeed = 0;
    this.pulseAmpRatio = 0;
    this.init();
  }

  setDimensions(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.syncDerived();
  }

  private syncDerived() {
    this.x = this.nx * this.w;
    this.y = this.ny * this.h;
    const minDim = Math.max(1, Math.min(this.w, this.h));
    const baseRadius = this.baseRadiusRatio * minDim;
    const amp = this.pulseAmpRatio * minDim;
    this.radius = baseRadius + Math.sin(this.pulse) * amp;
  }

  init() {
    this.nx = Math.random();
    this.ny = Math.random();
    this.x = this.nx * this.w;
    this.y = this.ny * this.h;

    const minDim = Math.max(1, Math.min(this.w, this.h));
    const baseRadius = Math.random() * 400 + 200;
    this.baseRadiusRatio = baseRadius / minDim;
    this.pulseAmpRatio = 40 / minDim;
    this.radius = baseRadius;

    const nebulaColors: HslColor[] = [
      { h: 280, s: 85, l: 12 },
      { h: 345, s: 90, l: 15 },
      { h: 165, s: 95, l: 10 },
      { h: 195, s: 90, l: 12 },
      { h: 260, s: 70, l: 8 },
    ];

    this.colorBase = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
    this.opacity = Math.random() * 0.2 + 0.1;
    const vX = (Math.random() - 0.5) * 0.08;
    const vY = (Math.random() - 0.5) * 0.08;
    this.vNX = this.w > 0 ? vX / this.w : 0;
    this.vNY = this.h > 0 ? vY / this.h : 0;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.0015 + 0.0005;
  }

  update() {
    this.nx += this.vNX;
    this.ny += this.vNY;
    this.pulse += this.pulseSpeed;

    const rx = this.w > 0 ? this.radius / this.w : 0;
    const ry = this.h > 0 ? this.radius / this.h : 0;
    if (this.nx < -rx) this.nx = 1 + rx;
    if (this.nx > 1 + rx) this.nx = -rx;
    if (this.ny < -ry) this.ny = 1 + ry;
    if (this.ny > 1 + ry) this.ny = -ry;

    this.syncDerived();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );
    const { h, s, l } = this.colorBase;
    gradient.addColorStop(0, `hsla(${h}, ${s}%, ${l}%, ${this.opacity})`);
    gradient.addColorStop(0.4, `hsla(${h}, ${s}%, ${l}%, ${this.opacity * 0.5})`);
    gradient.addColorStop(1, `hsla(${h}, ${s}%, ${l}%, 0)`);

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** 반짝이는 별 파티클 */
class NebulaStar {
  nx: number;
  ny: number;
  x: number;
  y: number;
  color: HslColor;
  size: number;
  blink: number;
  blinkSpeed: number;
  maxOpacity: number;
  hasGlow: boolean;

  constructor(
    private w: number,
    private h: number
  ) {
    this.nx = 0;
    this.ny = 0;
    this.x = 0;
    this.y = 0;
    this.color = { h: 0, s: 0, l: 0 };
    this.size = 0;
    this.blink = 0;
    this.blinkSpeed = 0;
    this.maxOpacity = 0;
    this.hasGlow = false;
    this.init();
  }

  setDimensions(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.x = this.nx * this.w;
    this.y = this.ny * this.h;
  }

  init() {
    this.nx = Math.random();
    this.ny = Math.random();
    this.x = this.nx * this.w;
    this.y = this.ny * this.h;
    this.color = SPECTRAL_PALETTE[Math.floor(Math.random() * SPECTRAL_PALETTE.length)];

    const sizeBase = Math.random();
    this.size = sizeBase > 0.9
      ? Math.random() * 1.2 + 1.0
      : Math.random() * 0.8 + 0.2;

    this.blink = Math.random() * Math.PI * 2;
    this.blinkSpeed = Math.random() * 0.01 + 0.005;
    this.maxOpacity = Math.random() * 0.6 + 0.4;
    this.hasGlow = this.size > 1.8;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.x = this.nx * this.w;
    this.y = this.ny * this.h;
    const opacity = ((Math.sin(this.blink) + 1) / 2) * this.maxOpacity + 0.1;
    const { h, s, l } = this.color;

    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    if (this.hasGlow) {
      const glowGradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 4
      );
      glowGradient.addColorStop(0, `hsla(${h}, ${s}%, ${l}%, ${opacity * 0.3})`);
      glowGradient.addColorStop(1, `hsla(${h}, ${s}%, ${l}%, 0)`);
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** NebulaBackground 선택적 동작 */
export type NebulaBackgroundProps = {
  /** 스냅샷이 적용되면 1회 */
  onSnapshotReady?: () => void;
};

/**
 * 리딩 페이지 전용 성운 배경.
 * 캔버스는 DOM에 두지 않고 1회 렌더 후 CSS background-image로 올려,
 * 리사이즈 시 비트맵 재할당 없이 브라우저가 cover 스케일만 수행합니다.
 */
export default function NebulaBackground({
  onSnapshotReady,
}: NebulaBackgroundProps = {}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const onReadyRef = useRef(onSnapshotReady);
  onReadyRef.current = onSnapshotReady;

  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let cancelled = false;
    let rafId = 0;

    const notifyReady = () => {
      queueMicrotask(() => {
        if (!cancelled) onReadyRef.current?.();
      });
    };

    const renderSnapshotToCssBackground = () => {
      const cssW = wrap.clientWidth;
      const cssH = wrap.clientHeight;
      if (cssW < 1 || cssH < 1) {
        rafId = window.requestAnimationFrame(renderSnapshotToCssBackground);
        return;
      }

      const off = document.createElement("canvas");
      const ctx = off.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio ?? 1, DPR_MAX);
      const pixelW = Math.max(1, Math.ceil(cssW * dpr * SNAPSHOT_SUPER_SAMPLE));
      const pixelH = Math.max(1, Math.ceil(cssH * dpr * SNAPSHOT_SUPER_SAMPLE));
      off.width = pixelW;
      off.height = pixelH;
      ctx.setTransform(pixelW / cssW, 0, 0, pixelH / cssH, 0, 0);

      const particles: NebulaParticle[] = [];
      const stars: NebulaStar[] = [];
      for (let i = 0; i < NEBULA_PARTICLE_COUNT; i++) {
        particles.push(new NebulaParticle(cssW, cssH));
      }
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new NebulaStar(cssW, cssH));
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000103";
      ctx.fillRect(0, 0, cssW, cssH);
      for (const p of particles) p.draw(ctx);
      for (const star of stars) star.draw(ctx);

      off.toBlob((blob) => {
        if (cancelled || !blob) return;
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = null;
        }
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setBackgroundImage(`url(${url})`);

        notifyReady();
      }, "image/png");
    };

    renderSnapshotToCssBackground();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  return (
    <NebulaLayerRoot
      ref={wrapRef}
      aria-hidden
      style={
        backgroundImage !== undefined
          ? { backgroundImage, backgroundSize: "cover", backgroundPosition: "50% 50%" }
          : undefined
      }
    />
  );
}
