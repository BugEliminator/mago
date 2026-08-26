"use client";

import { Toaster } from "sonner";
import { magoToastIcons } from "./ToastIcons";
import OAuthUrlFeedback from "./OAuthUrlFeedback";

/**
 * MAGO 토스트 — theme/dark + 자체 CSS 우선(richColors off)
 * 색·반경·배경은 `globals.css`의 `[data-sonner-*]` 규칙에서 관리
 * OAuthUrlFeedback는 Toaster 뒤에 두어 구독 이후에 콜백 토스트를 띄운다.
 */
export default function MagoToaster() {
  return (
    <>
      <Toaster
        theme="dark"
        richColors={false}
        position="top-center"
        closeButton={false}
        icons={magoToastIcons}
        style={{ zIndex: 400 }}
        toastOptions={{
          classNames: {
            title: "mago-toast-title",
            description: "mago-toast-description",
          },
        }}
      />
      <OAuthUrlFeedback />
    </>
  );
}
