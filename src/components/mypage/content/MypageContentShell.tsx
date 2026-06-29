"use client";

import { ContentCard, ContentPlaceholderText } from "./MypageContentShell.style";

type Props = {
  description: string;
};

/**
 * 마이페이지 오른쪽 콘텐츠 공통 플레이스홀더 래퍼
 * 각 기능 구현 전까지 섹션 공간을 잡아주는 용도
 */
export default function MypageContentShell({ description }: Props) {
  return (
    <ContentCard>
      <ContentPlaceholderText>{description}</ContentPlaceholderText>
    </ContentCard>
  );
}
