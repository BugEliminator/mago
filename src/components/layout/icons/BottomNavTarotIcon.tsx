import type { SVGProps } from "react";

type BottomNavTarotIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  strokeWidth?: number;
};

/**
 * 하단 nav 「타로」 — Lucide 톤 3장 부채꼴 카드
 */
export default function BottomNavTarotIcon({
  size = 20,
  strokeWidth = 2,
  ...props
}: BottomNavTarotIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* 뒤·좌 */}
      <rect
        x="2.5"
        y="6.5"
        width="7"
        height="12.5"
        rx="1.25"
        transform="rotate(-16 6 12.75)"
      />
      {/* 뒤·우 */}
      <rect
        x="14.5"
        y="6.5"
        width="7"
        height="12.5"
        rx="1.25"
        transform="rotate(16 18 12.75)"
      />
      {/* 앞·중앙 */}
      <rect x="8" y="4.5" width="8" height="15" rx="1.25" />
    </svg>
  );
}
