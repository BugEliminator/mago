import styled from "@emotion/styled";
import { mypageMobileSectionUnderbarStyle } from "@/components/mypage/common/mypageMobileSectionUnderbar";
import { mypageMobileFixedTopBarStyle } from "@/components/mypage/common/mypageMobileFixedTopBar.style";

const MOBILE = "@media (max-width: 640px)";

/* ────────────────────────────────────────────
   외부 흰 셸 (히스토리·프로필과 동일 패턴)
──────────────────────────────────────────── */
export const CoinsRoot = styled.div`
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

/* ────────────────────────────────────────────
   헤더 (타이틀 + 서브타이틀 + 데모 토글)
──────────────────────────────────────────── */
export const CoinsHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  gap: 1rem;

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

/** 모바일 — 타이틀 + 부제 한 블록 */
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

export const MobileCoinsSubtitle = styled.p`
  font-size: 0.75rem;
  color: #9e9e9e;
  margin: 0;
  line-height: 1.5;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

/** 모바일 전용 본문 — 잔액 + 탭 + 패널 */
export const MobileCoinsSection = styled.div`
  display: none;

  ${MOBILE} {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
`;

/** 모바일 탭 칩 행 — 콘텐츠 너비만큼, 하단 언더바 */
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

/** 모바일 탭 콘텐츠 패널 */
export const MobileTabPanel = styled.div`
  background: #0d0f1f;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const CoinsTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
`;

export const CoinsSubtitle = styled.p`
  font-size: 0.75rem;
  color: #9e9e9e;
  margin: 0;
`;

/** 데모 잠금/해제 토글 버튼 */
export const DemoToggleBtn = styled.button<{ $locked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 700;
  border: 1px solid;
  cursor: pointer;
  transition:
    background 150ms,
    color 150ms;
  flex-shrink: 0;

  background: ${({ $locked }) => ($locked ? "#1a060b" : "#031a0e")};
  border-color: ${({ $locked }) => ($locked ? "#7f1d1d50" : "#14532d50")};
  color: ${({ $locked }) => ($locked ? "#f87171" : "#4ade80")};

  &:hover {
    background: ${({ $locked }) => ($locked ? "#270c12" : "#052e16")};
  }
`;

/* ────────────────────────────────────────────
   메인 2:1 그리드 (고정 높이 래퍼)
──────────────────────────────────────────── */
/** 양쪽 컬럼 공통 래퍼 — 다크 인셋 배경 + 고정 높이 (데스크톱 전용) */
export const CoinsBody = styled.div`
  height: 40rem;
  background: #0d0f1f;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  overflow: hidden;

  ${MOBILE} {
    display: none;
  }
`;

export const CoinsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: stretch;
  height: 100%;
`;

/** 왼쪽 충전 영역 — 세로 구분선으로 오른쪽과 분리 */
export const CoinsLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  border-right: 1px solid #1d2040;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

/* ────────────────────────────────────────────
   잔액 카드
──────────────────────────────────────────── */
export const BalanceCard = styled.div`
  position: relative;
  background: linear-gradient(135deg, #141732 0%, #0f1126 55%, #0a0b18 100%);
  border: 1px solid #1d224a;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  gap: 0.75rem;

  &::before {
    content: "";
    position: absolute;
    right: -1.5rem;
    bottom: -1.5rem;
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
    background: radial-gradient(circle, #3949ab20, transparent 70%);
    pointer-events: none;
  }

  ${MOBILE} {
    flex-wrap: wrap;
    padding: 1.25rem;
  }
`;

export const BalanceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: relative;
  z-index: 1;
`;

export const BalanceLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #64688a;
`;

export const BalanceAmount = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
`;

export const BalanceNumber = styled.span`
  font-size: 2rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.02em;
`;

export const BalanceUnit = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: #d4af37;
`;

export const BalanceActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 1;

  ${MOBILE} {
    width: 100%;
    justify-content: space-between;
  }
`;

export const CheckInWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.375rem;

  ${MOBILE} {
    align-items: flex-start;
    flex: 1;
    min-width: 0;
  }
`;

export const CheckInBtn = styled.button<{ $done: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  border: none;
  cursor: ${({ $done }) => ($done ? "not-allowed" : "pointer")};
  transition: filter 150ms;
  white-space: nowrap;

  background: ${({ $done }) =>
    $done ? "#1c1e30" : "linear-gradient(90deg, #d4af37, #f59e0b)"};
  color: ${({ $done }) => ($done ? "#4a4e6a" : "#000000")};
  border: 1px solid ${({ $done }) => ($done ? "#2a2c40" : "transparent")};
  box-shadow: ${({ $done }) => ($done ? "none" : "0 0 15px #d4af3740")};

  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  ${MOBILE} {
    font-size: 0.6875rem;
    padding: 0.5rem 0.75rem;
  }
`;

export const CheckInHint = styled.span`
  font-size: 0.625rem;
  color: #4a4e6a;
`;

export const CoinOrbWrap = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #d4af3710;
  border: 1px solid #d4af3730;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px #d4af3720;
`;

/* ────────────────────────────────────────────
   섹션 타이틀
──────────────────────────────────────────── */
export const SectionTitle = styled.h3<{ $accent?: string }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ $accent }) => $accent ?? "#d4af37"};
  margin: 0;
`;

/* ────────────────────────────────────────────
   유료 패키지 그리드
──────────────────────────────────────────── */
export const PackageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
`;

export const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
`;

export const PackageCard = styled.div`
  background: #111325;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 7rem;
`;

export const PackageTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
`;

/** 금액 + 보너스 칩 — 모바일 세로 / 데스크톱 가로 */
export const PackageCoins = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;

  @media (min-width: 641px) {
    flex-direction: row;
    align-items: center;
    gap: 0.375rem;
  }
`;

export const PackageCoinsLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.2;
`;

export const PackageBonus = styled.span`
  font-size: 0.5625rem;
  font-weight: 700;
  color: #d4af37;
  background: #d4af3715;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  line-height: 1.3;
  flex-shrink: 0;
`;

export const PackageRate = styled.span`
  font-size: 0.6875rem;
  color: #4a4e6a;
  font-family: "Courier New", monospace;
  line-height: 1.3;
`;

export const PackageBuyBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  width: 100%;
  padding: 0.5rem;
  background: #181a35;
  border: 1px solid #1d2040;
  border-radius: 0.5rem;
  color: #e2e4f0;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 150ms;

  &:hover {
    background: #1f2246;
  }
`;

/** 잠금 오버레이 (유료·무료 섹션 공통) — 배경만 ::before로 투명 처리 */
export const LockOverlay = styled.div<{ $compact?: boolean }>`
  position: absolute;
  inset: 0;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: ${({ $compact }) => ($compact ? "row" : "column")};
  align-items: center;
  justify-content: center;
  text-align: ${({ $compact }) => ($compact ? "left" : "center")};
  gap: ${({ $compact }) => ($compact ? "0.75rem" : "0.5rem")};
  padding: ${({ $compact }) => ($compact ? "0.75rem 1rem" : "1.5rem")};
  z-index: 10;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: #0d0f1f;
    opacity: 0.75;
    z-index: -1;
  }
`;

export const LockIconWrap = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: #0c0e20;
  border: 1px solid #2a2c40;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LockTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

export const LockTitle = styled.p`
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  flex-shrink: 0;
`;

export const LockDesc = styled.p`
  font-size: 0.625rem;
  color: #64688a;
  margin: 0;
  line-height: 1.5;
  max-width: 18rem;
`;

/* ────────────────────────────────────────────
   무료 광고 섹션
──────────────────────────────────────────── */
export const AdSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
`;

export const AdCardWrap = styled.div`
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
`;

export const AdCard = styled.div`
  background: #111325;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
  overflow: hidden;

  ${MOBILE} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const AdLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const AdIconBox = styled.div`
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

export const AdText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const AdTitle = styled.p`
  font-size: 0.75rem;
  font-weight: 700;
  color: #e2e4f0;
  margin: 0;
`;

export const AdDesc = styled.p`
  font-size: 0.625rem;
  color: #64688a;
  margin: 0;
  line-height: 1.4;
`;

export const AdRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;

  ${MOBILE} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
`;

export const AdCountLabel = styled.span`
  font-size: 0.6875rem;
  font-family: "Courier New", monospace;
  font-weight: 700;
  color: #9ea3c0;
`;

export const AdCountHighlight = styled.span`
  color: #3949ab;
`;

export const AdWatchBtn = styled.button<{ $disabled: boolean }>`
  padding: 0.5rem 1rem;
  background: ${({ $disabled }) => ($disabled ? "#1c1e30" : "#1a237e")};
  color: ${({ $disabled }) => ($disabled ? "#4a4e6a" : "#ffffff")};
  border: 1px solid
    ${({ $disabled }) => ($disabled ? "#2a2c40" : "transparent")};
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: background 150ms;
  box-shadow: ${({ $disabled }) =>
    $disabled ? "none" : "0 4px 12px #1a237e40"};

  &:hover:not(:disabled) {
    background: #283593;
  }
`;

/* ────────────────────────────────────────────
   이용 내역 (오른쪽 컬럼)
──────────────────────────────────────────── */
export const HistoryPanel = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  min-height: 0;
  overflow: hidden;
`;

export const HistoryPanelTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64688a;
  margin: 0;
  flex-shrink: 0;
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  flex: 1;
  min-height: 0;

  /* 스크롤바 숨김 */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

/** 모바일 이용 내역 — 패널 내부 자연 높이 */
export const MobileHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const HistoryItem = styled.div`
  background: #14172f;
  border: 1px solid #1d2040;
  border-radius: 0.625rem;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const HistoryItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

export const HistoryItemDesc = styled.p`
  font-size: 0.6875rem;
  font-weight: 700;
  color: #c5c8e0;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const HistoryItemDate = styled.p`
  font-size: 0.625rem;
  font-weight: 500;
  font-family: "Courier New", monospace;
  color: #c5c8e0;
  margin: 0;
`;

export const HistoryItemAmount = styled.span<{ $plus: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.75rem;
  font-family: "Courier New", monospace;
  font-weight: 900;
  flex-shrink: 0;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;

  color: ${({ $plus }) => ($plus ? "#4ade80" : "#f87171")};
  background: ${({ $plus }) => ($plus ? "#14532d20" : "#7f1d1d20")};
  border: 1px solid ${({ $plus }) => ($plus ? "#4ade8030" : "#f8717130")};
`;
