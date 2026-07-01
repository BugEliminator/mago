"use client";

import type { ReactNode } from "react";
import { PromptWrap, PromptBubble } from "./AttendancePrompt.style";

type AttendancePromptProps = {
  /** 말풍선을 표시할지 — false면 children만 렌더 */
  visible: boolean;
  /** 이동할 경로 */
  href: string;
  /** 말풍선 텍스트 */
  message: string;
  children: ReactNode;
};

/**
 * 출석 미완료 시 냥 칩 아래에 말풍선 CTA를 표시하는 래퍼
 */
export default function AttendancePrompt({
  visible,
  href,
  message,
  children,
}: AttendancePromptProps) {
  if (!visible) {
    return <>{children}</>;
  }

  return (
    <PromptWrap>
      {children}
      <PromptBubble href={href} aria-label={message}>
        {message}
      </PromptBubble>
    </PromptWrap>
  );
}
