"use client";

import { useCallback, useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";
import { openEmailInquiry, openKakaoInquiry } from "@/lib/support/inquiryContact";
import {
  FaqAnswerBody,
  FaqAnswerInner,
  FaqAnswerParagraph,
  FaqAnswerWrap,
  FaqAside,
  FaqBulletItem,
  FaqBulletList,
  FaqCtaList,
  FaqHeading,
  FaqHeadingSub,
  FaqInner,
  FaqItemRoot,
  FaqLayout,
  FaqList,
  FaqQuestionButton,
  FaqRoot,
  FaqTip,
  FaqTipTitle,
  FaqToggleIcon,
} from "./HomeFaq.style";
import { HowToCtaButton } from "./HomeHowTo.style";
import { HOME_FAQ_ITEMS } from "@/lib/seo/homeFaqContent";
import type { HomeFaqAnswer, HomeFaqItem } from "@/types/homeFaq";

/** FAQ 답변 — 단문 또는 intro·불릿·outro 블록 */
function FaqAnswerContent({ answer }: { answer: HomeFaqAnswer }) {
  if (typeof answer === "string") {
    return (
      <FaqAnswerBody>
        <FaqAnswerParagraph>{answer}</FaqAnswerParagraph>
      </FaqAnswerBody>
    );
  }

  return (
    <FaqAnswerBody>
      <FaqAnswerParagraph>{answer.intro}</FaqAnswerParagraph>
      <FaqBulletList>
        {answer.bullets.map((bullet) => (
          <FaqBulletItem key={bullet}>{bullet}</FaqBulletItem>
        ))}
      </FaqBulletList>
      {answer.outro != null ? (
        <FaqAnswerParagraph>{answer.outro}</FaqAnswerParagraph>
      ) : null}
      {answer.tip != null ? (
        <FaqTip>
          <FaqTipTitle>
            <Lightbulb size={16} strokeWidth={1.75} aria-hidden />
            {answer.tip.title}
          </FaqTipTitle>
          <FaqAnswerParagraph>{answer.tip.body}</FaqAnswerParagraph>
        </FaqTip>
      ) : null}
    </FaqAnswerBody>
  );
}

type FaqAccordionItemProps = {
  item: HomeFaqItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
};

/** FAQ 아코디언 한 줄 */
function FaqAccordionItem({ item, isOpen, onToggle }: FaqAccordionItemProps) {
  return (
    <FaqItemRoot>
      <FaqQuestionButton
        type="button"
        $open={isOpen}
        aria-expanded={isOpen}
        onClick={() => onToggle(item.id)}
      >
        {item.question}
        <FaqToggleIcon $open={isOpen} aria-hidden>
          <ChevronDown size={20} strokeWidth={2} />
        </FaqToggleIcon>
      </FaqQuestionButton>
      <FaqAnswerWrap $open={isOpen} aria-hidden={!isOpen}>
        <FaqAnswerInner>
          <FaqAnswerContent answer={item.answer} />
        </FaqAnswerInner>
      </FaqAnswerWrap>
    </FaqItemRoot>
  );
}

/**
 * 홈 FAQ 섹션 — 좌측 제목·문의 CTA, 우측 아코디언
 */
export default function HomeFaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  const handleKakaoInquiry = useCallback(() => {
    openKakaoInquiry();
  }, []);

  const handleEmailInquiry = useCallback(() => {
    void openEmailInquiry();
  }, []);

  return (
    <FaqRoot aria-labelledby="home-faq-title">
      <FaqInner>
        <FaqLayout>
          <FaqAside>
            <div>
              <FaqHeading id="home-faq-title">자주 묻는 질문</FaqHeading>
              <FaqHeadingSub>마고에 대해 궁금한 점이 있으신가요?</FaqHeadingSub>
            </div>
            <FaqCtaList>
              <HowToCtaButton type="button" onClick={handleKakaoInquiry}>
                카카오 문의하기
              </HowToCtaButton>
              <HowToCtaButton type="button" onClick={handleEmailInquiry}>
                이메일 문의하기
              </HowToCtaButton>
            </FaqCtaList>
          </FaqAside>

          <FaqList role="list">
            {HOME_FAQ_ITEMS.map((item) => (
              <FaqAccordionItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={handleToggle}
              />
            ))}
          </FaqList>
        </FaqLayout>
      </FaqInner>
    </FaqRoot>
  );
}
