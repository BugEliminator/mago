import type { EncyclopediaCardDetail } from "@/types/encyclopedia";

/** 소드 수트 핀 — positions의 x/y는 앞면 이미지 기준 퍼센트 */
const SWORDS_CARD_COORDINATES: readonly EncyclopediaCardDetail[] = [
  {
    cardSlug: "ace-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 58 }] },
      { spotOrder: 2, positions: [{ x: 50, y: 10 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 25, y: 18 },
          { x: 80, y: 18 },
        ],
      },
      { spotOrder: 4, positions: [{ x: 50, y: 88 }] },
    ],
  },
  {
    cardSlug: "two-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 30 }] },
      {
        spotOrder: 2,
        positions: [{ x: 49, y: 50 }],
      },
      { spotOrder: 3, positions: [{ x: 50, y: 68 }] },
      { spotOrder: 4, positions: [{ x: 20, y: 65 }] },
      { spotOrder: 5, positions: [{ x: 82, y: 11 }] },
    ],
  },
  {
    cardSlug: "three-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 52 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 25, y: 24 },
          { x: 50, y: 20 },
          { x: 75, y: 25 },
        ],
      },
      {
        spotOrder: 3,
        positions: [
          { x: 15, y: 30 },
          { x: 80, y: 65 },
        ],
      },
    ],
  },
  {
    cardSlug: "four-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 70 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 56, y: 30 },
          { x: 72, y: 30 },
          { x: 88, y: 30 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 50, y: 91 }] },
      { spotOrder: 4, positions: [{ x: 13, y: 18 }] },
    ],
  },
  {
    cardSlug: "five-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 65, y: 45 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 15, y: 70 },
          { x: 40, y: 76 },
        ],
      },
      {
        spotOrder: 3,
        positions: [
          { x: 80, y: 34 },
          { x: 30, y: 89 },
        ],
      },
      { spotOrder: 4, positions: [{ x: 35, y: 68 }] },
      {
        spotOrder: 5,
        positions: [{ x: 30, y: 33 }],
      },
    ],
  },
  {
    cardSlug: "six-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 22, y: 40 }] },
      {
        spotOrder: 2,
        positions: [{ x: 53, y: 78 }],
      },
      { spotOrder: 3, positions: [{ x: 80, y: 45 }] },
      {
        spotOrder: 4,
        positions: [
          { x: 92, y: 94 },
          { x: 8, y: 50 },
        ],
      },
      { spotOrder: 5, positions: [{ x: 72, y: 32 }] },
    ],
  },
  {
    cardSlug: "seven-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 55 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 53, y: 36 },
          { x: 50, y: 78 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 43, y: 46 }] },
      {
        spotOrder: 4,
        positions: [{ x: 82, y: 48 }],
      },
      { spotOrder: 5, positions: [{ x: 95, y: 72 }] },
    ],
  },
  {
    cardSlug: "eight-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 38, y: 21 }] },
      { spotOrder: 2, positions: [{ x: 38, y: 49 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 15, y: 49 },
          { x: 78, y: 42 },
        ],
      },
      { spotOrder: 4, positions: [{ x: 50, y: 88 }] },
      { spotOrder: 5, positions: [{ x: 83, y: 56 }] },
    ],
  },
  {
    cardSlug: "nine-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 65, y: 60 }] },
      { spotOrder: 2, positions: [{ x: 50, y: 25 }] },
      { spotOrder: 3, positions: [{ x: 60, y: 35 }] },
      { spotOrder: 4, positions: [{ x: 20, y: 97 }] },
      { spotOrder: 5, positions: [{ x: 70, y: 83 }] },
    ],
  },
  {
    cardSlug: "ten-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 65, y: 80 }] },
      { spotOrder: 2, positions: [{ x: 50, y: 45 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 20, y: 83 },
          { x: 40, y: 97 },
        ],
      },
      {
        spotOrder: 4,
        positions: [
          { x: 50, y: 15 },
          { x: 50, y: 52 },
        ],
      },
      { spotOrder: 5, positions: [{ x: 50, y: 62 }] },
    ],
  },
  {
    cardSlug: "page-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 34 }] },
      { spotOrder: 2, positions: [{ x: 78, y: 17 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 58, y: 15 },
          { x: 43, y: 45 },
        ],
      },
      {
        spotOrder: 4,
        positions: [
          { x: 30, y: 20 },
          { x: 32, y: 6 },
        ],
      },
      { spotOrder: 5, positions: [{ x: 50, y: 82 }] },
    ],
  },
  {
    cardSlug: "knight-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 65, y: 38 }] },
      { spotOrder: 2, positions: [{ x: 80, y: 50 }] },
      { spotOrder: 3, positions: [{ x: 28, y: 13 }] },
      { spotOrder: 4, positions: [{ x: 40, y: 55 }] },
      { spotOrder: 5, positions: [{ x: 57, y: 57 }] },
      {
        spotOrder: 6,
        positions: [
          { x: 18, y: 72 },
          { x: 55, y: 15 },
        ],
      },
    ],
  },
  {
    cardSlug: "queen-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 38, y: 38 }] },
      { spotOrder: 2, positions: [{ x: 62, y: 20 }] },
      { spotOrder: 3, positions: [{ x: 86, y: 34 }] },
      {
        spotOrder: 4,
        positions: [
          { x: 32, y: 26 },
          { x: 40, y: 70 },
        ],
      },
      {
        spotOrder: 5,
        positions: [
          { x: 80, y: 52 },
          { x: 15, y: 80 },
        ],
      },
    ],
  },
  {
    cardSlug: "king-of-swords",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 42 }] },
      { spotOrder: 2, positions: [{ x: 28, y: 25 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 53, y: 19 },
          { x: 50, y: 48 },
        ],
      },
      { spotOrder: 4, positions: [{ x: 70, y: 6 }] },
      {
        spotOrder: 5,
        positions: [
          { x: 85, y: 30 },
          { x: 11, y: 75 },
        ],
      },
    ],
  },
];

function validateSwordsCardCoordinates(
  details: readonly EncyclopediaCardDetail[],
): void {
  if (details.length !== 14) {
    throw new Error(`소드 카드 좌표 개수 오류: ${details.length}`);
  }

  const seenCardSlugs = new Set<string>();

  details.forEach((detail) => {
    if (seenCardSlugs.has(detail.cardSlug)) {
      throw new Error(`소드 카드 slug 중복: ${detail.cardSlug}`);
    }
    seenCardSlugs.add(detail.cardSlug);

    detail.spots.forEach((spot, spotIndex) => {
      if (spot.spotOrder !== spotIndex + 1) {
        throw new Error(
          `${detail.cardSlug} Point 번호 오류: ${spot.spotOrder}`,
        );
      }

      if (spot.positions.length === 0) {
        throw new Error(`${detail.cardSlug} Point ${spot.spotOrder} 좌표 누락`);
      }

      spot.positions.forEach((position) => {
        if (
          position.x < 0 ||
          position.x > 100 ||
          position.y < 0 ||
          position.y > 100
        ) {
          throw new Error(
            `${detail.cardSlug} Point ${spot.spotOrder} 좌표 범위 오류`,
          );
        }
      });
    });
  });
}

validateSwordsCardCoordinates(SWORDS_CARD_COORDINATES);

export const SWORDS_CARD_DETAILS = SWORDS_CARD_COORDINATES;
