import styled from "@emotion/styled";
import { DESKTOP_MIN_WIDTH } from "@/lib/layout";

/** 흰 카드 패널 — 상단 그리드 좌측(약 60%)에 들어갈 블록 */
export const Panel = styled.section`
  width: 100%;
  flex: 1 1 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 25rem;
  padding: 2rem;
  background: #fdfcf8;
  border: 1px solid ${({ theme }) => theme.colors.neutral.silver};
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    width: 100%;
    min-width: 0;
    min-height: 0;
  }
`;

/** 상단 — 제목 아래 메타·운세 흐름 지수 2열 */
export const SummaryMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
`;

/** 좌측 — 뽑은 카드·카테고리 */
export const SummaryInfoStack = styled.div`
  flex: 1 1 12rem;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

/** 우측 — 운세 흐름 지수 카드 */
export const SummaryGaugeColumn = styled.div`
  flex: 0 1 16rem;
  max-width: min(16rem, 48%);
  min-width: 13rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: 1 1 100%;
    max-width: 100%;
    min-width: 0;
  }
`;

/** 섹션 제목 행 (아이콘 + 문구) */
export const PanelHeading = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral.gray};
`;

/** 스크롤 가능한 본문 — 긴 텍스트 대비 */
export const ScrollBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral.silver};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.neutral.gray};
  }
`;

/** 라벨·값 한 줄 — 라벨과 값 사이 간격만 두고 나란히 배치 */
export const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 0.5rem;
  row-gap: 0.25rem;
`;

export const FieldLabel = styled.span`
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral.gray};
`;

export const FieldValue = styled.span`
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral.blackLight};
`;

/** 카테고리 우측: 값 + 태그 묶음 */
export const CategoryValueWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
`;

/** 세부 의도 칩 — setup CapsuleTag와 동일 카테고리 accentColor */
export const IntentTag = styled.span<{ $accentColor: string }>`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $accentColor }) => $accentColor};
  background: ${({ theme }) => theme.colors.neutral.grayLight};
  border: 1px solid #dce0ef;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

/** 블록 라벨 (현재 상황 / 질문 내용) */
export const BlockLabel = styled.span`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.neutral.gray};
`;

/** 현재 상황 인용 박스 */
export const SituationBox = styled.div`
  padding: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.65;
  font-style: italic;
  color: ${({ theme }) => theme.colors.neutral.blackLight};
  background: ${({ theme }) => theme.colors.neutral.grayLight};
  border: 1px solid ${({ theme }) => theme.colors.neutral.silver};
  border-radius: 1rem;
`;

/** 질문 내용 강조 박스 */
export const QuestionBox = styled.div`
  padding: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.65;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.blue};
  background: ${({ theme }) => theme.colors.neutral.silver};
  border: 1px solid ${({ theme }) => theme.colors.neutral.silver};
  border-radius: 1rem;
`;

export const BlockStack = styled.div`
  display: flex;
  flex-direction: column;
`;
