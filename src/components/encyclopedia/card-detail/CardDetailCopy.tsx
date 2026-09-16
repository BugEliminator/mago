"use client";

import { hasEncyclopediaCardMeaning } from "@/lib/encyclopedia/cardMeaningCatalog";
import type {
  EncyclopediaCard,
  EncyclopediaCardMeaning,
  EncyclopediaCardPin,
} from "@/types/encyclopedia";
import {
  CardDetailChip,
  CardDetailChipList,
  CardDetailCopyBody,
  CardDetailCopyRoot,
  CardDetailCopyTitle,
  CardDetailPinHeading,
  CardDetailPinItem,
  CardDetailPinList,
  CardDetailSection,
  CardDetailSectionLabel,
} from "./CardDetailOverlay.style";

type CardDetailCopyProps = {
  card: EncyclopediaCard;
  meaning: EncyclopediaCardMeaning | null;
  pins: readonly EncyclopediaCardPin[];
};

type MeaningBlockProps = {
  label: string;
  keywords: readonly string[];
  body: string;
};

/** 정방향 또는 역방향 한 블록 — 키워드 칩 + 설명 */
function MeaningBlock({ label, keywords, body }: MeaningBlockProps) {
  if (keywords.length === 0 && body.length === 0) return null;

  return (
    <CardDetailSection>
      <CardDetailSectionLabel>{label}</CardDetailSectionLabel>
      {keywords.length > 0 ? (
        <CardDetailChipList>
          {keywords.map((keyword, index) => (
            <CardDetailChip key={`${keyword}-${index}`}>
              # {keyword}
            </CardDetailChip>
          ))}
        </CardDetailChipList>
      ) : null}
      {body.length > 0 ? (
        <CardDetailCopyBody>{body}</CardDetailCopyBody>
      ) : null}
    </CardDetailSection>
  );
}

/** 상세 오버레이 오른쪽 — 이름 + 정·역 해설 + 핀 */
export default function CardDetailCopy({
  card,
  meaning,
  pins,
}: CardDetailCopyProps) {
  const showMeaning = hasEncyclopediaCardMeaning(meaning);
  const showPins = pins.length > 0;
  const showEmpty = !showMeaning && !showPins;

  return (
    <CardDetailCopyRoot>
      <CardDetailCopyTitle>{card.name}</CardDetailCopyTitle>
      {showEmpty ? (
        <CardDetailCopyBody>해설을 준비 중입니다.</CardDetailCopyBody>
      ) : null}
      {showMeaning && meaning != null ? (
        <>
          <MeaningBlock
            label="정방향"
            keywords={meaning.uprightKeywords}
            body={meaning.upright}
          />
          <MeaningBlock
            label="역방향"
            keywords={meaning.reversedKeywords}
            body={meaning.reversed}
          />
        </>
      ) : null}
      {showPins ? (
        <CardDetailSection>
          <CardDetailSectionLabel>상징 키워드</CardDetailSectionLabel>
          <CardDetailPinList>
            {pins.map((pin, index) => (
              <CardDetailPinItem key={pin.id}>
                <CardDetailPinHeading>
                  {index + 1}. {pin.title}
                </CardDetailPinHeading>
                <CardDetailCopyBody>{pin.body}</CardDetailCopyBody>
              </CardDetailPinItem>
            ))}
          </CardDetailPinList>
        </CardDetailSection>
      ) : null}
    </CardDetailCopyRoot>
  );
}
