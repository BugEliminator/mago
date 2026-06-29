"use client";

import { Toaster } from "sonner";
import { magoToastIcons } from "./ToastIcons";

/**
 * MAGO 토스트 — theme/dark + 자체 CSS 우선(richColors off)
 * 색·반경·배경은 `globals.css`의 `[data-sonner-*]` 규칙에서 관리
 */
export default function MagoToaster() {
  return (
    <Toaster
      theme="dark"
      richColors={false}
      position="top-center"
      closeButton={false}
      icons={magoToastIcons}
      toastOptions={{
        classNames: {
          title: "mago-toast-title",
          description: "mago-toast-description",
        },
      }}
    />
  );
}
