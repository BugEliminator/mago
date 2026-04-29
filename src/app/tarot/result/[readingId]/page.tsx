"use client";

import { useParams } from "next/navigation";
import { Container, Title, ResultContainer, Placeholder } from "./page.style";

/**
 * 타로 결과 페이지
 * 선택한 카드의 해석 결과를 보여주는 페이지
 */

export default function TarotResultPage() {
  const params = useParams();
  const readingId = params.readingId as string;

  return (
    <Container>
      <Title>타로 해석 결과</Title>
      <ResultContainer>
        <Placeholder>
          타로 결과가 여기에 표시됩니다.
          <br />
          Reading ID: {readingId}
        </Placeholder>
      </ResultContainer>
    </Container>
  );
}
