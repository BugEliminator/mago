/** 홈 FAQ 답변 안의 팁 블록 */
export type HomeFaqTip = {
  title: string;
  body: string;
};

/** intro·불릿·outro 로 구성된 FAQ 답변 */
export type HomeFaqStructuredAnswer = {
  intro: string;
  bullets: readonly string[];
  outro?: string;
  tip?: HomeFaqTip;
};

export type HomeFaqAnswer = string | HomeFaqStructuredAnswer;

/** 홈 FAQ 한 항목 */
export type HomeFaqItem = {
  id: string;
  question: string;
  answer: HomeFaqAnswer;
};
