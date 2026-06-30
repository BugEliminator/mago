import styled from "@emotion/styled";
import { AuthCard } from "@/components/auth/AuthScreen.style";

const MOBILE = "@media (max-width: 640px)";

/**
 * 딤 오버레이 — 모바일은 여백 안에서 카드가 화면 높이를 채움
 */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overscroll-behavior: contain;

  ${MOBILE} {
    padding: 1rem;
    padding-top: calc(0.75rem + env(safe-area-inset-top, 0px));
    padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
    align-items: stretch;
    overflow: hidden;
  }

  &::before {
    content: "";
    position: fixed;
    inset: 0;
    background: #030407;
    opacity: 0.78;
    z-index: -1;

    ${MOBILE} {
      opacity: 0.92;
    }
  }
`;

/** 추가 정보 모달 카드 — 모바일도 AuthCard 기본 둥근 모서리·테두리 유지 */
export const ProfileModalCard = styled(AuthCard)`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  max-height: calc(100dvh - 3rem);

  ${MOBILE} {
    flex: 1;
    min-height: 0;
    height: 100%;
    max-height: 100%;
    padding: 1.25rem 1rem 1.25rem;
  }
`;

/** 모달 카드 내부 — 헤더 고정 + 본문 스크롤 */
export const ModalCardLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

/** 고정 헤더 — 로고·제목 */
export const ModalCardHeader = styled.div`
  flex-shrink: 0;
`;

/** 스크롤 가능 본문 — 필드 + 하단 버튼 포함 */
export const ModalScrollBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding-right: 0.125rem;
  padding-bottom: 0.5rem;

  ${MOBILE} {
    padding-bottom: 1.25rem;
  }

  &::-webkit-scrollbar {
    width: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #3d455c;
    border-radius: 999px;
  }
`;

/** 좌상단 닫기 */
export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: #8b93a8;
  cursor: pointer;
  transition:
    color 150ms ease,
    background 150ms ease;

  &:hover:not(:disabled) {
    color: #e8eaef;
    background: #2a3145;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  ${MOBILE} {
    top: 0.75rem;
    left: 0.75rem;
  }
`;

export const FieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

/** 휠 필드 헤더 — 라벨 + 우측 \"선택 안 함\" 토글 */
export const WheelFieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

export const WheelFieldLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #a8b0c4;
`;

const visuallyHiddenCheckbox = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const OptionalToggle = styled.label<{
  $checked: boolean;
  $disabled?: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.375rem;
  border-radius: 0.5rem;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  user-select: none;

  input {
    ${visuallyHiddenCheckbox}
  }

  input:focus-visible + span {
    border-color: #d4a017;
    box-shadow: 0 0 0 3px #2a2318;
  }
`;

/** 체크 아이콘 — 박스 대비 위치 미세 조정 */
export const OptionalCheckImg = styled.img`
  display: block;
  width: 16px;
  height: 16px;
`;

export const OptionalToggleBox = styled.span<{ $checked: boolean }>`
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 0.25rem;
  border: 1px solid ${({ $checked }) => ($checked ? "#f9a825" : "#3e475e")};
  background: ${({ $checked }) => ($checked ? "#2d354a" : "transparent")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  transition:
    border-color 150ms ease,
    background 150ms ease,
    box-shadow 150ms ease;
`;

export const OptionalToggleText = styled.span<{ $checked: boolean }>`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ $checked }) => ($checked ? "#f9a825" : "#a8b0c4")};
`;

/** 성별 세그먼트 — 한 줄·줄바꿈 대응 */
export const GenderSegmentRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const visuallyHiddenRadio = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

/** 세그먼트 한 칸 — 선택 시 브랜드 골드 테두리 */
export const GenderSegment = styled.label<{ $selected: boolean }>`
  position: relative;
  display: flex;
  flex: 1 1 5.5rem;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.5rem 0.625rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ $selected }) => ($selected ? "#f9a825" : "#3e475e")};
  background: ${({ $selected }) => ($selected ? "#2d354a" : "#252d42")};
  color: ${({ $selected }) => ($selected ? "#f9a825" : "#f0f2f7")};
  font-size: 0.9375rem;
  font-weight: ${({ $selected }) => ($selected ? 600 : 500)};
  cursor: pointer;
  text-align: center;
  transition:
    border-color 200ms ease,
    background 200ms ease,
    color 200ms ease,
    box-shadow 200ms ease;

  &:hover {
    border-color: ${({ $selected }) => ($selected ? "#f9a825" : "#5a6478")};
  }

  &:focus-within {
    border-color: #d4a017;
    box-shadow: 0 0 0 3px #2a2318;
  }

  input {
    ${visuallyHiddenRadio}
  }
`;

const controlBase = `
  width: 100%;
  padding: 0.875rem 1rem;
  background: #252d42;
  border: 1px solid #3e475e;
  border-radius: 0.75rem;
  color: #f0f2f7;
  font-size: 1rem;
  outline: none;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease,
    background 200ms ease;

  &:focus {
    border-color: #d4a017;
    box-shadow: 0 0 0 3px #2a2318;
    background: #2d354a;
  }
`;

/** date / time 네이티브 인풋 */
export const ModalInput = styled.input`
  ${controlBase}

  &::-webkit-calendar-picker-indicator {
    filter: invert(0.75);
    cursor: pointer;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-top: 1.5rem;

  ${MOBILE} {
    margin-top: 1.25rem;
    padding-bottom: 0.25rem;
  }
`;

export const TextActionButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: #a8b0c4;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 150ms ease;

  &:hover:not(:disabled) {
    color: #e0b140;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
