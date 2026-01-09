"use client";

import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { theme } from "@/lib/theme";
import { GlobalStyles } from "@/lib/GlobalStyles";

/**
 * 테마 프로바이더 컴포넌트
 * Emotion의 ThemeProvider와 GlobalStyles를 함께 제공합니다.
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmotionThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </EmotionThemeProvider>
  );
}
