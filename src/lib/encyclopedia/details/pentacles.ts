import type { EncyclopediaCardDetail } from "@/types/encyclopedia";

/** 펜타클 수트 핀 — positions의 x/y는 앞면 이미지 기준 퍼센트 */
const PENTACLES_CARD_COORDINATES: readonly EncyclopediaCardDetail[] = [
  {
    cardSlug: "ace-of-pentacles",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 43 }] },
      { spotOrder: 2, positions: [{ x: 62, y: 31 }] },
      { spotOrder: 3, positions: [{ x: 30, y: 84 }] },
      { spotOrder: 4, positions: [{ x: 64, y: 75 }] },
      { spotOrder: 5, positions: [{ x: 72, y: 82 }] },
    ],
  },
  {
    cardSlug: "two-of-pentacles",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 50 }] },
      { spotOrder: 2, positions: [{ x: 53, y: 22 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 10, y: 35 },
          { x: 84, y: 53 },
        ],
      },
      { spotOrder: 4, positions: [{ x: 50, y: 42 }] },
      {
        spotOrder: 5,
        positions: [
          { x: 20, y: 82 },
          { x: 80, y: 80 },
        ],
      },
    ],
  },
  {
    cardSlug: "three-of-pentacles",
    spots: [
      { spotOrder: 1, positions: [{ x: 22, y: 58 }] },
      { spotOrder: 2, positions: [{ x: 62, y: 54 }] },
      { spotOrder: 3, positions: [{ x: 79, y: 60 }] },
      {
        spotOrder: 4,
        positions: [{ x: 49, y: 21 }],
      },
      { spotOrder: 5, positions: [{ x: 50, y: 34 }] },
    ],
  },
  {
    cardSlug: "four-of-pentacles",
    spots: [
      {
        spotOrder: 1,
        positions: [
          { x: 50, y: 52 },
          { x: 50, y: 28 },
          { x: 32, y: 84 },
          { x: 68, y: 84 },
        ],
      },
      { spotOrder: 2, positions: [{ x: 50, y: 39 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 15, y: 73 },
          { x: 83, y: 73 },
        ],
      },
    ],
  },
  {
    cardSlug: "five-of-pentacles",
    spots: [
      {
        spotOrder: 1,
        positions: [
          { x: 28, y: 75 },
          { x: 70, y: 63 },
        ],
      },
      { spotOrder: 2, positions: [{ x: 37, y: 66 }] },
      { spotOrder: 3, positions: [{ x: 90, y: 40 }] },
      { spotOrder: 4, positions: [{ x: 50, y: 20 }] },
    ],
  },
  {
    cardSlug: "six-of-pentacles",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 50 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 15, y: 75 },
          { x: 83, y: 75 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 30, y: 63 }] },
      { spotOrder: 4, positions: [{ x: 82, y: 48 }] },
    ],
  },
  {
    cardSlug: "seven-of-pentacles",
    spots: [
      { spotOrder: 1, positions: [{ x: 67, y: 35 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 25, y: 58 },
          { x: 70, y: 86 },
        ],
      },
    ],
  },
  {
    cardSlug: "eight-of-pentacles",
    spots: [
      { spotOrder: 1, positions: [{ x: 41, y: 65 }] },
      { spotOrder: 2, positions: [{ x: 60, y: 62 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 87, y: 35 },
          { x: 81, y: 80 },
          { x: 31, y: 91 },
        ],
      },
      { spotOrder: 4, positions: [{ x: 9, y: 72 }] },
    ],
  },
  {
    cardSlug: "nine-of-pentacles",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 38 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 20, y: 72 },
          { x: 78, y: 75 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 72, y: 28 }] },
      {
        spotOrder: 4,
        positions: [
          { x: 15, y: 40 },
          { x: 85, y: 53 },
        ],
      },
    ],
  },
  {
    cardSlug: "ten-of-pentacles",
    spots: [
      { spotOrder: 1, positions: [{ x: 24, y: 66 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 72, y: 58 },
          { x: 93, y: 75 },
        ],
      },
      {
        spotOrder: 3,
        positions: [
          { x: 50, y: 13 },
          { x: 13, y: 24 },
          { x: 87, y: 24 },
        ],
      },
      {
        spotOrder: 4,
        positions: [
          { x: 78, y: 78 },
          { x: 80, y: 93 },
        ],
      },
      { spotOrder: 5, positions: [{ x: 50, y: 33 }] },
    ],
  },
  {
    cardSlug: "page-of-pentacles",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 35 }] },
      { spotOrder: 2, positions: [{ x: 70, y: 18 }] },
      { spotOrder: 3, positions: [{ x: 78, y: 84 }] },
      { spotOrder: 4, positions: [{ x: 78, y: 72 }] },
    ],
  },
  {
    cardSlug: "knight-of-pentacles",
    spots: [
      { spotOrder: 1, positions: [{ x: 40, y: 35 }] },
      { spotOrder: 2, positions: [{ x: 65, y: 55 }] },
      { spotOrder: 3, positions: [{ x: 70, y: 25 }] },
      { spotOrder: 4, positions: [{ x: 75, y: 82 }] },
    ],
  },
  {
    cardSlug: "queen-of-pentacles",
    spots: [
      { spotOrder: 1, positions: [{ x: 45, y: 35 }] },
      { spotOrder: 2, positions: [{ x: 33, y: 49 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 12, y: 70 },
          { x: 75, y: 5 },
        ],
      },
      { spotOrder: 4, positions: [{ x: 76, y: 85 }] },
      { spotOrder: 5, positions: [{ x: 75, y: 57 }] },
    ],
  },
  {
    cardSlug: "king-of-pentacles",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 36 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 70, y: 45 },
          { x: 23, y: 45 },
        ],
      },
      {
        spotOrder: 3,
        positions: [
          { x: 25, y: 13 },
          { x: 75, y: 13 },
        ],
      },
      {
        spotOrder: 4,
        positions: [
          { x: 45, y: 60 },
          { x: 85, y: 38 },
        ],
      },
    ],
  },
];

function validatePentaclesCardCoordinates(
  details: readonly EncyclopediaCardDetail[],
): void {
  if (details.length !== 14) {
    throw new Error(`펜타클 카드 좌표 개수 오류: ${details.length}`);
  }

  const seenCardSlugs = new Set<string>();

  details.forEach((detail) => {
    if (seenCardSlugs.has(detail.cardSlug)) {
      throw new Error(`펜타클 카드 slug 중복: ${detail.cardSlug}`);
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

validatePentaclesCardCoordinates(PENTACLES_CARD_COORDINATES);

export const PENTACLES_CARD_DETAILS = PENTACLES_CARD_COORDINATES;
