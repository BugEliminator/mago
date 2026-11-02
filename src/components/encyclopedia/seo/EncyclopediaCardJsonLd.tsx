import { ENCYCLOPEDIA_PATH } from "@/lib/encyclopedia/cardBundleCatalog";
import { getEncyclopediaCardSeoData } from "@/lib/encyclopedia/encyclopediaMetadata";
import { toPublicSiteUrl } from "@/lib/seo/siteUrl";
import type {
  EncyclopediaCard,
  EncyclopediaCardMeaning,
} from "@/types/encyclopedia";

type EncyclopediaCardJsonLdProps = {
  card: EncyclopediaCard;
  meaning: EncyclopediaCardMeaning | null;
};

/** 카드 상세 WebPage와 탐색 계층을 검색 엔진에 전달한다. */
export default function EncyclopediaCardJsonLd({
  card,
  meaning,
}: EncyclopediaCardJsonLdProps) {
  const { title, description, canonicalUrl, imageUrl, imageAlt } =
    getEncyclopediaCardSeoData(card, meaning);
  const siteUrl = toPublicSiteUrl("/");
  const encyclopediaUrl = toPublicSiteUrl(ENCYCLOPEDIA_PATH);
  const webpageId = `${canonicalUrl}#webpage`;
  const breadcrumbId = `${canonicalUrl}#breadcrumb`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: canonicalUrl,
        name: title,
        description,
        inLanguage: "ko-KR",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${siteUrl}#website`,
          url: siteUrl,
          name: "MAGO",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
          caption: imageAlt,
        },
        breadcrumb: {
          "@id": breadcrumbId,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "MAGO",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "타로 백과사전",
            item: encyclopediaUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${card.englishName} | ${card.name}`,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
