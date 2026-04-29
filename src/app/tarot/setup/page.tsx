"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TopRoller,
  ScrollContent,
  ParchmentBackground,
  FormContent,
  BottomRoller,
  Section,
  SectionTitle,
  CategoryGrid,
  CategoryCard,
  CardCountOptions,
  CountOption,
  CountBadge,
  CountDescription,
  QuestionSection,
  QuestionTextarea,
  StartButton,
} from "./style";
import type { TarotSessionSetup, TarotCategory, CardSpread } from "@/types/tarot";

/**
 * 타로 설정 페이지
 * 운세 유형, 카드 장수, 질문을 선택하는 페이지
 */

// 운세 카테고리 옵션
const CATEGORIES = [
  {
    id: "love" as TarotCategory,
    name: "연애운",
    description: "사랑과 관계에 대한 운세",
    icon: "💕",
    color: "#c62828",
  },
  {
    id: "career" as TarotCategory,
    name: "진로운",
    description: "직업과 커리어에 대한 운세",
    icon: "💼",
    color: "#1a237e",
  },
  {
    id: "fortune" as TarotCategory,
    name: "재물운",
    description: "금전과 재산에 대한 운세",
    icon: "💰",
    color: "#f9a825",
  },
  {
    id: "health" as TarotCategory,
    name: "건강운",
    description: "건강과 웰빙에 대한 운세",
    icon: "🍀",
    color: "#4caf50",
  },
  {
    id: "general" as TarotCategory,
    name: "종합운",
    description: "전반적인 운세",
    icon: "✨",
    color: "#9c27b0",
  },
  {
    id: "relationship" as TarotCategory,
    name: "인간관계",
    description: "대인 관계에 대한 운세",
    icon: "👥",
    color: "#ff9800",
  },
];

// 카드 장수 옵션
const SPREAD_OPTIONS = [
  {
    count: 1 as CardSpread,
    name: "원카드",
    description: "오늘의 간단한 운세",
  },
  {
    count: 3 as CardSpread,
    name: "쓰리카드",
    description: "과거-현재-미래",
  },
  {
    count: 5 as CardSpread,
    name: "파이브카드",
    description: "상황-장애물-주변-조언-결과",
  },
];

// 애니메이션 variants
const scrollVariants = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
      },
      opacity: {
        duration: 0.5,
        delay: 0.3,
      },
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 1,
      duration: 0.6,
    },
  },
};

export default function TarotSetupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<TarotSessionSetup>({
    category: null,
    cardCount: null,
    question: "",
  });

  const handleCategorySelect = (category: TarotCategory) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleCardCountSelect = (count: CardSpread) => {
    setFormData((prev) => ({ ...prev, cardCount: count }));
  };

  const handleQuestionChange = (question: string) => {
    setFormData((prev) => ({ ...prev, question }));
  };

  const handleStart = () => {
    if (!formData.category || !formData.cardCount) return;

    // LocalStorage에 설정 저장
    localStorage.setItem("tarotSetup", JSON.stringify(formData));

    // 카드 선택 페이지로 이동
    router.push("/tarot/reading");
  };

  const isFormValid = formData.category !== null && formData.cardCount !== null;

  return (
    <Container>
      <TopRoller />

      <ScrollContent
        variants={scrollVariants}
        initial="hidden"
        animate="visible"
      >
        <ParchmentBackground />

        <FormContent variants={contentVariants}>
          {/* 섹션 1: 운세 유형 선택 */}
          <Section>
            <SectionTitle>어떤 운세를 보시겠어요?</SectionTitle>
            <CategoryGrid>
              {CATEGORIES.map((category) => (
                <CategoryCard
                  key={category.id}
                  selected={formData.category === category.id}
                  color={category.color}
                  onClick={() => handleCategorySelect(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="icon">{category.icon}</span>
                  <span className="name">{category.name}</span>
                  <span className="description">{category.description}</span>
                </CategoryCard>
              ))}
            </CategoryGrid>
          </Section>

          {/* 섹션 2: 카드 장수 선택 */}
          <Section>
            <SectionTitle>카드는 몇 장 뽑으시겠어요?</SectionTitle>
            <CardCountOptions>
              {SPREAD_OPTIONS.map((option) => (
                <CountOption
                  key={option.count}
                  selected={formData.cardCount === option.count}
                  onClick={() => handleCardCountSelect(option.count)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CountBadge>{option.count}장</CountBadge>
                  <h3>{option.name}</h3>
                  <CountDescription>{option.description}</CountDescription>
                </CountOption>
              ))}
            </CardCountOptions>
          </Section>

          {/* 섹션 3: 질문 작성 */}
          <Section>
            <QuestionSection>
              <SectionTitle>궁금한 점이 있으신가요?</SectionTitle>
              <QuestionTextarea
                placeholder="구체적으로 질문해주시면 더 정확한 해석이 가능합니다. (선택사항)"
                value={formData.question}
                onChange={(e) => handleQuestionChange(e.target.value)}
                rows={4}
              />
            </QuestionSection>
          </Section>

          {/* 시작 버튼 */}
          <StartButton
            disabled={!isFormValid}
            onClick={handleStart}
            whileHover={isFormValid ? { scale: 1.05 } : {}}
            whileTap={isFormValid ? { scale: 0.95 } : {}}
          >
            타로 시작하기
          </StartButton>
        </FormContent>
      </ScrollContent>

      <BottomRoller />
    </Container>
  );
}
