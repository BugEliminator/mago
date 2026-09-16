import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import EncyclopediaCardSeoArticle from "@/components/encyclopedia/card-detail/EncyclopediaCardSeoArticle";
import {
  encyclopediaCardPath,
  findEncyclopediaCardBySlug,
  listEncyclopediaCards,
  parseEncyclopediaCardQuery,
} from "@/lib/encyclopedia/cardBundleCatalog";
import { findEncyclopediaCardDetail } from "@/lib/encyclopedia/cardDetailCatalog";
import {
  ENCYCLOPEDIA_LIST_METADATA,
  encyclopediaCardMetadata,
} from "@/lib/encyclopedia/encyclopediaMetadata";
import { fetchEncyclopediaCardMeaningsFromDb } from "@/lib/server/fetchEncyclopediaCardMeaningsFromDb";

type EncyclopediaRoutePageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ card?: string }>;
};

/** 목록과 78장 상세를 미리 만든다 */
export function generateStaticParams(): { slug: string[] }[] {
  return [
    { slug: [] },
    ...listEncyclopediaCards().map((card) => ({ slug: [card.slug] })),
  ];
}

/** 목록 또는 카드별 제목·설명 */
export async function generateMetadata({
  params,
}: EncyclopediaRoutePageProps): Promise<Metadata> {
  const { slug: segments } = await params;
  const slug = segments?.[0];
  if (slug == null) return ENCYCLOPEDIA_LIST_METADATA;

  const card = findEncyclopediaCardBySlug(slug);
  if (card == null) return {};

  const meanings = await fetchEncyclopediaCardMeaningsFromDb();
  return encyclopediaCardMetadata(card, meanings[card.id] ?? null);
}

/**
 * 타로 백과사전 — `/encyclopedia` 목록, `/encyclopedia/queen-of-pentacles` 상세
 */
export default async function EncyclopediaRoutePage({
  params,
  searchParams,
}: EncyclopediaRoutePageProps) {
  const { slug: segments } = await params;
  if (segments != null && segments.length > 1) {
    notFound();
  }

  const slug = segments?.[0] ?? null;
  const query = await searchParams;

  if (slug == null) {
    const legacyCard = parseEncyclopediaCardQuery(query.card);
    if (legacyCard != null) {
      redirect(encyclopediaCardPath(legacyCard.slug));
    }
  }

  const selectedCard =
    slug == null ? null : findEncyclopediaCardBySlug(slug);
  if (slug != null && selectedCard == null) {
    notFound();
  }

  if (selectedCard == null) return null;

  const meanings = await fetchEncyclopediaCardMeaningsFromDb();

  return (
    <EncyclopediaCardSeoArticle
      card={selectedCard}
      meaning={meanings[selectedCard.id] ?? null}
      pins={findEncyclopediaCardDetail(selectedCard.id)?.pins ?? []}
    />
  );
}
