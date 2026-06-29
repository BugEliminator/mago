import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTarotReadingQueryData } from "@/lib/server/fetchTarotSessionFromDb";
import { getServerAuthUserId } from "@/lib/supabaseServer";
import { tarotReadingQueryKey } from "@/lib/tarotReadingQuery";
import ResultPageClient from "./ResultPageClient";

type TarotResultPageProps = {
  params: Promise<{ readingId: string }>;
};

/**
 * 타로 결과 페이지 — Server prefetch + Query dehydrate/hydrate
 */
export default async function TarotResultPage({ params }: TarotResultPageProps) {
  const { readingId } = await params;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
    },
  });

  const userId = await getServerAuthUserId();
  if (userId != null) {
    await queryClient.prefetchQuery({
      queryKey: tarotReadingQueryKey(readingId),
      queryFn: async () => {
        const data = await getTarotReadingQueryData(readingId, userId);
        if (data == null) {
          throw new Error("리딩 결과를 찾을 수 없습니다.");
        }
        return data;
      },
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResultPageClient readingId={readingId} />
    </HydrationBoundary>
  );
}
