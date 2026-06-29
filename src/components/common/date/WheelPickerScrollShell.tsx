"use client";

import type { ReactNode } from "react";
import { WheelPickerShell } from "./PickerWheel.style";
import { useWheelStepPicker } from "./useWheelStepPicker";

type WheelPickerScrollShellProps = {
  items: readonly string[];
  value: string;
  onValueChange: (next: string) => void;
  disabled?: boolean;
  children: ReactNode;
};

/**
 * 델타 누적 기반 휠 스크롤을 제공하는 Picker 셸
 * — 내부 Picker는 wheelMode="off" 로 두고 이 셸에서 1칸씩 이동 처리
 */
export default function WheelPickerScrollShell({
  items,
  value,
  onValueChange,
  disabled = false,
  children,
}: WheelPickerScrollShellProps) {
  const shellRef = useWheelStepPicker({
    items,
    value,
    onValueChange,
    disabled,
  });

  return <WheelPickerShell ref={shellRef}>{children}</WheelPickerShell>;
}
