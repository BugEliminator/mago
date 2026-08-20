import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTarotReadingQueryData } from "@/lib/server/fetchTarotSessionFromDb";
import { getServerAuthUserId } from "@/lib/supabase/supabaseServer";
import { tarotReadingQueryKey } from "@/lib/tarot/reading/tarotReadingQuery";
import ResultPageClient from "./ResultPageClient";

type TarotResultPageProps = {
  params: Promise<{ readingId: string }>;
};

/**
 * 타로 결과 페이지 — Server prefetch + Query dehydrate/hydrate
 */
export default async function TarotResultPage({ params }: TarotResultPageProps) {
  const { readingId } = await params;
  const userId = await getServerAuthUserId();
  const data = await getTarotReadingQueryData(readingId, userId);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
    },
  });

  if (data != null) {
    queryClient.setQueryData(tarotReadingQueryKey(readingId), data);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResultPageClient readingId={readingId} />
    </HydrationBoundary>
  );
}
