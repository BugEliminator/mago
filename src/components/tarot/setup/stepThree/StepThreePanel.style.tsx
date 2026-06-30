import styled from "@emotion/styled";

/** Step 3: 본문·하단 버튼 레이아웃
 * overflow: hidden 제거 — 상위 CardFrontPanel이 이미 클리핑하므로 불필요하며,
 * iOS 3D 컨텍스트 안에서 중첩 overflow가 터치 스크롤을 막는 원인이 됩니다. */
export const StepThreeRoot = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/** 스크롤 가능한 입력 묶음 */
export const StepThreeScrollArea = styled.div`
  width: 100%;
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding-right: 0.25rem;
  margin-bottom: 0.5rem;

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

export const StepThreeInnerStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: 0 0.125rem;
`;

/** 스텝 2 선택 요약 캡슐 */
export const CategoryCapsule = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  align-self: center;
  padding: 0.625rem 1.25rem;
  border-radius: 1rem;
  background: #252a3a;
  border: 1px solid #2d3344;
  box-sizing: border-box;
`;

export const CapsuleDot = styled.span`
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 50%;
  background: #5a6175;
`;

export const CapsuleCategory = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #c8cdd8;
`;

export const CapsuleTag = styled.span<{ $accentColor: string }>`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ $accentColor }) => $accentColor};
`;

export const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const FieldLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: #c8cdd8;
`;

export const TextAreaWrap = styled.div`
  position: relative;

  &:focus-within textarea {
    border-color: #6d5817;
    box-shadow: 0 0 0 1px #6d5817;
  }
`;

export const SituTextarea = styled.textarea`
  width: 100%;
  min-height: 8rem;
  max-height: 11rem;
  box-sizing: border-box;
  padding: 1.25rem;
  border: 1px solid #353c50;
  border-radius: 1rem;
  background: #13161f;
  color: #e8eaf0;
  font-size: 0.875rem;
  line-height: 1.55;
  resize: none;
  outline: none;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #3d455c transparent;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;

  &::placeholder {
    color: #5a6278;
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

export const QuestionTextarea = styled(SituTextarea)`
  border-color: #4a4030;
`;

export const GageSection = styled.div`
  width: 100%;
  padding: 0 0.125rem;
  margin-bottom: 0.25rem;
`;

export const GageTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

export const GageLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
`;

export const GageTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const GageTitleDot = styled.span`
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 50%;
  background: #5a6175;
`;

export const GageTitle = styled.span`
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #71798e;
`;

export const GageMessage = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #c8cdd8;
  line-height: 1.35;
`;

export const GageCountWrap = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  flex-shrink: 0;
`;

export const GageCountCurrent = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #e8eaf0;
`;

export const GageCountMax = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #5a6278;
`;

export const GageTrackWrap = styled.div`
  position: relative;
`;

export const GageTrack = styled.div`
  height: 0.5rem;
  width: 100%;
  border-radius: 999px;
  background: #13161f;
  border: 1px solid #2d3344;
  box-sizing: border-box;
  overflow: hidden;
`;

export const GageFill = styled.div<{ $canOptimal: boolean; $pct: number }>`
  height: 100%;
  border-radius: 999px;
  transition:
    width 500ms ease-out,
    background 300ms ease;
  width: ${({ $pct }) => `${Math.min(100, Math.max(0, $pct))}%`};
  background: ${({ $canOptimal }) =>
    $canOptimal
      ? "linear-gradient(90deg, #283593 0%, #3949ab 100%)"
      : "#3d455c"};
  box-shadow: ${({ $canOptimal }) =>
    $canOptimal ? "0 0 10px #1a2250" : "none"};
`;

export const GageMarksRow = styled.div`
  position: relative;
  width: 100%;
  height: 2.25rem;
  margin-top: 0.125rem;
`;

export const GageMarkTick = styled.div`
  position: absolute;
  top: 0;
  width: 1px;
  height: 0.375rem;
  background: #353c50;
`;

export const GageOptimalWrap = styled.div`
  position: absolute;
  left: 33%;
  transform: translateX(-50%);
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const GageOptimalTick = styled.div`
  width: 1px;
  height: 0.375rem;
  background: #353c50;
  margin-bottom: 0.375rem;
`;

export const GageOptimalLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #5a6278;
  white-space: nowrap;
`;

export const StepThreeFooter = styled.div`
  flex-shrink: 0;
  width: 100%;
  padding-top: 0.375rem;
`;
