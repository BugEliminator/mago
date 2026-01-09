"use client";

import styled from "@emotion/styled";
import { motion } from "framer-motion";

/**
 * 메인 랜딩 페이지
 * MAGO 서비스의 첫 화면으로, 신비로운 애니메이션과 함께 서비스를 소개합니다.
 */

// 스타일 컴포넌트 정의
const Container = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.blueDark} 0%,
    ${({ theme }) => theme.colors.primary.blue} 50%,
    ${({ theme }) => theme.colors.neutral.blackDark} 100%
  );
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.xl};
`;

// 배경 장식 요소 (신비로운 분위기 연출)
const BackgroundDecoration = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0.1;
  background-image: radial-gradient(
      circle at 20% 50%,
      ${({ theme }) => theme.colors.accent.gold} 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      ${({ theme }) => theme.colors.secondary.red} 0%,
      transparent 50%
    );
  pointer-events: none;
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  width: 100%;
`;

// 서비스명 스타일 (motion.h1을 styled로 감싸기)
const ServiceName = styled(motion.h1)`
  font-family: ${({ theme }) => theme.typography.fontFamily.display};
  font-size: ${({ theme }) => theme.typography.fontSize["5xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.accent.gold};
  text-shadow: 0 0 20px ${({ theme }) => theme.colors.accent.gold},
    0 0 40px ${({ theme }) => theme.colors.accent.gold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  letter-spacing: 0.1em;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize["4xl"]};
  }
`;

// 서브타이틀 스타일 (motion.p를 styled로 감싸기)
const Subtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.neutral.silver};
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
  line-height: 1.8;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

// 타로 시작하기 버튼 (motion.button을 styled로 감싸기)
const StartButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral.black};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent.gold} 0%,
    ${({ theme }) => theme.colors.accent.goldLight} 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.mystical};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.mystical},
      0 0 30px ${({ theme }) => theme.colors.accent.gold};
  }

  &:active {
    transform: translateY(0);
  }
`;

// 애니메이션 variants (Framer Motion)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99], // 부드러운 easing
    },
  },
};

const buttonVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.8,
    },
  },
  hover: {
    scale: 1.05,
  },
  tap: {
    scale: 0.95,
  },
};

export default function HomePage() {
  const handleStartClick = () => {
    // TODO: 타로 카드 선택 페이지로 이동
    console.log("타로 시작하기 클릭됨");
  };

  return (
    <Container>
      <BackgroundDecoration />
      <ContentWrapper
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ServiceName variants={itemVariants}>MAGO</ServiceName>

        <Subtitle variants={itemVariants}>
          타로와 현대 AI 기술이 만나
          <br />
          탄생한 신비로운 타로 서비스
        </Subtitle>

        <StartButton
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          onTap={handleStartClick}
        >
          타로 시작하기
        </StartButton>
      </ContentWrapper>
    </Container>
  );
}
