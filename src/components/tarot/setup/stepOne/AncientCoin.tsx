import { useId } from "react";

/** 복채를 상징하는 엽전 SVG입니다. */
export default function AncientCoin() {
  const id = useId();
  const goldFaceId = `${id}-gold-face`;
  const goldSideId = `${id}-gold-side`;
  const grainId = `${id}-grain`;

  return (
    <svg viewBox="0 0 100 115" role="img" aria-label="엽전">
      <defs>
        <linearGradient id={goldFaceId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff2ac" />
          <stop offset="30%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#916f05" />
        </linearGradient>
        <linearGradient id={goldSideId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#916f05" />
          <stop offset="40%" stopColor="#b8860b" />
          <stop offset="100%" stopColor="#3d2d01" />
        </linearGradient>
        <filter id={grainId} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 0.15 0"
          />
        </filter>
      </defs>
      <ellipse cx="50" cy="58" rx="48" ry="46" fill="#3d2d01" />
      <ellipse cx="50" cy="56" rx="48" ry="46" fill={`url(#${goldSideId})`} />
      <circle
        cx="50"
        cy="50"
        r="48"
        fill={`url(#${goldFaceId})`}
        stroke="#5c4402"
        strokeWidth="0.5"
      />
      <circle
        cx="50"
        cy="50"
        r="48"
        filter={`url(#${grainId})`}
        opacity="0.4"
      />
      <circle
        cx="50"
        cy="50"
        r="39"
        fill="none"
        stroke="#4a3200"
        strokeWidth="1.2"
      />
      <circle
        cx="50"
        cy="49"
        r="39"
        fill="none"
        stroke="#fff2ac"
        strokeWidth="0.8"
        opacity="0.45"
      />
      <rect x="32" y="36" width="36" height="36" rx="1" fill="#3d2d01" />
      <rect x="32" y="32" width="36" height="36" rx="1" fill="#0a0c10" />
      <rect
        x="32"
        y="32"
        width="36"
        height="36"
        rx="1"
        fill="none"
        stroke="#5c4402"
        strokeWidth="1"
      />
      <g fill="#5c4402" opacity="0.7">
        <path d="M46 12h8v2h-8zM49 10h2v6h-2z" />
        <path d="M46 86h8v2h-8zM49 84h2v6h-2z" />
        <path d="M12 46h2v8h-2zM10 49h6v2h-6z" />
        <path d="M86 46h2v8h-2zM84 49h6v2h-6z" />
      </g>
    </svg>
  );
}
