import type { MetadataRoute } from "next";
import {
  ENCYCLOPEDIA_PATH,
  encyclopediaCardPath,
  listEncyclopediaCards,
} from "@/lib/encyclopedia/cardBundleCatalog";
import { SITE_URL, toPublicSiteUrl } from "@/lib/seo/siteUrl";

/**
 * 검색에 노출할 페이지 목록을 반환한다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const encyclopediaEntries: MetadataRoute.Sitemap = [
    {
      url: toPublicSiteUrl(ENCYCLOPEDIA_PATH),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...listEncyclopediaCards().map((card) => ({
      url: toPublicSiteUrl(encyclopediaCardPath(card.slug)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...encyclopediaEntries,
  ];
}
