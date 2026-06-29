import styled from "@emotion/styled";
import { TAROT_CARD_BACK_SHELL_WIDTH_DETAIL } from "@/components/tarot/TarotCardBackShell.style";
import { DESKTOP_MIN_WIDTH } from "@/lib/layout";

/** 카드 상세 강조색 — theme accent.gold */
const ACCENT_GOLD = "#f9a825";

/** 상단 카드 행 아래 여백 포함 블록 — 향후 스크롤 앵커용 */
export const SectionRoot = styled.section`
  margin-top: 2rem;
  scroll-margin-top: 2rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    margin-top: 2rem;
    scroll-margin-top: 2rem;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 2rem;
    align-items: flex-start;
  }
`;

/** 좌측 카드 열 — 상세용 폭(`TAROT_CARD_BACK_SHELL_WIDTH_DETAIL`)과 맞춤 */
export const CardColumn = styled.div`
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    width: ${TAROT_CARD_BACK_SHELL_WIDTH_DETAIL};
    position: sticky;
    top: 1.5rem;
    align-items: stretch;
  }
`;

export const CardOrderFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const OrderRule = styled.span`
  display: block;
  width: 1.5rem;
  height: 1px;
  background: ${({ theme }) => theme.colors.neutral.silver};
`;

export const OrderText = styled.p`
  margin: 0;
  font-size: 0.625rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  letter-spacing: 0.35em;
  color: ${({ theme }) => theme.colors.neutral.gray};
  text-transform: uppercase;
`;

/** 우측 텍스트 패널 — 상단 요약 패널과 동일 크림 톤 */
export const TextPanel = styled.div`
  flex: 1;
  min-width: 0;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral.silver};
  background: #fdfcf8;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 3rem;
  }
`;

export const PhaseRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  margin-bottom: 0.75rem;
`;

export const PhaseBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.5625rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.neutral.white};
  background: ${ACCENT_GOLD};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-transform: uppercase;
`;

export const PhaseLabel = styled.span`
  font-size: 0.875rem;
  margin-left: 0.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${ACCENT_GOLD};
`;

export const SummaryLine = styled.p`
  font-size: 0.875rem;
  margin-left: 0.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral.grayDark};
`;

export const CardTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.neutral.black};
  line-height: 1.15;
`;

/** 마고 해석 — 연한 회색 중첩 박스 */
export const InterpretPanel = styled.div`
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral.silver};
  background: ${({ theme }) => theme.colors.neutral.grayLight};

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 2.5rem;
  }
`;

export const InterpretHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${ACCENT_GOLD};

  svg {
    flex-shrink: 0;
    color: ${ACCENT_GOLD};
  }
`;

export const InterpretBody = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.neutral.blackLight};
  white-space: pre-line;
`;
