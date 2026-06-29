import type { ReactNode } from "react";
import { Hourglass, Loader2, Sparkles } from "lucide-react";

/** 아이콘 래퍼 — 골드 단색 톤 통일 */
function IconWrap({ children }: { children: ReactNode }) {
  return <span className="mago-toast-icon">{children}</span>;
}

/** MAGO 로고 포인트 골드 — 얇은 라인 조각 느낌 */
const MAGO_GOLD = "#d68d33";
const SW_OUT = 0.55;
const SW_IN = 0.45;

/** 타로 카드 공통 프레임 — 이중 테두리 + 코너 장식 점 */
function TarotCardFrame() {
  return (
    <>
      <rect
        x="2"
        y="1.5"
        width="40"
        height="53"
        rx="2"
        stroke={MAGO_GOLD}
        strokeWidth={SW_OUT}
      />
      <rect
        x="5.5"
        y="5"
        width="33"
        height="46"
        rx="1.35"
        stroke={MAGO_GOLD}
        strokeWidth={SW_IN}
      />
      {[
        [6.8, 6.3],
        [37.2, 6.3],
        [6.8, 49.7],
        [37.2, 49.7],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.85" fill={MAGO_GOLD} />
      ))}
    </>
  );
}

/**
 * 성공 — 타로 카드 뒷면 스타일 (전지 눈 + 12방향 광선)
 * 레퍼런스: 이중 프레임 · 코너 점 · 중앙 안목 · 상/하 장식 광선
 */
function TarotEyeIcon() {
  const cx = 22;
  const cy = 28;
  const rays: Array<{ x2: number; y2: number }> = [];
  for (let k = 0; k < 12; k++) {
    const ang = (k * Math.PI) / 6;
    const long = k % 3 === 0;
    let L = long ? 10.2 : 5.4;
    if (long && (k === 0 || k === 6)) {
      L = 8.6;
    }
    const x2 = cx + L * Math.sin(ang);
    const y2 = cy - L * Math.cos(ang);
    rays.push({ x2, y2 });
  }

  return (
    <svg
      width={26}
      height={33}
      viewBox="0 0 44 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <TarotCardFrame />
      {/* 광선 — 눈보다 먼저 그려 중심에서 퍼짐 */}
      {rays.map((r, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={Number(r.x2.toFixed(2))}
          y2={Number(r.y2.toFixed(2))}
          stroke={MAGO_GOLD}
          strokeWidth={SW_IN}
          strokeLinecap="round"
        />
      ))}
      {/* 상·하 장광선 끝 포인트 */}
      <circle cx="22" cy="17.25" r="0.55" fill={MAGO_GOLD} />
      <circle cx="22" cy="38.75" r="0.55" fill={MAGO_GOLD} />
      {/* 안목(아몬드) */}
      <path
        d="M22 23.2c-4.2 0-7 2.9-7.2 4.8.15 1.9 3 4.8 7.2 4.8s7.05-2.9 7.2-4.8c-.2-1.9-3-4.8-7.2-4.8z"
        fill="none"
        stroke={MAGO_GOLD}
        strokeWidth={SW_IN}
        strokeLinejoin="round"
      />
      {/* 홍채 */}
      <circle
        cx="22"
        cy="28"
        r="2.65"
        fill="none"
        stroke={MAGO_GOLD}
        strokeWidth={SW_IN}
      />
      {/* 동공 내 초승달(라인) */}
      <path
        d="M 20.15 27.35 A 1.85 1.85 0 0 1 20.15 28.65"
        stroke={MAGO_GOLD}
        strokeWidth={SW_IN}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 에러 — 동일 카드 프레임 + 중앙 X
 */
function CardXIcon() {
  return (
    <svg
      width={26}
      height={33}
      viewBox="0 0 44 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <TarotCardFrame />
      <path
        d="M17.5 22.5l9 11M26.5 22.5l-9 11"
        stroke={MAGO_GOLD}
        strokeWidth={SW_IN}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 타로 카드(눈) — 일반 toast에 직접 붙일 때 재사용 */
export function TarotCardToastIcon() {
  return (
    <IconWrap>
      <TarotEyeIcon />
    </IconWrap>
  );
}

/** Sonner `icons` prop용 MAGO 전용 아이콘 세트 */
export const magoToastIcons = {
  success: (
    <IconWrap>
      <TarotEyeIcon />
    </IconWrap>
  ),
  error: (
    <IconWrap>
      <CardXIcon />
    </IconWrap>
  ),
  warning: (
    <IconWrap>
      <Hourglass size={20} strokeWidth={1} aria-hidden />
    </IconWrap>
  ),
  info: (
    <IconWrap>
      <Sparkles size={20} strokeWidth={1} aria-hidden />
    </IconWrap>
  ),
  loading: (
    <IconWrap>
      <Loader2
        size={20}
        strokeWidth={1}
        className="mago-toast-loader"
        aria-hidden
      />
    </IconWrap>
  ),
};
