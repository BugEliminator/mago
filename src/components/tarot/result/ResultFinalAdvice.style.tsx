import styled from "@emotion/styled";

/** 다크 톤 마무리 조언 카드 */
export const Panel = styled.section`
  margin-top: 3rem;
  padding: 3rem 2rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.primary.blue};
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 3rem 3.5rem;
  }
`;

export const PanelTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 0 1.75rem;
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.accent.gold};
`;

export const Quote = styled.p`
  margin: 0 auto;
  max-width: 36rem;
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1.85;
  font-style: italic;
  color: ${({ theme }) => theme.colors.neutral.silver};
`;
