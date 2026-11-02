import type { EncyclopediaCardDetail } from "@/types/encyclopedia";

/** 메이저 핀 — positions의 x/y는 앞면 이미지 기준 퍼센트 */
const MAJOR_CARD_COORDINATES: readonly EncyclopediaCardDetail[] = [
  {
    cardSlug: "the-fool",
    spots: [
      { spotOrder: 1, positions: [{ x: 57, y: 4 }] },
      { spotOrder: 2, positions: [{ x: 45, y: 43 }] },
      { spotOrder: 3, positions: [{ x: 91, y: 30 }] },
      { spotOrder: 4, positions: [{ x: 75, y: 15 }] },
      { spotOrder: 5, positions: [{ x: 83, y: 75 }] },
      { spotOrder: 6, positions: [{ x: 15, y: 65 }] },
    ],
  },
  {
    cardSlug: "the-magician",
    spots: [
      { spotOrder: 1, positions: [{ x: 55, y: 3 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 20, y: 25 },
          { x: 85, y: 50 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 20, y: 7 }] },
      { spotOrder: 4, positions: [{ x: 40, y: 64 }] },
      {
        spotOrder: 5,
        positions: [
          { x: 45, y: 15 },
          { x: 47, y: 48 },
        ],
      },
      { spotOrder: 6, positions: [{ x: 70, y: 84 }] },
    ],
  },
  {
    cardSlug: "the-high-priestess",
    spots: [
      {
        spotOrder: 1,
        positions: [
          { x: 10, y: 30 },
          { x: 90, y: 30 },
        ],
      },
      { spotOrder: 2, positions: [{ x: 72, y: 20 }] },
      { spotOrder: 3, positions: [{ x: 45, y: 60 }] },
      {
        spotOrder: 4,
        positions: [
          { x: 50, y: 22 },
          { x: 55, y: 88 },
        ],
      },
      { spotOrder: 5, positions: [{ x: 55, y: 48 }] },
    ],
  },
  {
    cardSlug: "the-empress",
    spots: [
      { spotOrder: 1, positions: [{ x: 33, y: 50 }] },
      { spotOrder: 2, positions: [{ x: 23, y: 18 }] },
      { spotOrder: 3, positions: [{ x: 25, y: 77 }] },
      { spotOrder: 4, positions: [{ x: 55, y: 10 }] },
      { spotOrder: 5, positions: [{ x: 51, y: 84 }] },
    ],
  },
  {
    cardSlug: "the-emperor",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 34 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 12, y: 43 },
          { x: 88, y: 43 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 16, y: 67 }] },
      { spotOrder: 4, positions: [{ x: 52, y: 78 }] },
      { spotOrder: 5, positions: [{ x: 90, y: 27 }] },
    ],
  },
  {
    cardSlug: "the-hierophant",
    spots: [
      {
        spotOrder: 1,
        positions: [
          { x: 50, y: 32 },
          { x: 10, y: 7 },
          { x: 90, y: 7 },
        ],
      },
      {
        spotOrder: 2,
        positions: [
          { x: 75, y: 25 },
          { x: 60, y: 10 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 20, y: 27 }] },
      { spotOrder: 4, positions: [{ x: 51, y: 85 }] },
      {
        spotOrder: 5,
        positions: [
          { x: 20, y: 84 },
          { x: 80, y: 84 },
        ],
      },
    ],
  },
  {
    cardSlug: "the-lovers",
    spots: [
      {
        spotOrder: 1,
        positions: [
          { x: 80, y: 63 },
          { x: 20, y: 63 },
        ],
      },
      { spotOrder: 2, positions: [{ x: 50, y: 29 }] },
      { spotOrder: 3, positions: [{ x: 60, y: 5 }] },
      {
        spotOrder: 4,
        positions: [
          { x: 8, y: 40 },
          { x: 92, y: 40 },
        ],
      },
      { spotOrder: 5, positions: [{ x: 8, y: 56 }] },
    ],
  },
  {
    cardSlug: "the-chariot",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 34 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 20, y: 80 },
          { x: 80, y: 80 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 23, y: 44 }] },
      {
        spotOrder: 4,
        positions: [
          { x: 70, y: 32 },
          { x: 30, y: 32 },
        ],
      },
      { spotOrder: 5, positions: [{ x: 60, y: 8 }] },
    ],
  },
  {
    cardSlug: "strength",
    spots: [
      { spotOrder: 1, positions: [{ x: 37, y: 45 }] },
      { spotOrder: 2, positions: [{ x: 60, y: 43 }] },
      { spotOrder: 3, positions: [{ x: 12, y: 14 }] },
      { spotOrder: 4, positions: [{ x: 36, y: 34 }] },
    ],
  },
  {
    cardSlug: "the-hermit",
    spots: [
      { spotOrder: 1, positions: [{ x: 60, y: 80 }] },
      { spotOrder: 2, positions: [{ x: 7, y: 14 }] },
      { spotOrder: 3, positions: [{ x: 9, y: 30 }] },
      { spotOrder: 4, positions: [{ x: 39, y: 51 }] },
    ],
  },
  {
    cardSlug: "wheel-of-fortune",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 50 }] },
      { spotOrder: 2, positions: [{ x: 50, y: 18 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 87, y: 60 },
          { x: 10, y: 60 },
        ],
      },
      { spotOrder: 4, positions: [{ x: 58, y: 35 }] },
      {
        spotOrder: 5,
        positions: [
          { x: 14, y: 13 },
          { x: 14, y: 87 },
          { x: 80, y: 13 },
          { x: 80, y: 87 },
        ],
      },
    ],
  },
  {
    cardSlug: "justice",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 34 }] },
      { spotOrder: 2, positions: [{ x: 86, y: 53 }] },
      { spotOrder: 3, positions: [{ x: 10, y: 34 }] },
      {
        spotOrder: 4,
        positions: [
          { x: 90, y: 15 },
          { x: 10, y: 15 },
        ],
      },
    ],
  },
  {
    cardSlug: "the-hanged-man",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 51 }] },
      { spotOrder: 2, positions: [{ x: 82, y: 10 }] },
      { spotOrder: 3, positions: [{ x: 59, y: 75 }] },
      { spotOrder: 4, positions: [{ x: 50, y: 83 }] },
    ],
  },
  {
    cardSlug: "death",
    spots: [
      { spotOrder: 1, positions: [{ x: 19, y: 30 }] },
      { spotOrder: 2, positions: [{ x: 63, y: 13 }] },
      { spotOrder: 3, positions: [{ x: 76, y: 76 }] },
      { spotOrder: 4, positions: [{ x: 89, y: 35 }] },
      { spotOrder: 5, positions: [{ x: 53, y: 50 }] },
    ],
  },
  {
    cardSlug: "temperance",
    spots: [
      { spotOrder: 1, positions: [{ x: 48, y: 23 }] },
      { spotOrder: 2, positions: [{ x: 54, y: 40 }] },
      { spotOrder: 3, positions: [{ x: 58, y: 82 }] },
      { spotOrder: 4, positions: [{ x: 40, y: 30 }] },
      { spotOrder: 5, positions: [{ x: 20, y: 64 }] },
    ],
  },
  {
    cardSlug: "the-devil",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 25 }] },
      { spotOrder: 2, positions: [{ x: 50, y: 8 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 12, y: 20 },
          { x: 90, y: 55 },
        ],
      },
      { spotOrder: 4, positions: [{ x: 50, y: 76 }] },
      {
        spotOrder: 5,
        positions: [
          { x: 17, y: 81 },
          { x: 80, y: 81 },
        ],
      },
    ],
  },
  {
    cardSlug: "the-tower",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 46 }] },
      { spotOrder: 2, positions: [{ x: 85, y: 13 }] },
      { spotOrder: 3, positions: [{ x: 28, y: 12 }] },
      {
        spotOrder: 4,
        positions: [
          { x: 23, y: 59 },
          { x: 78, y: 59 },
        ],
      },
      { spotOrder: 5, positions: [{ x: 51, y: 31 }] },
    ],
  },
  {
    cardSlug: "the-star",
    spots: [
      { spotOrder: 1, positions: [{ x: 70, y: 48 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 25, y: 60 },
          { x: 90, y: 85 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 50, y: 75 }] },
      { spotOrder: 4, positions: [{ x: 50, y: 16 }] },
      { spotOrder: 5, positions: [{ x: 89, y: 40 }] },
    ],
  },
  {
    cardSlug: "the-moon",
    spots: [
      { spotOrder: 1, positions: [{ x: 43, y: 18 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 35, y: 64 },
          { x: 75, y: 64 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 50, y: 86 }] },
      { spotOrder: 4, positions: [{ x: 50, y: 51 }] },
    ],
  },
  {
    cardSlug: "the-sun",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 10 }] },
      { spotOrder: 2, positions: [{ x: 40, y: 61 }] },
      { spotOrder: 3, positions: [{ x: 54, y: 77 }] },
      { spotOrder: 4, positions: [{ x: 84, y: 42 }] },
      { spotOrder: 5, positions: [{ x: 15, y: 61 }] },
    ],
  },
  {
    cardSlug: "judgement",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 27 }] },
      { spotOrder: 2, positions: [{ x: 33, y: 42 }] },
      { spotOrder: 3, positions: [{ x: 50, y: 77 }] },
      { spotOrder: 4, positions: [{ x: 40, y: 58 }] },
    ],
  },
  {
    cardSlug: "the-world",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 48 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 73, y: 51 },
          { x: 25, y: 51 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 12, y: 35 }] },
      {
        spotOrder: 4,
        positions: [
          { x: 10, y: 13 },
          { x: 10, y: 77 },
          { x: 87, y: 10 },
          { x: 87, y: 77 },
        ],
      },
    ],
  },
];

function validateMajorCardCoordinates(
  details: readonly EncyclopediaCardDetail[],
): void {
  if (details.length !== 22) {
    throw new Error(`메이저 카드 좌표 개수 오류: ${details.length}`);
  }

  const seenCardSlugs = new Set<string>();

  details.forEach((detail) => {
    if (seenCardSlugs.has(detail.cardSlug)) {
      throw new Error(`메이저 카드 slug 중복: ${detail.cardSlug}`);
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

validateMajorCardCoordinates(MAJOR_CARD_COORDINATES);

export const MAJOR_CARD_DETAILS = MAJOR_CARD_COORDINATES;
