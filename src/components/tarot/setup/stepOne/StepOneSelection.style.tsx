import styled from "@emotion/styled";
import { motion } from "framer-motion";

/** Step 1: 카드 장수/복채 선택 영역
 * overflow: hidden 제거 — 상위 CardFrontPanel이 이미 클리핑하므로 불필요하며,
 * iOS 3D 컨텍스트 안에서 중첩 overflow가 터치 스크롤을 막는 원인이 됩니다. */
export const StepOneRoot = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CoinOptionList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CoinOptionButtonBase = styled.button<{ $active: boolean }>`
  position: relative;
  width: 100%;
  height: 7.75rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
  border: 1px solid ${({ $active }) => ($active ? "#d4af37" : "#353c50")};
  border-radius: 1.5rem;
  background: ${({ $active }) => ($active ? "#171a20" : "#22283a")};
  color: #f5f6fa;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 250ms ease,
    background 250ms ease,
    transform 250ms ease;

  &:hover {
    border-color: ${({ $active }) => ($active ? "#d4af37" : "#5a6175")};
  }
`;

export const CoinOptionButton = motion(CoinOptionButtonBase);

export const RecommendBadge = styled.span`
  position: absolute;
  top: 0;
  right: 1.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 0 0 0.75rem 0.75rem;
  background: #d4af37;
  color: #000000;
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const CoinVisualArea = styled.div`
  flex: 0 0 4.5rem;
  margin-left: -0.5rem;
`;

export const CoinStackRoot = styled.div`
  position: relative;
  width: 4.75rem;
  height: 5.25rem;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  perspective: 1500px;

  svg {
    width: 3.8rem;
    height: 4.37rem;
    filter: drop-shadow(0 12px 15px #030407);
  }
`;

export const CoinLayer = styled(motion.div)`
  position: absolute;
  transform-origin: bottom;
`;

export const CoinOptionContent = styled.div`
  flex: 1;
  min-width: 0;
  margin-left: 0.75rem;
`;

export const CoinOptionTopRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
`;

export const CoinOptionLabel = styled.span<{ $active: boolean }>`
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1;
  color: ${({ $active }) => ($active ? "#d4af37" : "#dfe3ef")};

  @media (max-width: 640px) {
    font-size: 1.125rem;
  }
`;

export const CoinOptionTitle = styled.h3<{ $active: boolean }>`
  margin: 0.35rem 0 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#ffffff" : "#a8b0c4")};
`;

/** 설명 2줄 높이를 항상 확보 — 선택 전환 시 박스 높이 변화 방지 */
export const CoinOptionDetailSlot = styled.div`
  min-height: 2.875rem;
  margin-top: 0.5rem;
`;

export const CoinOptionDetail = styled.p<{ $visible: boolean }>`
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.55;
  color: #858da3;
  word-break: keep-all;
  overflow-wrap: break-word;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 220ms ease;
`;
