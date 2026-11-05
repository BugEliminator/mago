import type { CardSpread, TarotCategory } from "@/types/tarot";
import type {
  TarotReadingPickedCardRequest,
  ValidatedTarotReadingRequest,
} from "@/types/tarotReadingRequest";

const TAROT_CATEGORIES: readonly TarotCategory[] = [
  "love",
  "money",
  "career",
  "study",
  "health",
  "family",
  "travel",
  "dream",
  "custom",
];

export type ParsedCardDraftRequest = {
  request: ValidatedTarotReadingRequest;
  slotIndex: number;
};

export type ParsedParallelReadingRequest = {
  request: ValidatedTarotReadingRequest;
};

export function parseCardDraftRequest(
  value: unknown,
): ParsedCardDraftRequest | null {
  if (value == null || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const setup = parseSetup(body.setup);
  const pickedCard = parsePickedCard(body.pickedCard);
  const slotIndex = body.slotIndex;
  if (
    setup == null ||
    pickedCard == null ||
    typeof slotIndex !== "number" ||
    !Number.isInteger(slotIndex) ||
    slotIndex < 0 ||
    slotIndex >= setup.cardCount
  ) {
    return null;
  }

  return {
    request: { setup, pickedCards: [pickedCard] },
    slotIndex,
  };
}

export function parseParallelReadingRequest(
  value: unknown,
): ParsedParallelReadingRequest | null {
  if (value == null || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const setup = parseSetup(body.setup);
  if (setup == null || !Array.isArray(body.pickedCards)) return null;
  if (body.pickedCards.length !== setup.cardCount) return null;

  const pickedCards: TarotReadingPickedCardRequest[] = [];
  const cardIds = new Set<number>();
  for (const value of body.pickedCards) {
    const card = parsePickedCard(value);
    if (card == null || cardIds.has(card.cardId)) return null;
    cardIds.add(card.cardId);
    pickedCards.push(card);
  }

  return { request: { setup, pickedCards } };
}

function parseSetup(
  value: unknown,
): ValidatedTarotReadingRequest["setup"] | null {
  if (value == null || typeof value !== "object") return null;
  const setup = value as Record<string, unknown>;
  if (!isTarotCategory(setup.category) || !isCardSpread(setup.cardCount)) {
    return null;
  }
  if (
    typeof setup.detailTag !== "string" ||
    typeof setup.situation !== "string" ||
    typeof setup.question !== "string"
  ) {
    return null;
  }

  return {
    category: setup.category,
    cardCount: setup.cardCount,
    detailTag: setup.detailTag,
    situation: setup.situation,
    question: setup.question,
  };
}

function parsePickedCard(value: unknown): TarotReadingPickedCardRequest | null {
  if (value == null || typeof value !== "object") return null;
  const card = value as Record<string, unknown>;
  if (
    typeof card.cardId !== "number" ||
    !Number.isInteger(card.cardId) ||
    card.cardId < 0 ||
    card.cardId > 77 ||
    typeof card.isReversed !== "boolean"
  ) {
    return null;
  }
  return { cardId: card.cardId, isReversed: card.isReversed };
}

function isTarotCategory(value: unknown): value is TarotCategory {
  return (
    typeof value === "string" &&
    TAROT_CATEGORIES.includes(value as TarotCategory)
  );
}

function isCardSpread(value: unknown): value is CardSpread {
  return value === 3 || value === 5 || value === 7;
}
