"use client";

import { useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  HowToCopy,
  HowToDetailItem,
  HowToDetailList,
  HowToHeader,
  HowToHeading,
  HowToInner,
  HowToItem,
  HowToMedia,
  HowToMediaImage,
  HowToNavButton,
  HowToRoot,
  HowToStepBody,
  HowToStepIndex,
  HowToStepTitle,
  HowToTrack,
  HowToViewport,
} from "./HomeHowTo.style";

const HOW_TO_AUTOPLAY_MS = 10000;

type HomeHowToStep = {
  stepNumber: string;
  title: string;
  description: string;
  details: readonly string[];
  imageSrc: string;
  imageAlt: string;
};

const HOW_TO_STEPS: readonly HomeHowToStep[] = [
  {
    stepNumber: "01",
    title: "질문과 스프레드를 정합니다",
    description: "고민의 깊이와 주제에 맞춰 단계별로 질문을 완성합니다.",
    details: [
      "3장·5장·7장 중에서 운명의 깊이(스프레드)를 선택합니다.",
      "연애, 커리어, 금전 등 고민 유형과 세부 디테일 칩을 고릅니다.",
      "현재 상황과 가장 궁금한 점을 정리해 입력합니다.",
    ],
    imageSrc: "/image/home/step-01.png",
    imageAlt: "질문 설정 및 고민 작성 화면",
  },
  {
    stepNumber: "02",
    title: "직접 섞고 카드를 뽑습니다",
    description: "원하는 만큼 덱을 섞은 뒤, 펼쳐진 카드 중에서 고릅니다.",
    details: [
      "직접 셔플해 카드 순서와 정·역방향이 정해집니다.",
      "메이저·마이너 아르카나 78장이 펼쳐집니다.",
      "끌리는 카드를 직접 골라 뽑습니다.",
    ],
    imageSrc: "/image/home/step-02.png",
    imageAlt: "타로 카드 셔플 및 스프레드 선택 화면",
  },
  {
    stepNumber: "03",
    title: "심층 리딩과 조언을 받습니다",
    description: "마고가 정·역방향을 모두 반영한 리딩과 해결책을 풀어 줍니다.",
    details: [
      "운세 흐름 지수와 핵심 한 줄 요약으로 결과를 빠르게 파악합니다.",
      "카드별 정·역방향 의미와 상황 맞춤 해석을 확인합니다.",
      "마고의 마무리 조언을 읽고, 원하면 리딩 후기를 남깁니다.",
    ],
    imageSrc: "/image/home/step-03.png",
    imageAlt: "운세 결과 및 마고의 심층 리딩 화면",
  },
];

/**
 * 홈 사용법 섹션 — Embla 드래그·관성·무한 루프 + 10초 오토플레이
 */
export default function HomeHowToSection() {
  const autoplay = useRef(
    Autoplay({
      delay: HOW_TO_AUTOPLAY_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      duration: 25,
    },
    [autoplay.current],
  );

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <HowToRoot aria-labelledby="home-how-to-title">
      <HowToInner>
        <HowToHeader>
          <HowToHeading id="home-how-to-title">어떻게 사용하나요?</HowToHeading>
        </HowToHeader>
          <HowToNavButton
            type="button"
            $side="prev"
            aria-label="이전 사용 방법"
            onClick={scrollPrev}
          >
            <ChevronLeft size={20} aria-hidden />
          </HowToNavButton>
          <HowToViewport ref={emblaRef}>
            <HowToTrack>
              {HOW_TO_STEPS.map((step) => (
                <HowToItem key={step.stepNumber}>
                  <HowToMedia>
                    <HowToMediaImage
                      src={step.imageSrc}
                      alt={step.imageAlt}
                      fill
                      sizes="(min-width: 641px) 680px, 100vw"
                      draggable={false}
                    />
                  </HowToMedia>
                  <HowToCopy>
                    <HowToStepIndex>{step.stepNumber}</HowToStepIndex>
                    <HowToStepTitle>{step.title}</HowToStepTitle>
                    <HowToStepBody>{step.description}</HowToStepBody>
                    <HowToDetailList>
                      {step.details.map((detail) => (
                        <HowToDetailItem key={detail}>{detail}</HowToDetailItem>
                      ))}
                    </HowToDetailList>
                  </HowToCopy>
                </HowToItem>
              ))}
            </HowToTrack>
          </HowToViewport>
          <HowToNavButton
            type="button"
            $side="next"
            aria-label="다음 사용 방법"
            onClick={scrollNext}
          >
            <ChevronRight size={20} aria-hidden />
          </HowToNavButton>
      </HowToInner>
    </HowToRoot>
  );
}
