import { NO_INDEX_METADATA } from "@/lib/seo/noIndexMetadata";

export const metadata = NO_INDEX_METADATA;

/**
 * 타로 플로우 레이아웃 — 설정·리딩·결과는 앱 화면이라 검색에서 제외한다.
 */
export default function TarotLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
