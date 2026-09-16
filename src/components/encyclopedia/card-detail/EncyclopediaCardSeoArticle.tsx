"use client";

import { hasEncyclopediaCardMeaning } from "@/lib/encyclopedia/cardMeaningCatalog";
import type {
  EncyclopediaCard,
  EncyclopediaCardMeaning,
  EncyclopediaCardPin,
} from "@/types/encyclopedia";
import { SeoArticle } from "./EncyclopediaCardSeoArticle.style";

type EncyclopediaCardSeoArticleProps = {
  card: EncyclopediaCard;
  meaning: EncyclopediaCardMeaning | null;
  pins: readonly EncyclopediaCardPin[];
};

/** 카드 상세 첫 HTML에 제목·정역·핀을 넣어 검색이 본문을 읽게 한다 */
export default function EncyclopediaCardSeoArticle({
  card,
  meaning,
  pins,
}: EncyclopediaCardSeoArticleProps) {
  const showMeaning = hasEncyclopediaCardMeaning(meaning);

  return (
    <SeoArticle>
      <h1>{card.name} 타로 의미</h1>
      {showMeaning && meaning != null ? (
        <>
          {meaning.uprightKeywords.length > 0 || meaning.upright.length > 0 ? (
            <section>
              <h2>정방향</h2>
              {meaning.uprightKeywords.length > 0 ? (
                <p>{meaning.uprightKeywords.join(", ")}</p>
              ) : null}
              {meaning.upright.length > 0 ? <p>{meaning.upright}</p> : null}
            </section>
          ) : null}
          {meaning.reversedKeywords.length > 0 ||
          meaning.reversed.length > 0 ? (
            <section>
              <h2>역방향</h2>
              {meaning.reversedKeywords.length > 0 ? (
                <p>{meaning.reversedKeywords.join(", ")}</p>
              ) : null}
              {meaning.reversed.length > 0 ? <p>{meaning.reversed}</p> : null}
            </section>
          ) : null}
        </>
      ) : null}
      {pins.length > 0 ? (
        <section>
          <h2>상징 키워드</h2>
          {pins.map((pin) => (
            <p key={pin.id}>
              {pin.title}. {pin.body}
            </p>
          ))}
        </section>
      ) : null}
    </SeoArticle>
  );
}
