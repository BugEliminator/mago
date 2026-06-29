import styled from "@emotion/styled";
import { DESKTOP_MIN_WIDTH } from "@/lib/layout";

/** 리딩 스프레드 호버와 비슷한 금테 연색 */
const GOLD_SOFT = "#f2cc88";

/**
 * Emotion 컴포넌트 선택자(${OtherStyled}:hover &)는 SWC 플러그인 없이 사용 불가.
 * ThumbSlotButton 호버 시 스타일 적용용 고정 클래스명.
 */
export const RESULT_CARD_OVERVIEW_THUMB_FRAME_CLASS =
  "mago-result-card-overview-thumb-frame";

/** 우측 패널 — 상단 행에서 약 40% 폭 */
export const Panel = styled.section`
  width: 100%;
  flex: 1 1 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
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

export const PanelHeading = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem;
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral.gray};
`;

/** 카드 썸네일 행 — 3장 이하: 균등 분할 / 그 초과: 가로 스크롤·다음 장 살짝 노출 */
export const ThumbGrid = styled.div<{ $scrollRow?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  ${({ $scrollRow }) =>
    $scrollRow
      ? `
    flex-wrap: nowrap;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    /* 라벨 하단과 가로 스크롤바 사이 숨통 */
    padding-bottom: 0.5rem;

    & > * {
      flex: 0 0 calc((100% - 1.5rem) / 3.35);
      min-width: 0;
      max-width: none;
    }
  `
      : `
    flex-wrap: nowrap;

    & > * {
      flex: 1 1 0;
      min-width: 0;
      max-width: none;
    }
  `}
`;

const thumbColumn = `
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: center;
`;

/** 비인터랙티브 슬롯(퍼블리싱 단계 기본) */
export const ThumbFigure = styled.div`
  ${thumbColumn};
`;

/** 클릭 시 상세로 스크롤 등 연동할 때 사용 */
export const ThumbSlotButton = styled.button`
  ${thumbColumn};
  border: none;
  background: transparent;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.blue};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }

  &:hover .${RESULT_CARD_OVERVIEW_THUMB_FRAME_CLASS} {
    border-color: ${GOLD_SOFT};
    filter: brightness(1.03);
    box-shadow:
      0 10px 25px -5px #0a0a0a,
      0 0 12px #eab865,
      inset 0 0 0 1px #fff8e6,
      0 0 20px #ffffff,
      0 0 40px #f0f0f0;
  }

  &:active .${RESULT_CARD_OVERVIEW_THUMB_FRAME_CLASS} {
    transform: scale(0.98);
  }
`;

/** 슬롯 캡션 — 참고 UI처럼 양쪽 얇은 라인 (-- CARD n -- 느낌) */
export const ThumbLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-size: 0.625rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.neutral.gray};
  text-transform: uppercase;
`;

/** 캡션 좌우 장식선 (1px 높이) */
export const ThumbLabelRule = styled.span`
  flex-shrink: 0;
  width: 1.5rem;
  height: 1px;
  background: ${({ theme }) => theme.colors.neutral.silver};
`;

export const ThumbLabelText = styled.span`
  flex-shrink: 0;
`;

/** 슬롯 안 카드가 가로를 채움 — 플렉스 균등 폭과 맞춰 빈 여백 없음 */
export const OverviewThumbScaleWrap = styled.div`
  width: 100%;
  max-width: 100%;
`;

/** 하단 인사이트 영역 */
export const InsightBox = styled.div`
  padding: 1.5rem;
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.primary.blue};
  box-shadow: inset 0 1px 0 #415395;
`;

export const InsightText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.neutral.silver};
`;
