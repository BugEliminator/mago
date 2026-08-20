import TarotReadingPage from "@/components/tarot/reading/page";
import { isTarotDevRevealQuery } from "@/lib/tarot/devReveal";

type TarotReadingRoutePageProps = {
  searchParams?: Promise<{
    reveal?: string;
  }>;
};

/**
 * 타로 카드 선택 라우트 — UI는 클라이언트 컴포넌트에 위임합니다.
 */
export default async function TarotReadingRoutePage({
  searchParams,
}: TarotReadingRoutePageProps) {
  const params = await searchParams;
  return (
    <TarotReadingPage showFaces={isTarotDevRevealQuery(params?.reveal)} />
  );
}
