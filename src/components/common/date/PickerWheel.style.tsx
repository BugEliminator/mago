import styled from "@emotion/styled";

/**
 * 생년월일·시간 휠 공통 스타일
 * — ex.txt 드럼휠 비주얼 기반으로 개선
 *   각 열을 독립 박스(#0c0e20 + rounded-xl)로 분리하고
 *   가운데 골드 가이드 바를 overlays로 표현
 */

/** 열 박스들을 나란히 배치하는 행 컨테이너 */
export const WheelWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
`;

/** 헤더 + 휠 세로 묶음 */
export const WheelColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.375rem;
`;

/** 컬럼 라벨 (연도 / 월 / 일 / 시 / 분) */
export const WheelColumnHeader = styled.div`
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #64688a;
  text-align: center;
`;

/**
 * react-mobile-picker 가 렌더하는 컨테이너를 감싸는 셸
 * — #0c0e20 배경, 둥근 테두리, 가운데 골드 가이드 overlay 표현
 */
export const WheelPickerShell = styled.div`
  position: relative;
  background: #0c0e20;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  overflow: hidden;

  /* 가운데 골드 가이드 바 (상단 경계) */
  &::before {
    content: "";
    position: absolute;
    top: calc(50% - 18px);
    left: 0.5rem;
    right: 0.5rem;
    height: 36px;
    border-top: 1px solid #d4af37;
    border-bottom: 1px solid #d4af37;
    background: #d4af37;
    opacity: 0.05;
    pointer-events: none;
    z-index: 1;
    border-radius: 0.25rem;
  }

  /* 상단 페이드 아웃 */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom, #0c0e20 0%, transparent 35%, transparent 65%, #0c0e20 100%);
    pointer-events: none;
    z-index: 2;
  }

  /* react-mobile-picker 내부 스타일 덮어쓰기 */
  .rmp-column-container {
    flex: 1;
  }

  .rmp-container::before,
  .rmp-container::after {
    background: transparent !important;
    border: none !important;
  }

  .rmp-item {
    color: #4a4e6a;
    font-size: 0.875rem;
    font-family: "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    transition: color 150ms ease;
  }

  .rmp-item[aria-selected="true"],
  .rmp-item.rmp-item--selected {
    color: #d4af37;
    font-weight: 700;
  }
`;
