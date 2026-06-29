"use client";

import SpaceBackground from "@/components/common/background/SpaceBackground";
import Header from "@/components/layout/Header";
import {
  ResultHeaderSpacer,
  TarotResultChrome,
  TarotResultFixedFrame,
  TarotResultStack,
} from "./layout.style";

/**
 * 타로 결과 전용 레이아웃
 * 우주 배경과 플로우 헤더를 동일 스택에 두어 상단 흰 띠 없이 이어지게 함
 */
export default function TarotResultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TarotResultChrome>
      <SpaceBackground />
      <TarotResultFixedFrame>
        <TarotResultStack>
          <Header fixed={false} variant="result" smartHide />
          <ResultHeaderSpacer />
          {children}
        </TarotResultStack>
      </TarotResultFixedFrame>
    </TarotResultChrome>
  );
}
