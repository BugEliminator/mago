import { buildHomeFaqJsonLd } from "@/lib/seo/buildHomeFaqJsonLd";

/**
 * 홈 FAQ — schema.org FAQPage JSON-LD
 */
export default function HomeFaqJsonLd() {
  const jsonLd = buildHomeFaqJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
