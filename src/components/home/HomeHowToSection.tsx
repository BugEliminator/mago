"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderClock, HelpCircle, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PlayingCardsFanIcon from "./PlayingCardsFanIcon";
import { useTarotSetupEntry } from "@/hooks/useTarotSetupEntry";
import TarotGuestEntryModal from "@/components/tarot/TarotGuestEntryModal";
import TarotReadingResumeModal from "@/components/tarot/TarotReadingResumeModal";
import TarotDraftResumeModal from "@/components/tarot/TarotDraftResumeModal";
import { supabase } from "@/lib/supabase/supabaseClient";
import {
  HowToCopy,
  HowToCtaButton,
  HowToDetailItem,
  HowToDetailList,
  HowToDot,
  HowToDotList,
  HowToHeader,
  HowToHeading,
  HowToInner,
  HowToLead,
  HowToMedia,
  HowToMediaImage,
  HowToRoot,
  HowToSlideArea,
  HowToSlideMotion,
  HowToSlidePanel,
  HowToSlideStack,
  HowToStepBadge,
  HowToStepBody,
  HowToStepTitle,
  HowToTab,
  HowToTabLabel,
  HowToTabList,
} from "./HomeHowTo.style";

const SLIDE_TRANSITION = { duration: 0.35, ease: "easeInOut" } as const;
const AUTOPLAY_MS = 8000;

type HomeHowToCtaAction = "tarot" | "history";

type HomeHowToStep = {
  stepNumber: string;
  tabLabel: string;
  tabIcon: LucideIcon;
  title: string;
  description: string;
  details: readonly string[];
  ctaLabel: string;
  ctaAction: HomeHowToCtaAction;
  imageSrc: string;
  imageAlt: string;
};

const HOW_TO_STEPS: readonly HomeHowToStep[] = [
  {
    stepNumber: "01",
    tabLabel: "질문 & 맥락",
    tabIcon: HelpCircle,
    title: "고민을 정교하게 다듬어 질문으로 만듭니다",
    description:
      "막연한 불안이나 궁금증을 구체적인 질문으로 바꿔야 카드가 제대로 답합니다. 상황과 가장 알고 싶은 한 가지를 골라 질문을 완성하세요.",
    details: [
      "3장·5장·7장 중에서 운명의 깊이(스프레드)를 선택합니다.",
      "연애, 커리어, 금전 등 고민 유형과 세부 디테일 칩을 고릅니다.",
      "현재 상황과 가장 궁금한 점을 정리해 입력합니다.",
    ],
    ctaLabel: "타로 시작하기",
    ctaAction: "tarot",
    imageSrc: "/image/home/step-01.png",
    imageAlt: "질문 설정 및 고민 작성 화면",
  },
  {
    stepNumber: "02",
    tabLabel: "셔플 & 선택",
    tabIcon: PlayingCardsFanIcon,
    title: "클릭으로 덱을 섞고 끌리는 카드를 고릅니다",
    description:
      "셔플 횟수와 순서가 정·역방향을 결정합니다. 느낌이 오는 카드를 골라 뽑는 순간 당신만의 스프레드가 완성됩니다.",
    details: [
      "직접 셔플해 카드 순서와 정·역방향이 정해집니다.",
      "메이저·마이너 아르카나 78장이 펼쳐집니다.",
      "끌리는 카드를 직접 골라 뽑습니다.",
    ],
    ctaLabel: "타로 시작하기",
    ctaAction: "tarot",
    imageSrc: "/image/home/step-02.png",
    imageAlt: "타로 카드 셔플 및 스프레드 선택 화면",
  },
  {
    stepNumber: "03",
    tabLabel: "심층 리딩",
    tabIcon: Sparkles,
    title: "정·역방향을 모두 읽는 마고의 심층 해석",
    description:
      "단순 키워드 나열이 아니라 당신의 질문과 맥락에 맞게 카드 한 장 한 장을 풀어냅니다. 흐름 지수와 마무리 조언까지 한 번에 확인하세요.",
    details: [
      "운세 흐름 지수와 핵심 한 줄 요약으로 결과를 빠르게 파악합니다.",
      "카드별 정·역방향 의미와 상황 맞춤 해석을 확인합니다.",
      "마고의 마무리 조언을 읽고 원하면 리딩 후기를 남깁니다.",
    ],
    ctaLabel: "타로 시작하기",
    ctaAction: "tarot",
    imageSrc: "/image/home/step-03.png",
    imageAlt: "운세 결과 및 마고의 심층 리딩 화면",
  },
  {
    stepNumber: "04",
    tabLabel: "운세 히스토리",
    tabIcon: FolderClock,
    title: "모든 리딩이 아카이빙되어 언제든 다시 열립니다",
    description:
      "오늘의 리딩은 히스토리에 자동 저장됩니다. 같은 고민의 흐름을 날짜별로 비교하고 필요할 때 꺼내 다시 읽을 수 있습니다.",
    details: [
      "마이페이지에서 지난 리딩을 모아서 봅니다.",
      "같은 고민의 흐름을 날짜별로 비교할 수 있습니다.",
      "필요할 때 기록을 다시 열어 조언을 확인합니다.",
    ],
    ctaLabel: "히스토리 보기",
    ctaAction: "history",
    imageSrc: "/image/home/step-04.png",
    imageAlt: "타로 카드 셔플 화면 — 히스토리 슬라이드 임시 이미지",
  },
];

type HowToStepCopyProps = {
  step: HomeHowToStep;
  onTarotStart: () => void;
  onHistoryView: () => void;
};

/** 스텝 우측 카피 */
function HowToStepCopy({
  step,
  onTarotStart,
  onHistoryView,
}: HowToStepCopyProps) {
  const BadgeIcon = step.tabIcon;

  return (
    <HowToCopy>
      <HowToStepBadge>
        <BadgeIcon strokeWidth={1.5} aria-hidden />
        {step.tabLabel}
      </HowToStepBadge>
      <HowToStepTitle>{step.title}</HowToStepTitle>
      <HowToStepBody>{step.description}</HowToStepBody>
      <HowToDetailList>
        {step.details.map((detail) => (
          <HowToDetailItem key={detail}>{detail}</HowToDetailItem>
        ))}
      </HowToDetailList>
      <HowToCtaButton
        type="button"
        onClick={step.ctaAction === "tarot" ? onTarotStart : onHistoryView}
      >
        {step.ctaLabel} →
      </HowToCtaButton>
    </HowToCopy>
  );
}

type HowToStepSlideProps = HowToStepCopyProps;

/** 이미지 + 카피 한 패널 */
function HowToStepSlide({ step, onTarotStart, onHistoryView }: HowToStepSlideProps) {
  return (
    <HowToSlidePanel>
      <HowToMedia>
        <HowToMediaImage
          src={step.imageSrc}
          alt={step.imageAlt}
          fill
          sizes="(min-width: 641px) 680px, 100vw"
          draggable={false}
        />
      </HowToMedia>
      <HowToStepCopy
        step={step}
        onTarotStart={onTarotStart}
        onHistoryView={onHistoryView}
      />
    </HowToSlidePanel>
  );
}

/**
 * 홈 사용법 섹션 — 탭/도트/오토플레이로 슬라이드 전환
 */
export default function HomeHowToSection() {
  const router = useRouter();
  const {
    requestTarotSetup,
    guestEntryOpen,
    readingResumeOpen,
    resumeOpen,
    handleGuestBrowse,
    handleGuestLogin,
    handleDismissGuestEntry,
    handleResumeReading,
    handleStartFreshFromReading,
    handleDismissReadingResume,
    handleResume,
    handleStartFresh,
    handleDismissResume,
  } = useTarotSetupEntry();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const autoplayTimerRef = useRef<number | null>(null);

  const clearAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current != null) {
      window.clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const startAutoplayTimer = useCallback(() => {
    clearAutoplayTimer();
    autoplayTimerRef.current = window.setInterval(() => {
      setHasInteracted(true);
      setSelectedIndex((index) => (index + 1) % HOW_TO_STEPS.length);
    }, AUTOPLAY_MS);
  }, [clearAutoplayTimer]);

  useEffect(() => {
    startAutoplayTimer();
    return clearAutoplayTimer;
  }, [startAutoplayTimer, clearAutoplayTimer]);

  const goTo = useCallback(
    (index: number) => {
      if (index === selectedIndex) {
        return;
      }

      setHasInteracted(true);
      setSelectedIndex(index);
      startAutoplayTimer();
    },
    [selectedIndex, startAutoplayTimer],
  );

  const handleHistoryView = useCallback(() => {
    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user != null) {
        router.push("/mypage/history");
        return;
      }

      router.push("/login");
    })();
  }, [router]);

  return (
    <>
      {guestEntryOpen ? (
        <TarotGuestEntryModal
          onBrowse={handleGuestBrowse}
          onLogin={handleGuestLogin}
          onDismiss={handleDismissGuestEntry}
        />
      ) : null}
      {readingResumeOpen ? (
        <TarotReadingResumeModal
          onResume={handleResumeReading}
          onStartFresh={handleStartFreshFromReading}
          onDismiss={handleDismissReadingResume}
        />
      ) : null}
      {resumeOpen ? (
        <TarotDraftResumeModal
          onResume={handleResume}
          onStartFresh={handleStartFresh}
          onDismiss={handleDismissResume}
        />
      ) : null}

      <HowToRoot aria-labelledby="home-how-to-title">
        <HowToInner>
          <HowToHeader>
            <HowToHeading id="home-how-to-title">
              질문과 심층 해석 그리고 기록까지 하나의 흐름으로
            </HowToHeading>
            <HowToLead>
              막연했던 고민을 정교하게 입력하고 직접 덱을 섞는 순간부터 오직
              당신만을 위한 맞춤 조언과 아카이빙까지 마고에서 경험해보세요.
            </HowToLead>
            <HowToTabList role="tablist" aria-label="사용 단계">
              {HOW_TO_STEPS.map((step, index) => {
                const TabIcon = step.tabIcon;
                const isActive = selectedIndex === index;
                return (
                  <HowToTab
                    key={step.stepNumber}
                    type="button"
                    role="tab"
                    $active={isActive}
                    aria-selected={isActive}
                    aria-label={step.tabLabel}
                    onClick={() => goTo(index)}
                  >
                    <TabIcon strokeWidth={1.5} aria-hidden />
                    <HowToTabLabel>{step.tabLabel}</HowToTabLabel>
                  </HowToTab>
                );
              })}
            </HowToTabList>
          </HowToHeader>
          <HowToSlideArea>
            <HowToSlideStack>
              {HOW_TO_STEPS.map((step, index) => {
                const isActive = selectedIndex === index;

                return (
                  <HowToSlideMotion
                    key={step.stepNumber}
                    role="tabpanel"
                    aria-hidden={!isActive}
                    initial={false}
                    animate={
                      isActive
                        ? hasInteracted
                          ? { opacity: [0, 1], x: [20, 0] }
                          : { opacity: 1, x: 0 }
                        : { opacity: 0, x: 0 }
                    }
                    transition={
                      isActive && hasInteracted
                        ? {
                            ...SLIDE_TRANSITION,
                            delay: SLIDE_TRANSITION.duration,
                          }
                        : SLIDE_TRANSITION
                    }
                    style={{
                      pointerEvents: isActive ? "auto" : "none",
                      zIndex: isActive ? 1 : 0,
                    }}
                  >
                    <HowToStepSlide
                      step={step}
                      onTarotStart={requestTarotSetup}
                      onHistoryView={handleHistoryView}
                    />
                  </HowToSlideMotion>
                );
              })}
            </HowToSlideStack>
          </HowToSlideArea>
          <HowToDotList aria-label="슬라이드 이동">
            {HOW_TO_STEPS.map((step, index) => {
              const isActive = selectedIndex === index;
              return (
                <HowToDot
                  key={step.stepNumber}
                  type="button"
                  $active={isActive}
                  data-active={isActive}
                  aria-label={`${step.tabLabel} 슬라이드로 이동`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => goTo(index)}
                />
              );
            })}
          </HowToDotList>
        </HowToInner>
      </HowToRoot>
    </>
  );
}
