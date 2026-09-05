import {
  formatHomeFaqAnswerPlainText,
  HOME_FAQ_ITEMS,
} from "@/lib/seo/homeFaqContent";

type FaqJsonLdAnswer = {
  "@type": "Answer";
  text: string;
};

type FaqJsonLdQuestion = {
  "@type": "Question";
  name: string;
  acceptedAnswer: FaqJsonLdAnswer;
};

/** schema.org FAQPage JSON-LD */
export type HomeFaqJsonLd = {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: FaqJsonLdQuestion[];
};

/** 홈 FAQ 항목을 FAQPage 구조화 데이터로 변환한다 */
export function buildHomeFaqJsonLd(): HomeFaqJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: formatHomeFaqAnswerPlainText(item.answer),
      },
    })),
  };
}
