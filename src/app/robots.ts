import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/siteUrl";

/**
 * /robots.txt — 공개 페이지만 크롤하고 앱·개인 경로는 막는다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/login",
        "/signup",
        "/forget-password",
        "/reset-password",
        "/auth/",
        "/mypage/",
        "/tarot/setup",
        "/tarot/reading",
        "/tarot/result/",
        "/api/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
