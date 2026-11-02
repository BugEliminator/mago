import type { EncyclopediaCardDetail } from "@/types/encyclopedia";

/** 완즈 수트 핀 — positions의 x/y는 앞면 이미지 기준 퍼센트 */
const WANDS_CARD_COORDINATES: readonly EncyclopediaCardDetail[] = [
  {
    cardSlug: "ace-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 70, y: 60 }] },
      { spotOrder: 2, positions: [{ x: 42, y: 31 }] },
      { spotOrder: 3, positions: [{ x: 35, y: 87 }] },
    ],
  },
  {
    cardSlug: "two-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 55 }] },
      { spotOrder: 2, positions: [{ x: 34, y: 30 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 18, y: 20 },
          { x: 86, y: 30 },
        ],
      },
    ],
  },
  {
    cardSlug: "three-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 45, y: 54 }] },
      { spotOrder: 2, positions: [{ x: 80, y: 87 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 16, y: 41 },
          { x: 72, y: 49 },
          { x: 87, y: 42 },
        ],
      },
    ],
  },
  {
    cardSlug: "four-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 28 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 43, y: 73 },
          { x: 58, y: 73 },
        ],
      },
      { spotOrder: 3, positions: [{ x: 16, y: 83 }] },
      { spotOrder: 4, positions: [{ x: 59, y: 56 }] },
    ],
  },
  {
    cardSlug: "five-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 58 }] },
      { spotOrder: 2, positions: [{ x: 52, y: 44 }] },
    ],
  },
  {
    cardSlug: "six-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 46, y: 52 }] },
      {
        spotOrder: 2,
        positions: [
          { x: 32, y: 35 },
          { x: 68, y: 18 },
        ],
      },
      {
        spotOrder: 3,
        positions: [
          { x: 15, y: 54 },
          { x: 81, y: 34 },
        ],
      },
    ],
  },
  {
    cardSlug: "seven-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 45 }] },
      { spotOrder: 2, positions: [{ x: 50, y: 82 }] },
      {
        spotOrder: 3,
        positions: [
          { x: 25, y: 84 },
          { x: 71, y: 84 },
        ],
      },
    ],
  },
  {
    cardSlug: "eight-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 44 }] },
      { spotOrder: 2, positions: [{ x: 86, y: 70 }] },
      { spotOrder: 3, positions: [{ x: 10, y: 87 }] },
    ],
  },
  {
    cardSlug: "nine-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 65, y: 54 }] },
      { spotOrder: 2, positions: [{ x: 65, y: 24 }] },
      { spotOrder: 3, positions: [{ x: 25, y: 43 }] },
    ],
  },
  {
    cardSlug: "ten-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 55, y: 30 }] },
      { spotOrder: 2, positions: [{ x: 48, y: 55 }] },
      { spotOrder: 3, positions: [{ x: 86, y: 81 }] },
    ],
  },
  {
    cardSlug: "page-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 52, y: 24 }] },
      { spotOrder: 2, positions: [{ x: 72, y: 5 }] },
      { spotOrder: 3, positions: [{ x: 57, y: 45 }] },
      { spotOrder: 4, positions: [{ x: 85, y: 81 }] },
    ],
  },
  {
    cardSlug: "knight-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 60, y: 44 }] },
      { spotOrder: 2, positions: [{ x: 15, y: 60 }] },
      { spotOrder: 3, positions: [{ x: 20, y: 86 }] },
    ],
  },
  {
    cardSlug: "queen-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 35 }] },
      { spotOrder: 2, positions: [{ x: 14, y: 15 }] },
      { spotOrder: 3, positions: [{ x: 88, y: 30 }] },
      { spotOrder: 4, positions: [{ x: 50, y: 81 }] },
      {
        spotOrder: 5,
        positions: [
          { x: 14, y: 70 },
          { x: 86, y: 70 },
        ],
      },
    ],
  },
  {
    cardSlug: "king-of-wands",
    spots: [
      { spotOrder: 1, positions: [{ x: 50, y: 35 }] },
      { spotOrder: 2, positions: [{ x: 13, y: 22 }] },
      { spotOrder: 3, positions: [{ x: 37, y: 18 }] },
      { spotOrder: 4, positions: [{ x: 85, y: 34 }] },
      { spotOrder: 5, positions: [{ x: 70, y: 85 }] },
    ],
  },
];

function validateWandsCardCoordinates(
  details: readonly EncyclopediaCardDetail[],
): void {
  if (details.length !== 14) {
    throw new Error(`완즈 카드 좌표 개수 오류: ${details.length}`);
  }

  const seenCardSlugs = new Set<string>();

  details.forEach((detail) => {
    if (seenCardSlugs.has(detail.cardSlug)) {
      throw new Error(`완즈 카드 slug 중복: ${detail.cardSlug}`);
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

validateWandsCardCoordinates(WANDS_CARD_COORDINATES);

export const WANDS_CARD_DETAILS = WANDS_CARD_COORDINATES;
