import styled from "@emotion/styled";
import { motion } from "framer-motion";

/** Step 2: 질문/고민 선택 전용 레이아웃 */
export const StepTwoRoot = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

export const StepTwoScrollArea = styled.div`
  width: 100%;
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding-right: 0.125rem;

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

/** 카테고리·구분선 높이는 유지하고, 남은 세로 공간은 칩 영역이 모두 사용 */
export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.625rem;
  width: 100%;
  flex-shrink: 0;
`;

const CategoryButtonBase = styled.button<{ $active: boolean }>`
  min-height: 4.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.75rem 0.5rem;
  border: 1px solid ${({ $active }) => ($active ? "#d4af37" : "#202736")};
  border-radius: 1.25rem;
  background: ${({ $active }) => ($active ? "#211f17" : "#151a20")};
  color: ${({ $active }) => ($active ? "#d4af37" : "#6f778a")};
  cursor: pointer;
  box-sizing: border-box;
  transition:
    background 220ms ease,
    border-color 220ms ease,
    color 220ms ease,
    opacity 150ms ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const CategoryButton = motion(CategoryButtonBase);

export const CategoryIcon = styled.span<{
  $active: boolean;
  $accentColor: string;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active, $accentColor }) => ($active ? $accentColor : "#6f778a")};
  transition:
    color 220ms ease,
    transform 220ms ease;
  transform: ${({ $active }) => ($active ? "scale(1.04)" : "scale(0.94)")};
`;

export const CategoryLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: -0.03em;
`;

export const DetailDivider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin: 0.5rem 0;
  flex-shrink: 0;
`;

export const DetailDividerLine = styled.div`
  height: 1px;
  flex: 1;
  background: linear-gradient(90deg, transparent 0%, #d4af37 100%);
  opacity: 0.45;

  &:last-of-type {
    background: linear-gradient(90deg, #d4af37 0%, transparent 100%);
  }
`;

export const DetailDividerLabel = styled.span`
  flex-shrink: 0;
  color: #d4af37;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;

export const ChipScrollArea = styled.div`
  width: 100%;
  flex-shrink: 0;
  padding: 0.25rem 0.375rem 0.75rem 0.125rem;
`;

/** 하단 버튼이 칩 위로 겹치지 않도록 축소 방지 */
export const StepTwoFooter = styled.div`
  flex-shrink: 0;
  width: 100%;
  padding-top: 0.375rem;
`;

export const ChipList = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 0.75rem 0.5rem;
`;

const DetailChipBase = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${({ $active }) => ($active ? "#d4af37" : "#2a3040")};
  border-radius: 0.875rem;
  background: ${({ $active }) => ($active ? "#202538" : "#1a1f2b")};
  color: ${({ $active }) => ($active ? "#f5f6fa" : "#a8b0c4")};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  cursor: pointer;
  transition:
    background 220ms ease,
    border-color 220ms ease,
    color 220ms ease,
    opacity 150ms ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const DetailChip = motion(DetailChipBase);

export const ChipHash = styled.span<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? "#d4af37" : "#8d7432")};
`;

export const ChipEmptyText = styled.p`
  margin: 0;
  padding: 2rem 0;
  color: #6f778a;
  font-size: 0.8125rem;
  line-height: 1.6;
  text-align: center;
`;
