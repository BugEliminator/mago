import styled from "@emotion/styled";
import {
  DESKTOP_MIN_WIDTH,
  LAYOUT_CONTENT_MAX_WIDTH,
  LAYOUT_PAGE_HORIZONTAL_PADDING,
} from "@/lib/layout/layout";

/** 차별점 아래 FAQ 섹션 — 배경은 히어로 워프가 비치게 둔다 */
export const FaqRoot = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
  padding: 1.5rem ${LAYOUT_PAGE_HORIZONTAL_PADDING} 5rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 2rem 0 6rem;
  }
`;

export const FaqInner = styled.div`
  width: 100%;
  max-width: ${LAYOUT_CONTENT_MAX_WIDTH};
  margin: 0 auto;
`;

/** 데스크톱 2열 — 좌: 제목·CTA, 우: 아코디언 */
export const FaqLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.35fr);
    gap: 4rem;
    align-items: start;
  }
`;

export const FaqAside = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  min-width: 0;
`;

/** 섹션 제목 — 사용법·차별점과 같은 골드 그라데이션 */
export const FaqHeading = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.35;
  text-align: left;
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
    font-size: 2.25rem;
  }
`;

export const FaqHeadingSub = styled.p`
  margin: 0.375rem 0 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.45;
  text-align: left;
  word-break: keep-all;
  color: ${({ theme }) => theme.colors.neutral.white};

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 1.25rem;
  }
`;

/** 문의 CTA — HowToCtaButton 2개를 한 줄에 배치 */
export const FaqCtaList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.75rem;

  & > button {
    margin-top: 0;
  }
`;

export const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const FaqItemRoot = styled.div`
  border-bottom: 1px solid #243044;
`;

export const FaqQuestionButton = styled.button<{ $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  margin: 0;
  padding: 1.125rem 0;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.neutral.white};
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
  text-align: left;
  word-break: keep-all;
  cursor: pointer;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 1.125rem;
    padding: 1.25rem 0;
  }
`;

export const FaqToggleIcon = styled.span<{ $open: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.accent.gold};
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  transition: transform 0.28s ease;
`;

export const FaqAnswerWrap = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")};
  transition: grid-template-rows 0.28s ease;
`;

export const FaqAnswerInner = styled.div`
  overflow: hidden;
`;

/** 답변 블록 컨테이너 */
export const FaqAnswerBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0 0 1.125rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding-bottom: 1.25rem;
  }
`;

export const FaqAnswerParagraph = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.neutral.silver};
  word-break: keep-all;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 1rem;
  }
`;

/** HowToDetailItem과 동일한 골드 점 불릿 */
export const FaqBulletList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const FaqBulletItem = styled.li`
  position: relative;
  padding-left: 0.875rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.neutral.silver};
  word-break: keep-all;

  &::before {
    content: "";
    position: absolute;
    top: 0.5em;
    left: 0;
    width: 0.3125rem;
    height: 0.3125rem;
    border-radius: 999px;
    background-color: ${({ theme }) => theme.colors.accent.gold};
  }

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 1rem;
  }
`;

/** 요금 FAQ 등 — 무료 이용 팁 */
export const FaqTip = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.125rem;
`;

export const FaqTipTitle = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.accent.gold};
  word-break: keep-all;

  svg {
    flex-shrink: 0;
  }

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 1rem;
  }
`;
