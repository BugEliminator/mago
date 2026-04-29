import styled from "@emotion/styled";
import { motion } from "framer-motion";

// 전체 컨테이너
export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(180deg, #2a1810 0%, #1a0f08 100%);
`;

// 위쪽 롤러
export const TopRoller = styled.div`
  width: 100%;
  max-width: 700px;
  height: 40px;
  background: linear-gradient(90deg, #8b6f47 0%, #a0826d 50%, #8b6f47 100%);
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 50px;
    height: 40px;
    background: #6b5842;
    border-radius: 20px;
  }

  &::before {
    left: -30px;
  }
  &::after {
    right: -30px;
  }
`;

// 펼쳐지는 두루마리 컨텐츠
export const ScrollContent = styled(motion.div)`
  width: 100%;
  max-width: 700px;
  overflow: hidden;
  position: relative;
  margin-top: -5px;
  transform-origin: top center;
`;

// 양피지 배경
export const ParchmentBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, #f4e8d0 0%, #f0e4cc 50%, #ece0c8 100%);

  /* 양피지 질감 */
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05' /%3E%3C/svg%3E");

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(0, 0, 0, 0.05);
`;

// 실제 폼 컨텐츠
export const FormContent = styled(motion.div)`
  position: relative;
  z-index: 1;
  padding: 3rem 2rem;

`;

// 아래쪽 롤러
export const BottomRoller = styled.div`
  width: 100%;
  max-width: 700px;
  height: 40px;
  background: linear-gradient(90deg, #8b6f47 0%, #a0826d 50%, #8b6f47 100%);
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  margin-top: -5px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 50px;
    height: 40px;
    background: #6b5842;
    border-radius: 20px;
  }

  &::before {
    left: -30px;
  }
  &::after {
    right: -30px;
  }

`;

// 섹션
export const Section = styled.section`
  margin-bottom: 3rem;

  &:last-of-type {
    margin-bottom: 2rem;
  }
`;

// 섹션 타이틀
export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #3e2723;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: "Noto Serif KR", serif;
`;

// 카테고리 그리드
export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

// 카테고리 카드 (styled(motion.button)은 onClick 제네릭이 깨지는 경우가 있어 motion(styled.button) 사용)
const CategoryCardBase = styled.button<{
  selected: boolean;
  color: string;
}>`
  background: ${({ selected, color }) =>
    selected ? color : "rgba(255, 255, 255, 0.5)"};
  border: 2px solid
    ${({ selected, color }) => (selected ? color : "rgba(62, 39, 35, 0.2)")};
  border-radius: 1rem;
  padding: 1.5rem 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  color: ${({ selected }) => (selected ? "#fff" : "#3e2723")};

  .icon {
    font-size: 2rem;
    filter: ${({ selected }) => (selected ? "none" : "grayscale(80%)")};
  }

  .name {
    font-size: 1rem;
    font-weight: 600;
  }

  .description {
    font-size: 0.75rem;
    opacity: 0.9;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const CategoryCard = motion(CategoryCardBase);

// 카드 장수 옵션
export const CardCountOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

// 장수 옵션
const CountOptionBase = styled.button<{ selected: boolean }>`
  background: ${({ selected }) =>
    selected ? "#f9a825" : "rgba(255, 255, 255, 0.5)"};
  border: 2px solid
    ${({ selected }) => (selected ? "#f9a825" : "rgba(62, 39, 35, 0.2)")};
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  color: ${({ selected }) => (selected ? "#fff" : "#3e2723")};

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const CountOption = motion(CountOptionBase);

// 장수 배지
export const CountBadge = styled.span`
  font-size: 2rem;
  font-weight: 700;
`;

// 장수 설명
export const CountDescription = styled.p`
  font-size: 0.875rem;
  margin: 0;
  opacity: 0.9;
`;

// 질문 섹션
export const QuestionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// 질문 입력
export const QuestionTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(62, 39, 35, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  color: #3e2723;
  font-size: 1rem;
  font-family: "Noto Sans KR", sans-serif;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #f9a825;
    background: rgba(255, 255, 255, 0.8);
  }

  &::placeholder {
    color: rgba(62, 39, 35, 0.5);
  }
`;

// 시작 버튼
const StartButtonBase = styled.button`
  width: 100%;
  padding: 1.25rem;
  background: ${({ disabled }) => (disabled ? "#ccc" : "#1a237e")};
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: ${({ disabled }) => (disabled ? "#ccc" : "#283593")};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const StartButton = motion(StartButtonBase);
