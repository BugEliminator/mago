/** 검색·OG·sitemap에 쓰는 공식 사이트 URL */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://magotarot.kr";

/**
 * 현재 경로를 공식 사이트 origin으로 붙입니다.
 * localhost·프리뷰여도 공유 링크는 프로덕션 주소가 됩니다.
 */
export function toPublicSiteUrl(
  pathWithSearchAndHash: string,
): string {
  const origin = SITE_URL.replace(/\/$/, "");
  const path = pathWithSearchAndHash.startsWith("/")
    ? pathWithSearchAndHash
    : `/${pathWithSearchAndHash}`;
  return `${origin}${path}`;
}
