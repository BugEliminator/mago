import EmotionRegistry from "@/lib/registry";
import ThemeProvider from "@/components/providers/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import type { Metadata } from "next";
import AppLayoutShell from "@/components/layout/AppLayoutShell";
import MagoToaster from "@/components/common/toast/MagoToaster";
import TarotDraftAuthSync from "@/components/tarot/TarotDraftAuthSync";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mago-tarot.vercel.app";

const SITE_TITLE = "MAGO - AI 기반 타로 서비스";
const SITE_DESCRIPTION =
  "타로와 현대 AI 기술이 만나 탄생한 신비로운 타로 서비스";

/** OG 썸네일 — public/image/og/thumbnail.png */
const OG_IMAGE = {
  url: "/image/og/thumbnail.png",
  width: 1688,
  height: 932,
  alt: "MAGO AI 타로 — 당신의 오늘을 읽는 마법",
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: [{ url: "/icon/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "MAGO",
    locale: "ko_KR",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

/**
 * 루트 레이아웃 컴포넌트
 * Emotion 레지스트리와 테마 프로바이더를 설정합니다.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Noto+Serif+KR:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <EmotionRegistry>
          <QueryProvider>
            <AppLayoutShell>
              <TarotDraftAuthSync />
              <ThemeProvider>{children}</ThemeProvider>
            </AppLayoutShell>
            <MagoToaster />
          </QueryProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
