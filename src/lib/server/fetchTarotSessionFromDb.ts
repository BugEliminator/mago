import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import { mapTarotSessionDbToResultPage } from "@/lib/mapTarotSessionDbToResultPage";
import type { TarotReadingQueryData } from "@/lib/tarotReadingQuery";
import type {
  TarotSessionCardRow,
  TarotSessionRow,
} from "@/types/tarotSessionDb";

export type FetchedTarotSession = {
  session: TarotSessionRow;
  cards: TarotSessionCardRow[];
};

/**
 * readingId + userId로 tarot_sessions / tarot_session_cards 조회 (service role + 소유자 검증)
 */
export async function fetchTarotSessionFromDb(
  readingId: string,
  userId: string,
): Promise<FetchedTarotSession | null> {
  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch {
    return null;
  }

  const { data: sessionData, error: sessionError } = await admin
    .from("tarot_sessions")
    .select(
      "id, user_id, card_count, main_category, detail_category, fortune_score, user_situation, user_question, summary_line, final_advice, has_reviewed, rating, review_content",
    )
    .eq("id", readingId)
    .eq("user_id", userId)
    .maybeSingle();

  if (sessionError != null || sessionData == null) {
    return null;
  }

  const { data: cardsData, error: cardsError } = await admin
    .from("tarot_session_cards")
    .select(
      "id, session_id, order_index, card_id, card_name_en, is_reversed, phase_label, one_liner, paragraphs",
    )
    .eq("session_id", readingId)
    .order("order_index", { ascending: true });

  if (cardsError != null) {
    return null;
  }

  return {
    session: sessionData as TarotSessionRow,
    cards: (cardsData ?? []) as TarotSessionCardRow[],
  };
}

/** DB 조회 + UI mapper — Server prefetch / GET API 공용 */
export async function getTarotReadingQueryData(
  readingId: string,
  userId: string,
): Promise<TarotReadingQueryData | null> {
  const fetched = await fetchTarotSessionFromDb(readingId, userId);
  if (fetched == null) return null;
  return mapTarotSessionDbToResultPage(fetched.session, fetched.cards);
}
