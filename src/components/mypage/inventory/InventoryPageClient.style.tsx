import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { mypageMobileSectionUnderbarStyle } from "@/components/mypage/common/mypageMobileSectionUnderbar";
import { mypageMobileFixedTopBarStyle } from "@/components/mypage/common/mypageMobileFixedTopBar.style";

const MOBILE = "@media (max-width: 640px)";

const gradientShimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/* ────────────────────────────────────────────
   외부 흰 셸
──────────────────────────────────────────── */
export const InventoryRoot = styled.div`
  background: #fdfcf8;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 24px #030407;
  min-height: 20rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${MOBILE} {
    width: 100%;
    margin: 0;
    border-radius: 0;
    min-height: 100dvh;
    padding: 0 1rem 1rem;
    box-shadow: none;
    gap: 1rem;
  }
`;

export const InventoryHeader = styled.div`
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;

  ${MOBILE} {
    display: none;
  }
`;

/** 모바일 전용 최상단 행 — 뒤로가기 (스크롤 시 상단 고정) */
export const MobileTopBar = styled.div`
  display: none;

  ${MOBILE} {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    width: 100%;
    ${mypageMobileFixedTopBarStyle}
  }
`;

export { MypageMobileBackButton as BackButton } from "@/components/mypage/common/mypageMobileBackButton.style";

/** 모바일 — 타이틀 + 부제 */
export const MobileHeaderBlock = styled.div`
  display: none;

  ${MOBILE} {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

export const MobileTitleText = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 1rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
`;

export const MobileInventorySubtitle = styled.p`
  font-size: 0.75rem;
  color: #9e9e9e;
  margin: 0;
  line-height: 1.5;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

/** 모바일 본문 — GUARANTEE + 탭 + 패널 */
export const MobileInventorySection = styled.div`
  display: none;

  ${MOBILE} {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
`;

/** 모바일 GUARANTEE — 제목 아래·칩 위 */
export const MobileGuaranteeBox = styled.div`
  display: none;

  ${MOBILE} {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    padding: 1rem;
    border: 1px solid #1d2040;
    border-radius: 0.75rem;
    background: #111325;
  }
`;

/** 모바일 탭 칩 행 */
export const MobileTabBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;

  ${MOBILE} {
    ${mypageMobileSectionUnderbarStyle}
  }
`;

export const MobileTabChip = styled.button<{ $active?: boolean }>`
  flex: none;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.6875rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  font-family: inherit;
  line-height: 1.3;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 150ms ease-in-out,
    border-color 150ms ease-in-out,
    color 150ms ease-in-out;

  border: 1px solid ${({ $active }) => ($active ? "#1a237e" : "#e8eaf6")};
  background: ${({ $active }) => ($active ? "#ffffff" : "#f0f0f0")};
  color: ${({ $active }) => ($active ? "#1a237e" : "#9e9e9e")};

  &:hover {
    border-color: #1a237e;
    color: #1a237e;
  }
`;

/** 모바일 탭 패널 — 콘텐츠 + 하단 상점 배너 */
export const MobileTabPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #0d0f1f;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  padding: 1rem;
`;

export const MobileTabPanelMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const InventoryTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
`;

export const InventorySubtitle = styled.p`
  font-size: 0.75rem;
  color: #9e9e9e;
  margin: 0;
`;

/* ────────────────────────────────────────────
   다크 인셋 본문 (40rem 고정)
──────────────────────────────────────────── */
export const InventoryBody = styled.div`
  height: 40rem;
  background: #0d0f1f;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  overflow: hidden;

  ${MOBILE} {
    display: none;
  }
`;

export const InventoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  height: 100%;
`;

/** 좌측 카테고리 탭 */
export const InventorySidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  border-right: 1px solid #1d2040;
  min-height: 0;
`;

export const SidebarLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64688a;
  padding: 0 0.25rem;
  margin-bottom: 0.25rem;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.875rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid;
  cursor: pointer;
  transition:
    background 150ms,
    color 150ms,
    border-color 150ms;

  background: ${({ $active }) => ($active ? "#1b1f3d" : "#11132566")};
  color: ${({ $active }) => ($active ? "#3949ab" : "#9ea3c0")};
  border-color: ${({ $active }) => ($active ? "#3949ab40" : "#1d2040")};

  &:hover {
    background: ${({ $active }) => ($active ? "#1b1f3d" : "#111325")};
    color: ${({ $active }) => ($active ? "#3949ab" : "#e2e4f0")};
  }
`;

export const TabButtonLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TabChevron = styled.span<{ $active: boolean }>`
  display: flex;
  align-items: center;
  transition: transform 200ms;
  transform: ${({ $active }) => ($active ? "rotate(90deg)" : "none")};
  color: ${({ $active }) => ($active ? "#3949ab" : "#4a4e6a")};
`;

export const GuaranteeBox = styled.div`
  margin-top: auto;
  padding: 1rem;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  background: #11132533;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const GuaranteeTitle = styled.span`
  font-size: 0.625rem;
  font-weight: 900;
  color: #d4af37;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const GuaranteeDesc = styled.p`
  font-size: 0.625rem;
  color: #64688a;
  line-height: 1.5;
  margin: 0;
  font-weight: 300;
`;

/** 우측 콘텐츠 영역 */
export const InventoryContent = styled.div`
  padding: 1.25rem;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const TabPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
`;

/** 탭 본문 — 배너를 바닥으로 밀 때 위쪽 영역 */
export const TabPanelMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
`;

/* ────────────────────────────────────────────
   카드 스킨 탭
──────────────────────────────────────────── */
export const SkinGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  /* 1열일 때 카드 가로 배치 */
  ${MOBILE} {
    grid-template-columns: 1fr;
  }
`;

export const SkinCard = styled.div<{ $equipped: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 1rem;
  border: 1px solid;
  overflow: hidden;
  transition:
    border-color 300ms,
    box-shadow 300ms;

  border-color: ${({ $equipped }) => ($equipped ? "#d4af3760" : "#1d2040")};
  background: ${({ $equipped }) =>
    $equipped
      ? "linear-gradient(135deg, #0f113a 0%, #060713 50%, #2a114f 100%)"
      : "#11132580"};
  box-shadow: ${({ $equipped }) => ($equipped ? "0 0 25px #d4af3720" : "none")};

  ${({ $equipped }) =>
    $equipped &&
    css`
      background-size: 200% 200%;
      animation: ${gradientShimmer} 8s ease infinite;
    `}

  ${MOBILE} {
    flex-direction: row;
    align-items: stretch;
  }
`;

export const SkinPreview = styled.div<{ $equipped: boolean }>`
  height: 9rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-bottom: 1px solid #1d204066;
  overflow: hidden;
  background: ${({ $equipped }) =>
    $equipped
      ? "#00000033"
      : "linear-gradient(180deg, #0f113a 0%, #060713 55%, #2a114f 100%)"};

  &:hover > div:first-of-type {
    transform: scale(1.05);
  }

  ${MOBILE} {
    width: 6.75rem;
    min-width: 6.75rem;
    height: auto;
    min-height: 100%;
    padding: 0.75rem 0.5rem;
    border-bottom: none;
    border-right: 1px solid #1d204066;

    &:hover > div:first-of-type {
      transform: none;
    }
  }
`;

/** 타로 카드 비율(170:287) 유지 — cover 시 상하 잘림 방지 */
export const SkinMiniCard = styled.div`
  width: 4.5rem;
  aspect-ratio: 170 / 287;
  border-radius: 0.375rem;
  background: #070811;
  border: 1px solid #d4af3759;
  box-shadow: 0 8px 24px #030407;
  padding: 0.2rem;
  transition: transform 300ms;
  flex-shrink: 0;

  ${MOBILE} {
    width: 3.75rem;
  }
`;

export const SkinMiniCardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 0.25rem;
  overflow: hidden;
  background: #070811;

  img {
    object-fit: contain;
  }
`;

export const SkinCardTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const SkinBadge = styled.span`
  flex-shrink: 0;
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: #00000099;
  color: #d4af37;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #d4af3733;
  white-space: nowrap;
`;

export const SkinEquippedBadge = styled.span`
  position: absolute;
  top: 0.625rem;
  left: 0.625rem;
  font-size: 0.5625rem;
  font-weight: 900;
  color: #000000;
  background: #d4af37;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 2px 8px #030407;

  ${MOBILE} {
    top: 0.375rem;
    left: 0.375rem;
    font-size: 0.5rem;
    padding: 0.125rem 0.5rem;
  }
`;

export const SkinCardBody = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;

  ${MOBILE} {
    padding: 0.875rem 1rem;
  }
`;

export const SkinCardTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0;
  min-width: 0;
`;

export const SkinCardDesc = styled.p`
  font-size: 0.75rem;
  color: #9ea3c0;
  line-height: 1.5;
  margin: 0.25rem 0 1rem;
  font-weight: 300;

  ${MOBILE} {
    font-size: 0.6875rem;
    margin: 0.25rem 0 0.75rem;
  }
`;

export const SkinEquipBtn = styled.button<{ $equipped: boolean }>`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid;
  cursor: ${({ $equipped }) => ($equipped ? "default" : "pointer")};
  transition: background 150ms;

  background: ${({ $equipped }) => ($equipped ? "transparent" : "#2a2c40")};
  color: ${({ $equipped }) => ($equipped ? "#d4af37" : "#e2e4f0")};
  border-color: ${({ $equipped }) => ($equipped ? "#d4af3733" : "#3a3d58")};

  &:hover:not(:disabled) {
    background: ${({ $equipped }) => ($equipped ? "transparent" : "#343850")};
  }
`;

/* ────────────────────────────────────────────
   페르소나 탭
──────────────────────────────────────────── */
export const PersonaInfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid #1d2040;
  background: #14172f;

  & > svg {
    flex-shrink: 0;
  }
`;

export const PersonaInfoText = styled.span`
  font-size: 0.625rem;
  font-weight: 500;
  color: #9ea3c0;
  line-height: 1.5;
`;

export const PersonaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const PersonaCard = styled.div<{ $equipped: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid;
  background: #11132580;
  transition:
    border-color 300ms,
    box-shadow 300ms;

  border-color: ${({ $equipped }) => ($equipped ? "#3949abcc" : "#1d2040")};
  box-shadow: ${({ $equipped }) => ($equipped ? "0 0 15px #3949ab18" : "none")};

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const PersonaLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
  min-width: 0;
`;

export const PersonaIconBox = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.625rem;
  background: #1a1e3d;
  border: 1px solid #2e3465;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const PersonaText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
`;

export const PersonaTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const PersonaTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0;
`;

export const PersonaBadge = styled.span`
  font-size: 0.5rem;
  font-weight: 900;
  color: #d4af37;
  background: #d4af3715;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
`;

export const PersonaDesc = styled.p`
  font-size: 0.625rem;
  color: #9ea3c0;
  line-height: 1.5;
  margin: 0;
  font-weight: 300;
`;

export const SoundwaveRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding-top: 0.25rem;
`;

export const SoundwaveLabel = styled.span`
  font-size: 0.5625rem;
  color: #64688a;
  font-weight: 500;
  margin-right: 0.375rem;
`;

export const SoundwaveBar = styled.span<{ $height: number; $active: boolean }>`
  width: 0.125rem;
  border-radius: 9999px;
  background: #3949ab;
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  height: ${({ $height, $active }) => ($active ? `${$height}px` : "0.25rem")};
  transition:
    height 200ms,
    opacity 200ms;
`;

export const PersonaEquipBtn = styled.button<{ $equipped: boolean }>`
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid;
  cursor: ${({ $equipped }) => ($equipped ? "default" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  flex-shrink: 0;
  transition: background 150ms;

  background: ${({ $equipped }) => ($equipped ? "#1b1f3e" : "#2a2c40")};
  color: ${({ $equipped }) => ($equipped ? "#3949ab" : "#e2e4f0")};
  border-color: ${({ $equipped }) => ($equipped ? "#3949ab33" : "#3a3d58")};

  @media (min-width: 640px) {
    width: 11rem;
  }

  &:hover:not(:disabled) {
    background: ${({ $equipped }) => ($equipped ? "#1b1f3e" : "#343850")};
  }
`;

/* ────────────────────────────────────────────
   상점 유도 배너 (공통)
──────────────────────────────────────────── */
export const StoreBanner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #1d2040;
  background: #14172f;
  margin-top: auto;
  flex-shrink: 0;

  ${MOBILE} {
    margin-top: 0;
  }

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const StoreBannerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const StoreIconBox = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: #1a1e3d;
  border: 1px solid #2e3465;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const StoreBannerTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 700;
  color: #e2e4f0;
  margin: 0;
`;

export const StoreBannerDesc = styled.p`
  font-size: 0.75rem;
  color: #64688a;
  margin: 0.25rem 0 0;
`;

export const StoreBannerBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid #2e3465;
  background: #1b1f3e;
  color: #9ea3c0;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 150ms,
    color 150ms;

  &:hover {
    background: #23284f;
    color: #ffffff;
  }
`;
