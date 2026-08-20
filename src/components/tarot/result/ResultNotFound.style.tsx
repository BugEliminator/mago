import styled from "@emotion/styled";
import Link from "next/link";
import { DESKTOP_MIN_WIDTH } from "@/lib/layout/layout";

/** 결과 404 — 우주 배경 위 중앙 카드 */
export const Wrap = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem 3rem;
  min-height: calc(100vh - 4.5rem);

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 3rem 2rem;
    min-height: calc(100vh - 5rem);
  }
`;

export const Panel = styled.section`
  width: 100%;
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 1.75rem;
  background: #fdfcf8;
  border: 1px solid ${({ theme }) => theme.colors.neutral.silver};
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
`;

export const IconWrap = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutral.grayLight};
  border: 1px solid ${({ theme }) => theme.colors.neutral.silver};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  color: ${({ theme }) => theme.colors.neutral.gray};
`;

export const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral.black};
  line-height: 1.4;
`;

export const Description = styled.p`
  margin: 0 0 1.75rem;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.neutral.gray};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
`;

const actionButtonBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 8.5rem;
  padding: 0.625rem 1.25rem;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  border-radius: 0.75rem;
  cursor: pointer;
  text-decoration: none;
  transition: transform 150ms ease-in-out, background 150ms ease-in-out;
`;

/** 홈으로 — 아웃라인 */
export const HomeLink = styled(Link)`
  ${actionButtonBase}
  color: ${({ theme }) => theme.colors.neutral.black};
  background: ${({ theme }) => theme.colors.neutral.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral.silver};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.grayLight};
    transform: scale(1.03);
  }
`;

/** 타로 시작하기 — 남색 채움 */
export const StartButton = styled.button`
  ${actionButtonBase}
  color: ${({ theme }) => theme.colors.neutral.white};
  background: ${({ theme }) => theme.colors.primary.blue};
  border: 1px solid ${({ theme }) => theme.colors.primary.blue};

  &:hover {
    background: ${({ theme }) => theme.colors.primary.blueLight};
    transform: scale(1.03);
  }
`;
