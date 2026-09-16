import type {
  EncyclopediaCardDetail,
  EncyclopediaCardId,
} from "@/types/encyclopedia";

/**
 * 카드 상세 키워드 — 샘플은 펜타클 여왕만.
 * x/y는 앞면 이미지 기준 퍼센트.
 */
const CARD_DETAILS: readonly EncyclopediaCardDetail[] = [
  {
    cardId: "pentacles-76",
    pins: [
      {
        id: "queen",
        x: 50,
        y: 27,
        title: "여왕",
        body: "다른 여왕들처럼 왕좌에 곧게 앉기보다, 무릎 위 펜타클을 내려다봅니다. 금화를 아이처럼 아끼고 돌보는 시선입니다.",
      },
      {
        id: "pentacle",
        x: 32,
        y: 40,
        title: "펜타클",
        body: "시종·기사처럼 손끝으로 들지 않고 무릎에 품습니다. 멀리서 보는 관찰이 아니라, 가까이 끌어안은 친밀함입니다.",
      },
      {
        id: "flowers",
        x: 12,
        y: 8,
        title: "꽃",
        body: "여왕과 왕좌를 화려한 꽃이 감쌉니다. 메마른 땅이 정원으로 피어나며, 풍요와 자연과의 연결을 보여 줍니다.",
      },
      {
        id: "rabbit",
        x: 90,
        y: 86,
        title: "토끼",
        body: "오른쪽 아래 토끼는 다산의 상징입니다. 꽃과 무릎의 펜타클이 말하는 수확·친밀과 이어집니다.",
      },
      {
        id: "throne",
        x: 73,
        y: 58,
        title: "왕좌",
        body: "돌 왕좌는 안정과 물질적 기반을 받칩니다. 여왕이 기대는 자리는 일시적 행운이 아니라 쌓아 온 토대입니다.",
      },
    ],
  },
];

const DETAIL_BY_ID = new Map<EncyclopediaCardId, EncyclopediaCardDetail>(
  CARD_DETAILS.map((detail) => [detail.cardId, detail]),
);

/** 카드 상세 해설 — 없으면 null */
export function findEncyclopediaCardDetail(
  cardId: EncyclopediaCardId,
): EncyclopediaCardDetail | null {
  return DETAIL_BY_ID.get(cardId) ?? null;
}
