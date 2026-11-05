import type {
  CardSpread,
  TarotCategory,
  TarotSessionSetup,
} from "@/types/tarot";

/** 브라우저가 서버에 전달하는 선택 카드 최소 정보 */
export type TarotReadingPickedCardRequest = {
  cardId: number;
  isReversed: boolean;
};

/** POST /api/tarot/reading 요청 본문 */
export type TarotReadingBrowserRequest = {
  setup: TarotSessionSetup;
  pickedCards: TarotReadingPickedCardRequest[];
};

/** API 유효성 검사를 통과해 필수 설정값이 확정된 서버 내부 요청 */
export type ValidatedTarotReadingRequest = {
  setup: TarotSessionSetup & {
    category: TarotCategory;
    cardCount: CardSpread;
  };
  pickedCards: TarotReadingPickedCardRequest[];
};

/** 클라이언트 요청 함수가 인증 헤더 구성을 위해 함께 받는 값 */
export type RequestMagoReadingClientInput = TarotReadingBrowserRequest & {
  accessToken: string;
};
