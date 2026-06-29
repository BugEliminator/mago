import styled from "@emotion/styled";
import { MOBILE_MAX_WIDTH } from "@/lib/layout";

export const Container = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-x: hidden;

  @media (max-width: ${MOBILE_MAX_WIDTH}) {
    height: 100dvh;
    min-height: 100dvh;
    overflow-y: hidden;
  }
`;

export const ContentLayer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

/** 리딩 덱 영역이 세로로 남는 뷰포트를 채워 스프레드 가로 스크롤바가 아래로 내려가도록 합니다. */
export const ReadingStretchColumn = styled(ContentLayer)`
  flex: 1 1 0;
  align-self: stretch;
  min-height: 0;
  align-items: stretch;
`;

export const CardsContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * 리딩 덱 래퍼 — 카드 스프레드 가로 스크롤은 **뷰포트 너비(페이지 콘텐츠 영역 전체)** 기준으로 두고,
 * `max-width: 1200px` 같은 좁은 컬럼 안에서만 스크롤되지 않도록 합니다.
 */
export const ReadingStretchCardsWrap = styled.div`
  width: 100%;
  max-width: none;
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
`;

export const Placeholder = styled.div`
  padding: 3rem;
  background: rgba(244, 232, 208, 0.1);
  border: 2px dashed rgba(249, 168, 37, 0.3);
  border-radius: 1rem;
  color: rgba(244, 232, 208, 0.7);
  text-align: center;
  font-size: 1rem;
  line-height: 1.8;
`;
