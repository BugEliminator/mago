/** LLM에 전달하는 readings 배열 항목 */
export type TarotReadingLlmReadingItem = {
  position_label: string;
  position_desc: string;
  card_name_en: string;
  is_reversed: boolean;
  keywords: string[];
  meaning: string;
};

/** MAGO 코드 기반 프롬프트에 넘기는 v2 입력 JSON */
export type TarotReadingLlmPayload = {
  schema_version: 2;
  timestamp: {
    local: string;
  };
  user: {
    nickname: string;
    gender: string;
    age: number | null;
  };
  consultation: {
    main_category: string;
    detail_category: string;
    situation: string;
    question: string;
  };
  readings: TarotReadingLlmReadingItem[];
};
