"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Title, CardsContainer, Placeholder } from "./page.style";
import type { TarotSessionSetup } from "@/types/tarot";

/**
 * 타로 카드 선택 페이지
 * 설정에 따라 카드를 선택하는 페이지
 */

export default function TarotReadingPage() {
  const router = useRouter();
  const [setup, setSetup] = useState<TarotSessionSetup | null>(null);

  useEffect(() => {
    // LocalStorage에서 설정 불러오기
    const savedSetup = localStorage.getItem("tarotSetup");
    if (!savedSetup) {
      // 설정이 없으면 setup 페이지로 리다이렉트
      router.push("/tarot/setup");
      return;
    }

    setSetup(JSON.parse(savedSetup));
  }, [router]);

  if (!setup) {
    return (
      <Container>
        <Title>로딩 중...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>카드를 선택해주세요</Title>
      <CardsContainer>
        <Placeholder>
          {setup.cardCount}장의 카드를 선택하는 UI가 여기에 표시됩니다.
          <br />
          선택한 운세: {setup.category}
          <br />
          질문: {setup.question || "(없음)"}
        </Placeholder>
      </CardsContainer>
    </Container>
  );
}
