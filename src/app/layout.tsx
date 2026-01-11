import EmotionRegistry from "@/lib/registry";
import ThemeProvider from "@/components/providers/ThemeProvider";
import type { Metadata } from "next";
import HeaderContainer from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "MAGO - AI 기반 타로 서비스",
  description: "타로와 현대 AI 기술이 만나 탄생한 신비로운 타로 서비스",
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
          <HeaderContainer />
          <ThemeProvider>{children}</ThemeProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
