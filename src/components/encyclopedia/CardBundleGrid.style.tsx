import styled from "@emotion/styled";
import { motion } from "framer-motion";
import {
  CARD_BORDER_HOVER,
  CARD_FACE_FRAME_CLASS,
  tarotCardFaceOuterCss,
} from "@/components/common/card/TarotCardFaceShell.style";
import { DESKTOP_MIN_WIDTH } from "@/lib/layout/layout";
import {
  ENCYCLOPEDIA_PANEL_PAD_X_DESKTOP,
  ENCYCLOPEDIA_PANEL_PAD_X_MOBILE,
} from "./EncyclopediaPage.style";
import {
  ENCYCLOPEDIA_BUNDLE_GRID_COLUMNS_DESKTOP,
  ENCYCLOPEDIA_BUNDLE_GRID_COLUMNS_MOBILE,
} from "@/lib/encyclopedia/cardBundleCatalog";

const GRID_GAP_BASE_MOBILE = "0.375rem";
const GRID_GAP_BASE_DESKTOP = "0.75rem";
const GRID_GAP_COUNT_MOBILE = ENCYCLOPEDIA_BUNDLE_GRID_COLUMNS_MOBILE - 1;
const GRID_GAP_COUNT_DESKTOP = ENCYCLOPEDIA_BUNDLE_GRID_COLUMNS_DESKTOP - 1;

/** 패널 좌우 패딩을 열 사이 갭으로 환산 */
export const CARD_BUNDLE_GRID_GAP_MOBILE = `calc(${GRID_GAP_BASE_MOBILE} + (2 * ${ENCYCLOPEDIA_PANEL_PAD_X_MOBILE}) / ${GRID_GAP_COUNT_MOBILE})`;
export const CARD_BUNDLE_GRID_GAP_DESKTOP = `calc(${GRID_GAP_BASE_DESKTOP} + (2 * ${ENCYCLOPEDIA_PANEL_PAD_X_DESKTOP}) / ${GRID_GAP_COUNT_DESKTOP})`;

/** 리딩 스프레드 호버와 같은 금·흰 보더 빛 */
const GRID_CARD_HOVER_GLOW = `
  0 10px 25px -5px #0A0A0A,
  0 0 12px #EAB865,
  inset 0 0 0 1px #FFF8E6,
  0 0 20px #FFFFFF,
  0 0 40px #F0F0F0
`;

/** 모바일 4열 / 데스크톱 8열 — 칸을 나눠 겹치지 않게 배치 */
export const CardBundleGridRoot = styled.div`
  display: grid;
  grid-template-columns: repeat(
    ${ENCYCLOPEDIA_BUNDLE_GRID_COLUMNS_MOBILE},
    minmax(0, 1fr)
  );
  gap: ${CARD_BUNDLE_GRID_GAP_MOBILE};
  width: 100%;
  margin-top: 1.75rem;
  box-sizing: border-box;
  overflow: visible;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    grid-template-columns: repeat(
      ${ENCYCLOPEDIA_BUNDLE_GRID_COLUMNS_DESKTOP},
      minmax(0, 1fr)
    );
    gap: ${CARD_BUNDLE_GRID_GAP_DESKTOP};
    margin-top: 2.5rem;
  }
`;

export const CardBundleGridCardMotion = styled(motion.div)<{ $lifted?: boolean }>`
  position: relative;
  z-index: ${({ $lifted }) => ($lifted ? 3 : 1)};
  width: 100%;
  aspect-ratio: 170 / 287;
  overflow: visible;

  .${CARD_FACE_FRAME_CLASS} {
    border-color: ${({ $lifted }) =>
      $lifted ? CARD_BORDER_HOVER : undefined};
  }
`;

/** 틸트용 원근 — 입장 애니와 분리 */
export const CardTiltScene = styled.div`
  width: 100%;
  height: 100%;
  perspective: 700px;
`;

/** 크림 테두리까지 같이 기울도록 안쪽에 카드 외형을 둔다 */
export const CardTiltInner = styled(motion.div)<{ $lifted?: boolean }>`
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  border-radius: 0.5rem;
  overflow: visible;
  ${tarotCardFaceOuterCss}
  padding: 0.1875rem;
  box-shadow: ${({ theme, $lifted }) =>
    $lifted ? GRID_CARD_HOVER_GLOW : theme.shadows.md};
  filter: ${({ $lifted }) => ($lifted ? "brightness(1.05)" : "none")};
  transition: box-shadow 0.32s ease, filter 0.32s ease;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    border-radius: 0.75rem;
    padding: 0.375rem;
  }
`;
