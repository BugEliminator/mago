"use client";

import { useCallback, useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabaseClient";
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

/** 문의 페이지와 동일한 연락처 */
const ADMIN_EMAIL = "incertum.studio@gmail.com";
const KAKAO_OPENCHAT_URL = "https://open.kakao.com/o/sxIy8Uyi";

type HomeFaqTip = {
  title: string;
  body: string;
};

type HomeFaqStructuredAnswer = {
  intro: string;
  bullets: readonly string[];
  outro?: string;
  tip?: HomeFaqTip;
};

type HomeFaqAnswer = string | HomeFaqStructuredAnswer;

type HomeFaqItem = {
  id: string;
  question: string;
  answer: HomeFaqAnswer;
};

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

/** 홈 FAQ — 추후 실제 Q/A로 교체 */
const HOME_FAQ_ITEMS: readonly HomeFaqItem[] = [
  {
    id: "faq-01",
    question: "MAGO(마고)는 무엇을 의미하나요?",
    answer: {
      intro:
        "동서양에서 사람들에게 지혜를 전해 온 영적인 존재의 이름에서 유래했습니다.",
      bullets: [
        "스페인어: 삶의 비밀과 길을 풀어내는 마법사(Mago)",
        "한국 신화: 세상을 다스리고 삶의 길을 터 주는 마고(麻姑)할미",
      ],
      outro:
        "마고는 78장 타로 카드의 언어로 마음속 고민을 풀어내어 명확한 삶의 통찰과 방향을 제시합니다.",
    },
  },
  {
    id: "faq-02",
    question: "AI가 풀어주는 타로 리딩, 과연 정확하고 믿을 만한가요?",
    answer:
      "단순 키워드 조합이나 템플릿 문구를 돌려쓰지 않습니다. 유저님의 구체적인 고민 상황과 78장 풀 덱(Full-deck) 카드의 정·역방향 상징성을 정교하게 결합하여 리딩합니다. 오직 유저님만을 위해 작성된 전문 타로 마스터 수준의 1:1 심층 분석을 제공합니다.",
  },
  {
    id: "faq-03",
    question: "서비스 이용 요금은 어떻게 되나요? 추가 결제가 있나요?",
    answer: {
      intro:
        "기본적으로 1회성 단건 결제로 운영되며, 감춰진 추가 결제나 자동 구독은 일절 없습니다.",
      bullets: [
        "3장 스프레드: 1,500원",
        "5장 스프레드: 2,500원",
        "7장 심층 스프레드: 3,500원",
      ],
      tip: {
        title: "무료로 이용하는 방법",
        body: "매일 출석체크, 후기 작성, 간단한 광고 참여로 엽전을 적립하시면 결제 없이도 얼마든지 무료 심층 리딩을 즐기실 수 있습니다!",
      },
    },
  },
  {
    id: "faq-04",
    question: "타로 카드나 용어를 전혀 몰라도 이용할 수 있나요?",
    answer:
      "네, 전혀 문제없습니다! 질문 작성을 돕는 '고민 칩 UI'가 준비되어 있어 클릭 몇 번으로 쉽게 고민 상황을 구성할 수 있습니다. 결과 페이지에서도 어려운 전문 용어 대신 직관적인 핵심 요약과 친절한 해설을 함께 제공합니다.",
  },
  {
    id: "faq-05",
    question: "질문을 어떻게 입력해야 더 정교한 리딩을 얻을 수 있나요?",
    answer:
      '"제 연애운 어떤가요?" 같은 모호한 질문보다는 "3개월 전 헤어진 연인과 재회할 수 있을까요?"처럼 현재 상황, 상대방과의 관계, 구체적인 고민 포인트를 적어주실수록 훨씬 정교하고 와닿는 맞춤 분석 결과를 받으실 수 있습니다.',
  },
  {
    id: "faq-06",
    question: "결제 오류가 발생하거나 문의사항이 있을 땐 어떻게 하나요?",
    answer:
      "이용 중 불편을 겪으셨거나 오류가 발생했다면 좌측의 카톡 문의하기 또는 이메일 문의하기 버튼을 통해 언제든 연락해 주세요. 확인 즉시 신속하게 안내 및 조치를 도와드리겠습니다.",
  },
];

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
    window.open(KAKAO_OPENCHAT_URL, "_blank", "noopener,noreferrer");
  }, []);

  const handleEmailInquiry = useCallback(() => {
    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const senderEmail = session?.user?.email?.trim() ?? "";

      const subject = encodeURIComponent("[마고] 서비스 이용 문의");
      const body = encodeURIComponent(
        `안녕하세요, AI 타로 MAGO 고객지원팀입니다.\n` +
          `겪으신 불편을 신속하게 해결해 드리기 위해 아래 양식을 작성해 주세요.\n\n` +
          `----------------------------------------\n` +
          `1. 문의 유형 (해당하는 곳에 [V] 표시를 남겨주세요)\n` +
          `   [  ] 타로 리딩 결과 오류 / 유실\n` +
          `   [  ] 복채(코인) 결제 및 충전 관련\n` +
          `   [  ] 계정 및 로그인\n` +
          `   [  ] 기타 서비스 이용 및 제안\n\n` +
          `2. 가입 계정 (이메일): ${senderEmail || "(미가입 상태)"}\n\n` +
          `3. 상세 문의 내용:\n` +
          `   (오류가 발생한 상황이나 자세한 이미지 내용이나 질문 내용을 자유롭게 적어주세요.)\n` +
          `   \n\n\n` +
          `----------------------------------------`,
      );

      window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
      toast.success("기본 메일 앱 연결을 시도합니다.");
    })();
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
