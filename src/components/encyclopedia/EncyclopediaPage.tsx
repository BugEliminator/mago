"use client";

import { useCallback, useEffect, useState } from "react";
import NebulaBackground from "@/components/common/background/NebulaBackground";
import { ENCYCLOPEDIA_CARD_BUNDLES } from "@/lib/encyclopedia/cardBundleCatalog";
import type { EncyclopediaBundleId } from "@/types/encyclopedia";
import DismissibleRuneLoadingOverlay from "@/components/common/fullscreen-rune-loading-overlay/DismissibleRuneLoadingOverlay";
import CardBundle from "./CardBundle";
import CardBundleGrid from "./CardBundleGrid";
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

/**
 * 타로 백과사전 — 네뷸라 배경 위 카드 묶음
 */
export default function EncyclopediaPage() {
  const [hoverCapable, setHoverCapable] = useState(false);
  const [hoveredBundleId, setHoveredBundleId] =
    useState<EncyclopediaBundleId | null>(null);
  const [selectedBundleId, setSelectedBundleId] =
    useState<EncyclopediaBundleId | null>(null);
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

  const selectedBundle =
    ENCYCLOPEDIA_CARD_BUNDLES.find(
      (bundle) => bundle.id === selectedBundleId,
    ) ?? null;

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
                        setSelectedBundleId(bundle.id);
                        setHoveredBundleId(null);
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
              />
            ) : null}
          </EncyclopediaPanel>
        </EncyclopediaMain>
      </EncyclopediaRoot>
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
