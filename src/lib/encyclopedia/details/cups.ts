import type { EncyclopediaCardDetail } from "@/types/encyclopedia";

/** 컵 수트 핀 — positions의 x/y는 앞면 이미지 기준 퍼센트 */
const CUPS_CARD_COORDINATES: readonly EncyclopediaCardDetail[] = [
  {
    cardSlug: "ace-of-cups",
    spots: [
      { spotOrder: 1, positions: [{ x: 65, y: 45 }] },
      { spotOrder: 2, positions: [{ x: 50, y: 60 }] },
      { spotOrder: 3, positions: [{ x: 50, y: 12 }] },
      {
        spotOrder: 4,
        positions: [
          { x: 25, y: 55 },
          { x: 73, y: 60 },
        ],
      },
      { spotOrder: 5, positions: [{ x: 50, y: 87 }] },
    ],
  },
  {
    cardSlug: "two-of-cups",
    spots: [
      {
        spotOrder: 1,
        positions: [
          { x: 25, y: 43 },
          { x: 75, y: 43 },
        ],
      },
      { spotOrder: 2, positions: [{ x: 52, y: 28 }] },
      { spotOrder: 3, positions: [{ x: 52, y: 10 }] },
      { spotOrder: 4, positions: [{ x: 55, y: 78 }] },
    ],
  },
  {
    cardSlug: "three-of-cups",
    spots: [
      {
        spotOrder: 1,
        positions: [
          { x: 25, y: 45 },
          { x: 50, y: 51 },
          { x: 75, y: 45 },
        ],
      },
      {
        spotOrder: 2,
        positions: [
          { x: 35, y: 17 },
          { x: 50, y: 10 },
          { x: 68, y: 16 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 50, y: 89 }] },
    ],
  },
  {
    cardSlug: "four-of-cups",
    spots: [
      { spotOrder: 1, positions: [{ x: 70, y: 57 }] },
      { spotOrder: 2, positions: [{ x: 69, y: 66 }] },
      {
        spotOrder: 3,
        positions: [{ x: 30, y: 88 }],
      },
      { spotOrder: 4, positions: [{ x: 32, y: 50 }] },
    ],
  },
  {
    cardSlug: "five-of-cups",
    spots: [
      { spotOrder: 1, positions: [{ x: 55, y: 48 }] },
      {
        spotOrder: 2,
        positions: [{ x: 28, y: 81 }],
      },
      {
        spotOrder: 3,
        positions: [{ x: 85, y: 88 }],
      },
      { spotOrder: 4, positions: [{ x: 25, y: 72 }] },
      {
        spotOrder: 5,
        positions: [
          { x: 82, y: 63 },
          { x: 10, y: 66 },
        ],
      },
    ],
  },
  {
    cardSlug: "six-of-cups",
    spots: [
      {
        spotOrder: 1,
        positions: [
          { x: 52, y: 58 },
          { x: 73, y: 62 },
        ],
      },
      {
        spotOrder: 2,
        positions: [
          { x: 24, y: 92 },
          { x: 76, y: 92 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 50, y: 28 }] },
      { spotOrder: 4, positions: [{ x: 5, y: 57 }] },
    ],
  },
  {
    cardSlug: "seven-of-cups",
    spots: [
      { spotOrder: 1, positions: [{ x: 25, y: 76 }] },
      { spotOrder: 2, positions: [{ x: 50, y: 57 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 20, y: 13 },
          { x: 82, y: 11 },
          { x: 10, y: 41 },
          { x: 39, y: 42 },
          { x: 63, y: 42 },
          { x: 86, y: 43 },
        ],
      },
      { spotOrder: 4, positions: [{ x: 50, y: 18 }] },
    ],
  },
  {
    cardSlug: "eight-of-cups",
    spots: [
      { spotOrder: 1, positions: [{ x: 66, y: 54 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 32, y: 85 },
          { x: 79, y: 85 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 76, y: 52 }] },
      {
        spotOrder: 4,
        positions: [{ x: 80, y: 33 }],
      },
    ],
  },
  {
    cardSlug: "nine-of-cups",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 50 }] },
      { spotOrder: 2, positions: [{ x: 50, y: 65 }] },
      { spotOrder: 3, positions: [{ x: 50, y: 18 }] },
    ],
  },
  {
    cardSlug: "ten-of-cups",
    spots: [
      {
        spotOrder: 1,
        positions: [{ x: 35, y: 72 }],
      },
      {
        spotOrder: 2,
        positions: [{ x: 80, y: 80 }],
      },
      { spotOrder: 3, positions: [{ x: 50, y: 18 }] },
      { spotOrder: 4, positions: [{ x: 62, y: 68 }] },
    ],
  },
  {
    cardSlug: "page-of-cups",
    spots: [
      { spotOrder: 1, positions: [{ x: 52, y: 30 }] },
      { spotOrder: 2, positions: [{ x: 21, y: 29 }] },
      { spotOrder: 3, positions: [{ x: 80, y: 79 }] },
      { spotOrder: 4, positions: [{ x: 50, y: 48 }] },
    ],
  },
  {
    cardSlug: "knight-of-cups",
    spots: [
      { spotOrder: 1, positions: [{ x: 53, y: 23 }] },
      { spotOrder: 2, positions: [{ x: 60, y: 55 }] },
      { spotOrder: 3, positions: [{ x: 15, y: 14 }] },
      { spotOrder: 4, positions: [{ x: 35, y: 40 }] },
      {
        spotOrder: 5,
        positions: [
          { x: 65, y: 88 },
          { x: 88, y: 75 },
        ],
      },
    ],
  },
  {
    cardSlug: "queen-of-cups",
    spots: [
      { spotOrder: 1, positions: [{ x: 53, y: 38 }] },
      { spotOrder: 2, positions: [{ x: 25, y: 45 }] },
      { spotOrder: 3, positions: [{ x: 84, y: 48 }] },
      {
        spotOrder: 4,
        positions: [
          { x: 50, y: 14 },
          { x: 88, y: 63 },
        ],
      },
      { spotOrder: 5, positions: [{ x: 48, y: 85 }] },
    ],
  },
  {
    cardSlug: "king-of-cups",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 30 }] },
      { spotOrder: 2, positions: [{ x: 32, y: 43 }] },
      { spotOrder: 3, positions: [{ x: 93, y: 43 }] },
      { spotOrder: 4, positions: [{ x: 94, y: 70 }] },
      { spotOrder: 5, positions: [{ x: 5, y: 70 }] },
    ],
  },
];

function validateCupsCardCoordinates(
  details: readonly EncyclopediaCardDetail[],
): void {
  if (details.length !== 14) {
    throw new Error(`컵 카드 좌표 개수 오류: ${details.length}`);
  }

  const seenCardSlugs = new Set<string>();

  details.forEach((detail) => {
    if (seenCardSlugs.has(detail.cardSlug)) {
      throw new Error(`컵 카드 slug 중복: ${detail.cardSlug}`);
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

validateCupsCardCoordinates(CUPS_CARD_COORDINATES);

export const CUPS_CARD_DETAILS = CUPS_CARD_COORDINATES;
