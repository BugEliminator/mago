import styled from "@emotion/styled";
import { DESKTOP_MIN_WIDTH, LAYOUT_CONTENT_MAX_WIDTH } from "@/lib/layout";
import { theme } from "@/lib/theme";

/**
 * 본문 레이어 — 배경·헤더는 `app/tarot/result/layout.tsx`에서 제공
 */
export const ContentLayer = styled.div`
  position: relative;
  z-index: 1;
  padding: 1rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 2rem;
  }
`;

/**
 * 헤더와 동일한 최대 너비 — 좌우 여백만 헤더의 calc(100% - 4rem) 패턴과 맞춤
 */
export const ContentMax = styled.div`
  width: 100%;
  max-width: ${LAYOUT_CONTENT_MAX_WIDTH};
  margin: 0 auto;
  box-sizing: border-box;
`;

/** 상단 두 패널 배치용 행 — 58:42 비율로 가로 전체 채움 */
export const TopRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
    align-items: stretch;
    gap: 1.5rem;
  }
`;

/** 조회 실패 안내 */
export const ErrorPanel = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  border-radius: 2rem;
  border: 1px solid ${theme.colors.neutral.silver};
  background: ${theme.colors.neutral.white};
  text-align: center;
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.neutral.gray};
`;
