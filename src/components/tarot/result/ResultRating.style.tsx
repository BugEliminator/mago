import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

/** 피드백 제출 시 원화 코인 낙하·분출 모션 */
const coinBurstExtreme = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(var(--size));
  }
  30% {
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty)))
      scale(var(--size)) rotate(var(--rot));
    opacity: 1;
  }
  100% {
    transform: translate(
        calc(-50% + var(--tx) * 1.2),
        calc(-50% + var(--ty) + 1000px)
      )
      scale(calc(var(--size) * 0.3)) rotate(calc(var(--rot) * 2));
    opacity: 0;
  }
`;

/** 뷰포트 전체 코인 레이어 — 다른 UI보다 위, 클릭 통과 */
export const CoinBurstViewport = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 10000;
`;

/** 코인 1개 — 좌표·회전은 CSS 변수로 주입 */
export const CoinBurstMotionRoot = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  pointer-events: none;
  z-index: 100;
  animation: ${coinBurstExtreme} 3s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
  will-change: transform, opacity;
`;

/** ₩ 표시 원형 코인 면 */
export const CoinBurstFace = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 900;
  user-select: none;
  color: #78350f;
  border: 3px solid #d97706;
  background: linear-gradient(135deg, #fde047 0%, #facc15 45%, #f59e0b 100%);
  box-shadow: 0 6px 14px #616161;
`;

/** 별점 영역 흰 카드 */
export const Panel = styled.section`
  margin-top: 1.5rem;
  padding: 3rem 2rem;
  text-align: center;
  background: #fdfcf8;
  border: 1px solid ${({ theme }) => theme.colors.neutral.silver};
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 3rem 3.5rem;
  }
`;

export const Title = styled.h2`
  margin: 0 0 0.75rem;
  font-size: clamp(1.5rem, 4vw, 1.875rem);
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1.35;
  word-break: keep-all;
  overflow-wrap: break-word;
  text-wrap: balance;
  color: ${({ theme }) => theme.colors.neutral.black};
`;

/** 부제 — 문장 단위로 줄을 나눠 어색한 단어 분리 방지 */
export const SubtitleGroup = styled.div`
  margin: 0 0 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
`;

export const SubtitleLine = styled.p`
  margin: 0;
  max-width: 22rem;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.colors.neutral.gray};
`;

/** 부제 내 줄바꿈 없이 유지할 구문 */
export const SubtitlePhrase = styled.span`
  white-space: nowrap;
`;

export const StarsRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 0.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 1rem;
  }
`;

export const StarButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 3.5rem;
    height: 3.5rem;
  }
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: none;
  cursor: pointer;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.neutral.white : theme.colors.neutral.gray};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary.blue : theme.colors.neutral.grayLight};
  box-shadow: ${({ $active, theme }) => ($active ? theme.shadows.md : "none")};
  transition:
    transform ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.blue};
    outline-offset: 3px;
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const FeedbackBlock = styled.div`
  margin-top: 2.5rem;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

/** 피드백 입력 안내 문구 */
export const FeedbackCaption = styled.p`
  margin: 0;
  text-align: left;
  font-size: 0.9375rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1.55;
  word-break: keep-all;
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.colors.neutral.gray};
`;

export const FeedbackTextarea = styled.textarea`
  width: 100%;
  min-height: 8rem;
  padding: 1.5rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.colors.neutral.blackLight};
  background: ${({ theme }) => theme.colors.neutral.grayLight};
  border: 1px solid ${({ theme }) => theme.colors.neutral.silver};
  border-radius: 1rem;
  resize: none;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral.gray};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.blue};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.neutral.silver};
  }
`;

export const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto;
  padding: 1.25rem 2.5rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral.white};
  background: ${({ theme }) => theme.colors.primary.blue};
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition:
    filter ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    filter: brightness(1.08);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent.gold};
    outline-offset: 3px;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const DoneWrap = styled.div`
  padding: 2.5rem 0;
`;

export const DoneIconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutral.silver};
  color: ${({ theme }) => theme.colors.primary.blue};
`;

export const DoneTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral.black};
`;

export const DoneSub = styled.p`
  margin: 0 auto;
  max-width: 22rem;
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.colors.primary.blue};
`;
