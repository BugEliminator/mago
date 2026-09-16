"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import NebulaBackground from "@/components/common/background/NebulaBackground";
import {
  ENCYCLOPEDIA_CARD_BUNDLES,
  ENCYCLOPEDIA_PATH,
  encyclopediaCardPath,
  findEncyclopediaCard,
  findEncyclopediaCardBySlug,
  parseEncyclopediaCardSlugFromPath,
} from "@/lib/encyclopedia/cardBundleCatalog";
import type {
  EncyclopediaBundleId,
  EncyclopediaCardMeaningById,
  EncyclopediaCardSlug,
} from "@/types/encyclopedia";
import DismissibleRuneLoadingOverlay from "@/components/common/fullscreen-rune-loading-overlay/DismissibleRuneLoadingOverlay";
import CardBundle from "./CardBundle";
import CardBundleGrid from "./CardBundleGrid";
import CardDetailOverlay from "./card-detail/CardDetailOverlay";
import {
  CardBundleRow,
  EncyclopediaMain,
  EncyclopediaPanel,
  EncyclopediaPanelHeader,
  EncyclopediaPanelInset,
  EncyclopediaPanelSubtitle,
  EncyclopediaPanelTitle,
  EncyclopediaRoot,
} from "./EncyclopediaPage.style";

/** 너무 짧게 깜빡이지 않도록 최소 표시 시간(ms) */
const MIN_OVERLAY_MS = 1000;
/** 네뷸라 스냅샷 실패 시 오버레이 강제 해제(ms) */
const NEBULA_OVERLAY_FALLBACK_MS = 8000;

type EncyclopediaPageProps = {
  meanings: EncyclopediaCardMeaningById;
};

/**
 * 타로 백과사전 — 네뷸라 배경 위 카드 묶음
 */
export default function EncyclopediaPage({ meanings }: EncyclopediaPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const selectedSlug = parseEncyclopediaCardSlugFromPath(pathname);
  const selectedCard =
    selectedSlug == null ? null : findEncyclopediaCardBySlug(selectedSlug);

  const [hoverCapable, setHoverCapable] = useState(false);
  const [hoveredBundleId, setHoveredBundleId] =
    useState<EncyclopediaBundleId | null>(null);
  const [manualBundleId, setManualBundleId] =
    useState<EncyclopediaBundleId | null>(selectedCard?.bundleId ?? null);
  const selectedBundleId = selectedCard?.bundleId ?? manualBundleId;
  const [nebulaReady, setNebulaReady] = useState(false);
  const [minOverlayElapsed, setMinOverlayElapsed] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      setHoverCapable(media.matches);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const minId = window.setTimeout(() => {
      setMinOverlayElapsed(true);
    }, MIN_OVERLAY_MS);
    const fallbackId = window.setTimeout(() => {
      setNebulaReady(true);
    }, NEBULA_OVERLAY_FALLBACK_MS);
    return () => {
      window.clearTimeout(minId);
      window.clearTimeout(fallbackId);
    };
  }, []);

  const handleNebulaReady = useCallback(() => {
    setNebulaReady(true);
  }, []);

  const handleOverlayDismissed = useCallback(() => {
    setOverlayVisible(false);
  }, []);

  const setCardPath = useCallback(
    (slug: EncyclopediaCardSlug | null, mode: "push" | "replace") => {
      const href = slug == null ? ENCYCLOPEDIA_PATH : encyclopediaCardPath(slug);
      if (mode === "push") {
        router.push(href, { scroll: false });
        return;
      }
      router.replace(href, { scroll: false });
    },
    [router],
  );

  const selectedBundle =
    ENCYCLOPEDIA_CARD_BUNDLES.find(
      (bundle) => bundle.id === selectedBundleId,
    ) ?? null;
  const selectedCardIndex =
    selectedBundle == null || selectedCard == null
      ? -1
      : selectedBundle.cards.findIndex((card) => card.id === selectedCard.id);
  const canStepCard =
    selectedBundle != null && selectedBundle.cards.length > 1;

  const handleCloseCardDetail = useCallback(() => {
    setCardPath(null, "replace");
  }, [setCardPath]);

  const handlePrevCard = useCallback(() => {
    if (selectedBundle == null || selectedCardIndex < 0) return;
    const count = selectedBundle.cards.length;
    const prevIndex = (selectedCardIndex - 1 + count) % count;
    const prevCard = selectedBundle.cards[prevIndex];
    if (prevCard == null) return;
    setCardPath(prevCard.slug, "replace");
  }, [selectedBundle, selectedCardIndex, setCardPath]);

  const handleNextCard = useCallback(() => {
    if (selectedBundle == null || selectedCardIndex < 0) return;
    const count = selectedBundle.cards.length;
    const nextIndex = (selectedCardIndex + 1) % count;
    const nextCard = selectedBundle.cards[nextIndex];
    if (nextCard == null) return;
    setCardPath(nextCard.slug, "replace");
  }, [selectedBundle, selectedCardIndex, setCardPath]);

  return (
    <>
      <NebulaBackground onSnapshotReady={handleNebulaReady} />
      <EncyclopediaRoot>
        <EncyclopediaMain>
          <EncyclopediaPanel>
            <EncyclopediaPanelInset>
              <EncyclopediaPanelHeader>
                <EncyclopediaPanelTitle>
                  알고 싶은 카드 묶음을 선택해주세요
                </EncyclopediaPanelTitle>
                <EncyclopediaPanelSubtitle>
                  78장 카드의 깊은 상징부터 정·역방향 해설까지 한눈에
                  확인해보세요.
                </EncyclopediaPanelSubtitle>
              </EncyclopediaPanelHeader>
              <CardBundleRow>
                {ENCYCLOPEDIA_CARD_BUNDLES.map((bundle) => {
                  const selected = selectedBundleId === bundle.id;
                  return (
                    <CardBundle
                      key={bundle.id}
                      bundle={bundle}
                      selected={selected}
                      expanded={selected || hoveredBundleId === bundle.id}
                      hoverCapable={hoverCapable}
                      onHoverChange={(open) => {
                        setHoveredBundleId(open ? bundle.id : null);
                      }}
                      onSelect={() => {
                        setManualBundleId(bundle.id);
                        setHoveredBundleId(null);
                        setCardPath(null, "replace");
                      }}
                    />
                  );
                })}
              </CardBundleRow>
            </EncyclopediaPanelInset>
            {selectedBundle != null ? (
              <CardBundleGrid
                key={selectedBundle.id}
                bundle={selectedBundle}
                hoverSuspended={selectedCard != null}
                onSelectCard={(cardId) => {
                  const card = findEncyclopediaCard(cardId);
                  if (card == null) return;
                  setManualBundleId(card.bundleId);
                  setCardPath(card.slug, "push");
                }}
              />
            ) : null}
          </EncyclopediaPanel>
        </EncyclopediaMain>
      </EncyclopediaRoot>
      {selectedCard != null ? (
        <CardDetailOverlay
          card={selectedCard}
          meaning={meanings[selectedCard.id] ?? null}
          onClose={handleCloseCardDetail}
          onPrev={canStepCard ? handlePrevCard : undefined}
          onNext={canStepCard ? handleNextCard : undefined}
        />
      ) : null}
      {overlayVisible ? (
        <DismissibleRuneLoadingOverlay
          portal
          zIndex={200}
          caption="별자리 사이로 카드를 펼치는 중..."
          ariaLabel="별자리 사이로 카드를 펼치는 중입니다. 백과사전을 준비합니다."
          dismissRequested={nebulaReady && minOverlayElapsed}
          onDismissed={handleOverlayDismissed}
        />
      ) : null}
    </>
  );
}
