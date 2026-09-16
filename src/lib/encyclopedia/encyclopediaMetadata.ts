import type { Metadata } from "next";
import {
  ENCYCLOPEDIA_PATH,
  encyclopediaCardPath,
} from "@/lib/encyclopedia/cardBundleCatalog";
import { toPublicSiteUrl } from "@/lib/seo/siteUrl";
import type {
  EncyclopediaCard,
  EncyclopediaCardMeaning,
} from "@/types/encyclopedia";

const LIST_TITLE = "타로 백과사전 | MAGO";
const LIST_DESCRIPTION =
  "메이저·완드·컵·소드·펜타클 78장 타로 카드의 의미와 정·역방향 해석을 살펴보세요.";

const DESCRIPTION_MAX_LENGTH = 140;

/** 목록 페이지 메타 */
export const ENCYCLOPEDIA_LIST_METADATA: Metadata = {
  title: LIST_TITLE,
  description: LIST_DESCRIPTION,
  alternates: {
    canonical: toPublicSiteUrl(ENCYCLOPEDIA_PATH),
  },
  openGraph: {
    title: LIST_TITLE,
    description: LIST_DESCRIPTION,
    url: toPublicSiteUrl(ENCYCLOPEDIA_PATH),
    locale: "ko_KR",
    type: "website",
  },
};

/** 정방향 설명으로 메타 설명을 만들고, 없으면 카드 이름 문구를 쓴다 */
function cardDescription(
  card: EncyclopediaCard,
  meaning: EncyclopediaCardMeaning | null,
): string {
  const upright = meaning?.upright.trim() ?? "";
  if (upright.length === 0) {
    return `타로 ${card.name}의 정방향·역방향 해석과 카드 속 상징을 살펴보세요.`;
  }
  if (upright.length <= DESCRIPTION_MAX_LENGTH) return upright;
  return `${upright.slice(0, DESCRIPTION_MAX_LENGTH)}...`;
}

/** 카드 상세 페이지 메타 */
export function encyclopediaCardMetadata(
  card: EncyclopediaCard,
  meaning: EncyclopediaCardMeaning | null,
): Metadata {
  const title = `${card.name} 타로 의미 | MAGO`;
  const description = cardDescription(card, meaning);
  const url = toPublicSiteUrl(encyclopediaCardPath(card.slug));

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      locale: "ko_KR",
      type: "article",
      images: [
        {
          url: card.src,
          alt: card.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [card.src],
    },
  };
}
