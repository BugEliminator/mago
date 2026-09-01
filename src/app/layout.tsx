import EmotionRegistry from "@/lib/ui/registry";
import ThemeProvider from "@/components/providers/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import type { Metadata } from "next";
import AppLayoutShell from "@/components/layout/AppLayoutShell";
import MagoToaster from "@/components/common/toast/MagoToaster";
import TarotDraftAuthSync from "@/components/tarot/TarotDraftAuthSync";
import { SITE_URL } from "@/lib/seo/siteUrl";
import "./globals.css";

const SITE_TITLE = "MAGO | AI 타로로 오늘의 운세 보기";
const SITE_DESCRIPTION =
  "궁금한 질문을 카드로 묻고 AI가 해석합니다. 오늘의 타로부터 연애·진로 운세까지 MAGO에서 바로 보세요.";

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
  alternates: {
    canonical: SITE_URL,
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
  verification: {
    other: {
      "naver-site-verification": "e05375299fcbb5e20c4516d5ac9239089aa09614",
    },
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
