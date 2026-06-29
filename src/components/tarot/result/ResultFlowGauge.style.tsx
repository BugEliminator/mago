import styled from "@emotion/styled";

/** 좌 텍스트 · 우 도넛 — 상단 우측 컴팩트 박스 */
export const GaugeCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.75rem 0.875rem;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral.silver};
  background: ${({ theme }) => theme.colors.neutral.grayLight};
  box-sizing: border-box;
`;

export const GaugeCopyColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const GaugeTitle = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral.black};
  text-align: left;
  line-height: 1.3;
`;

/** 점수 구간별 한 줄 설명 */
export const GaugeDescription = styled.p`
  margin: 0;
  font-size: 0.6875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.neutral.grayDark};
  text-align: left;
  word-break: keep-all;
`;

export const GaugeVisualColumn = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/** 도넛 SVG 래퍼 */
export const DonutWrap = styled.div`
  position: relative;
  width: 4.75rem;
  height: 4.75rem;
`;

export const DonutSvg = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

export const DonutCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const DonutScore = styled.div`
  display: flex;
  align-items: baseline;
  line-height: 1;
`;

export const DonutScoreValue = styled.span<{ $color: string }>`
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  letter-spacing: -0.04em;
  color: ${({ $color }) => $color};
`;

export const DonutScoreUnit = styled.span`
  display: inline-flex;
  align-items: flex-end;
  margin-left: 0.0625rem;
  padding-bottom: 0.1rem;
  color: ${({ theme }) => theme.colors.neutral.gray};

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

export const DonutStatusBadge = styled.span<{ $color: string }>`
  margin-top: 0.125rem;
  padding: 0.0625rem 0.3125rem;
  font-size: 0.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $color }) => $color};
  border-radius: 999px;
  opacity: 0.92;
  line-height: 1.2;
  white-space: nowrap;
`;
