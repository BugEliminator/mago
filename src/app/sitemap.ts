import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/siteUrl";

/**
 검색에 노출할 페이지 목록을 반환한다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
