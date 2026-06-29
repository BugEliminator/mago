import {
  getIntentCategoryBadgeLabel,
  resolveReadingDetailCategory,
} from "@/components/tarot/setup/setupIntentCatalog";
import { getTarotSpreadPositionMeta } from "@/lib/tarotSpreadPositionMeta";
import type { TarotSessionSetup } from "@/types/tarot";
import type {
  CardMeaningRow,
  CardRow,
  ProfileRowForLlm,
} from "@/types/tarotReadingDeck";
import { supabase } from "@/lib/supabaseClient";

/** LLM에 전달하는 readings 배열 항목 */
export type TarotReadingLlmReadingItem = {
  position_label: string;
  position_desc: string;
  card: string;
  keywords: string[];
};

/** MAGO_v1 프롬프트에 넘기는 전체 입력 JSON */
export type TarotReadingLlmPayload = {
  timestamp: { local: string };
  user: {
    nickname: string;
    gender: string;
    birth_date: string | null;
    birth_time: string | null;
  };
  step: {
    main_category: string | null;
    detail_category: string;
    situation: string;
    question: string;
  };
  readings: TarotReadingLlmReadingItem[];
};

/**
 * 리딩 맥락을 LLM 입력 JSON으로 조립
 * (콘솔 디버그·API Route 공용)
 */
export function buildTarotReadingLlmPayload(
  now: Date,
  profile: ProfileRowForLlm | null,
  setup: TarotSessionSetup,
  pickedRows: readonly (BasePickedCardForLlm | EnrichedPickedCardForLlm)[],
): TarotReadingLlmPayload {
  const local = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(now);

  const readings: TarotReadingLlmReadingItem[] = pickedRows.map((row, idx) => {
    const meta =
      setup.cardCount != null && setup.category != null
        ? getTarotSpreadPositionMeta(
            setup.cardCount,
            setup.category,
            idx,
            setup.detailTag,
          )
        : null;
    const isRev = row.방향 === "역방향";
    const nameEn = "카드이름_en" in row ? row.카드이름_en : null;
    const cardNamePart =
      nameEn != null && nameEn.trim().length > 0
        ? nameEn.trim()
        : `Card #${row.카드번호}`;
    const card = `${cardNamePart} (${isRev ? "역방향" : "정방향"})`;
    const keywords = "키워드" in row && row.키워드 != null ? row.키워드 : [];
    return {
      position_label: meta?.label ?? "",
      position_desc: meta?.desc ?? "",
      card,
      keywords,
    };
  });

  return {
    timestamp: { local },
    user: {
      nickname: profile?.nickname ?? "",
      gender: profile?.gender ?? "",
      birth_date: profile?.birth_date ?? null,
      birth_time: profile?.born_time ?? null,
    },
    step: {
      main_category: setup.category
        ? getIntentCategoryBadgeLabel(setup.category)
        : null,
      detail_category: resolveReadingDetailCategory(
        setup.category,
        setup.detailTag,
      ),
      situation: setup.situation,
      question: setup.question,
    },
    readings,
  };
}

/** 카드 선택 완료 후 Supabase로 의미·카드 메타 보강 */
export type BasePickedCardForLlm = {
  순서: number;
  카드번호: number;
  방향: "정방향" | "역방향";
  해석포지션: {
    번호: number;
    라벨: string;
    설명: string;
  } | null;
};

export type EnrichedPickedCardForLlm = BasePickedCardForLlm & {
  카드이름_en: string | null;
  카드타입: string | null;
  키워드: string[] | null;
  설명: string | null;
};

export type EnrichPickedCardsResult =
  | { ok: true; pickedCards: EnrichedPickedCardForLlm[] }
  | {
      ok: false;
      meaningError?: unknown;
      cardsError?: unknown;
    };

/**
 * card_meanings + cards 조회 후 picked 카드에 키워드·설명·영문명·타입 병합
 */
export async function enrichPickedCardsFromSupabase(
  basePicked: readonly BasePickedCardForLlm[],
): Promise<EnrichPickedCardsResult> {
  const ids = basePicked.map((p) => p.카드번호);

  const [{ data: meaningData, error: meaningError }, { data: cardsData, error: cardsError }] =
    await Promise.all([
      supabase
        .from("card_meanings")
        .select("card_id,is_upright,keywords,description")
        .in("card_id", ids),
      supabase.from("cards").select("id,name_en,type").in("id", ids),
    ]);

  if (meaningError) return { ok: false, meaningError };
  if (cardsError) return { ok: false, cardsError };

  const rows = (meaningData ?? []) as CardMeaningRow[];
  const meaningMap = new Map<
    string,
    { keywords: string[] | null; description: string | null }
  >();
  for (const r of rows) {
    meaningMap.set(`${r.card_id}:${r.is_upright}`, {
      keywords: r.keywords ?? null,
      description: r.description ?? null,
    });
  }

  const cardRows = (cardsData ?? []) as CardRow[];
  const cardMap = new Map<
    number,
    { name_en: string | null; type: string | null }
  >();
  for (const r of cardRows) {
    cardMap.set(r.id, { name_en: r.name_en ?? null, type: r.type ?? null });
  }

  const pickedCards = basePicked.map((p) => {
    const isUpright = p.방향 === "정방향";
    const meaning =
      meaningMap.get(`${p.카드번호}:${isUpright}`) ?? null;
    const card = cardMap.get(p.카드번호) ?? null;
    return {
      ...p,
      카드이름_en: card?.name_en ?? null,
      카드타입: card?.type ?? null,
      키워드: meaning?.keywords ?? null,
      설명: meaning?.description ?? null,
    };
  });

  return { ok: true, pickedCards };
}
