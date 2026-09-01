import styled from "@emotion/styled";
import {
  DESKTOP_MIN_WIDTH,
  LAYOUT_CONTENT_MAX_WIDTH,
  LAYOUT_PAGE_HORIZONTAL_PADDING,
} from "@/lib/layout/layout";

/** 사용법 아래 차별점 섹션 — 배경은 히어로 워프가 비치게 둔다 */
export const DifferenceRoot = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
  padding: 1.5rem ${LAYOUT_PAGE_HORIZONTAL_PADDING} 5rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 2rem 0 6rem;
  }
`;

export const DifferenceInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: ${LAYOUT_CONTENT_MAX_WIDTH};
  margin: 0 auto;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    gap: 2.75rem;
  }
`;

export const DifferenceHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
`;

/** 섹션 제목 — 사용법과 같은 골드 그라데이션, glow 없음 */
export const DifferenceHeading = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.35;
  text-align: center;
  word-break: keep-all;
  color: transparent;
  background-image: linear-gradient(
    90deg,
    #fde047 0%,
    #d4af37 45%,
    #b45309 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 2rem;
  }
`;

export const DifferenceLead = styled.p`
  margin: 0 auto;
  max-width: 44rem;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.neutral.silver};
  word-break: keep-all;
  text-align: center;
`;

export const DifferenceGrid = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
`;

export const DifferenceCard = styled.li`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 1.125rem;
  box-sizing: border-box;
  height: 100%;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: #0b132b;
  border: 1px solid #243044;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 2rem;
    gap: 1.25rem;
  }
`;

/** 아이콘 + 제목 한 줄, 왼쪽 정렬 */
export const DifferenceCardTop = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
`;

export const DifferenceIconWrap = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  background-color: #121a33;
  color: ${({ theme }) => theme.colors.accent.gold};

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const DifferenceCardTitle = styled.h3`
  margin: 0;
  min-width: 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.neutral.white};
  word-break: keep-all;
`;

export const DifferenceCardBody = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.neutral.silver};
  word-break: keep-all;
`;
