import type { ReactNode } from "react";
import EncyclopediaPage from "@/components/encyclopedia/EncyclopediaPage";
import { fetchEncyclopediaCardMeaningsFromDb } from "@/lib/server/fetchEncyclopediaCardMeaningsFromDb";
import { fetchEncyclopediaCardSpotsFromDb } from "@/lib/server/fetchEncyclopediaCardSpotsFromDb";

type EncyclopediaLayoutProps = {
  children: ReactNode;
};

/**
 * 목록·상세가 오가도 입장 오버레이·네뷸라 상태를 유지한다.
 */
export default async function EncyclopediaLayout({
  children,
}: EncyclopediaLayoutProps) {
  const [meanings, spotCopies] = await Promise.all([
    fetchEncyclopediaCardMeaningsFromDb(),
    fetchEncyclopediaCardSpotsFromDb(),
  ]);

  return (
    <>
      {children}
      <EncyclopediaPage meanings={meanings} spotCopies={spotCopies} />
    </>
  );
}
