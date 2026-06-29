import styled from "@emotion/styled";
import { mypageMobileSectionUnderbarStyle } from "@/components/mypage/common/mypageMobileSectionUnderbar";
import { mypageMobileFixedTopBarStyle } from "@/components/mypage/common/mypageMobileFixedTopBar.style";

const MOBILE = "@media (max-width: 640px)";

/** 호버 오버레이·버튼 — component selector 미사용을 위해 class name으로 타깃 */
export const HISTORY_OVERLAY_CLASS = "mago-history-overlay";
export const HISTORY_OVERLAY_BTN_CLASS = "mago-history-overlay-btn";

/* ────────────────────────────────────────────────────────
   외부 흰 카드 컨테이너
──────────────────────────────────────────────────────── */

/** 히스토리 페이지 루트 — 기존 ContentCard 대체 */
export const HistoryRoot = styled.div`
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

/* ────────────────────────────────────────────────────────
   헤더: 제목 + 검색
──────────────────────────────────────────────────────── */

export const HistoryHeader = styled.div`
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

/** 모바일 전용 최상단 행 — 뒤로가기 + 검색 (스크롤 시 상단 고정) */
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

/** 뒤로가기 버튼 */
export { MypageMobileBackButton as BackButton } from "@/components/mypage/common/mypageMobileBackButton.style";

/** 모바일 — 타이틀 + 부제 한 블록 (HistoryRoot gap과 분리) */
export const MobileHeaderBlock = styled.div`
  display: none;

  ${MOBILE} {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

/** 모바일 제목 행 — 제목 + 총 개수 */
export const MobileTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

/** 모바일 전용 제목 텍스트 */
export const MobileTitleText = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
`;

/** 모바일 총 개수 배지 */
export const MobileTotalBadge = styled.span`
  font-size: 0.6875rem;
  color: #9e9e9e;
  background: #f0f0f0;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
  font-variant-numeric: tabular-nums;

  strong {
    color: #1a237e;
    font-weight: 700;
  }
`;

/** MobileTopBar 내 검색 래퍼 — 데스크톱에서는 숨김 */
export const MobileSearchWrapper = styled.div`
  position: relative;
  flex: 1;

  @media (min-width: 641px) {
    display: none;
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  /* 모바일: MobileTitleRow로 대체 — 데스크톱 타이틀 블록 숨김 */
  ${MOBILE} {
    display: none;
  }
`;

export const HistoryTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
`;

export const HistorySubtitle = styled.p`
  font-size: 0.75rem;
  color: #9e9e9e;
  margin: 0;
  line-height: 1.5;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

/** 모바일 전용 부제 — MobileHeaderBlock 내부 */
export const MobileHistorySubtitle = styled(HistorySubtitle)``;

export const SearchWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 15rem;

  ${MOBILE} {
    flex: 1;
    width: auto;
    /* 모바일: MobileTopBar 안에서 렌더 — 데스크톱 헤더 내 검색창 숨김 */
    display: none;
  }
`;

export const SearchIconWrap = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: #bdbdbd;
  pointer-events: none;
`;

export const SearchInputField = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  background: #f8f9ff;
  border: 1px solid #e8eaf6;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: #212121;
  font-family: inherit;
  transition: border-color 150ms ease-in-out;
  box-sizing: border-box;

  &::placeholder {
    color: #c5cae9;
  }

  &:focus {
    outline: none;
    border-color: #1a237e;
  }
`;

/* ────────────────────────────────────────────────────────
   카테고리 필터 칩
──────────────────────────────────────────────────────── */

export const FilterChipGroupMobile = styled.div`
  display: none;

  ${MOBILE} {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    ${mypageMobileSectionUnderbarStyle}
  }
`;

/** 데스크톱 — 단일 행 flex-wrap */
export const FilterRowDesktop = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  ${MOBILE} {
    display: none;
  }
`;

/** 모바일 — 5개씩 한 줄, 넘치면 가로 스크롤 */
export const FilterRowMobile = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 0.5rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const categoryChipPropOptions = {
  shouldForwardProp: (prop: string) =>
    prop !== "active" && prop !== "accentColor",
};

/** 상단 카테고리 필터 칩 — 카테고리별 accentColor 반영 */
export const FilterChip = styled("button", categoryChipPropOptions)<{
  active?: boolean;
  accentColor?: string;
}>`
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  border: 1px solid
    ${({ active, accentColor }) =>
      active ? (accentColor ?? "#1a237e") : "#e8eaf6"};
  background: #ffffff;
  color: ${({ active, accentColor }) =>
    active ? (accentColor ?? "#1a237e") : "#9e9e9e"};
  cursor: pointer;
  transition: all 150ms ease-in-out;
  font-family: inherit;

  &:hover {
    border-color: ${({ accentColor }) => accentColor ?? "#1a237e"};
    color: ${({ accentColor }) => accentColor ?? "#1a237e"};
  }

  ${MOBILE} {
    flex-shrink: 0;
  }
`;

/* ────────────────────────────────────────────────────────
   세션 카드 그리드
──────────────────────────────────────────────────────── */

/** 데스크톱 전용 그리드 — 모바일에서는 숨김 */
export const SessionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  ${MOBILE} {
    display: none;
  }
`;

/** 모바일 전용 그리드 (무한스크롤) — 데스크톱에서는 숨김 */
export const MobileSessionGrid = styled.div`
  display: none;

  ${MOBILE} {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

/* ────────────────────────────────────────────────────────
   개별 세션 카드 (다크 톤)
──────────────────────────────────────────────────────── */

export const SessionCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: #111325;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 300ms ease-in-out;
  overflow: hidden;

  &:hover {
    background: #13162d;
    border-color: #3a4070;
    transform: translateY(-2px);
  }

  /** 호버 오버레이 표시 */
  &:hover .${HISTORY_OVERLAY_CLASS} {
    opacity: 1;
  }

  /** 호버 버튼 슬라이드 업 */
  &:hover .${HISTORY_OVERLAY_BTN_CLASS} {
    transform: translateY(0);
  }

  ${MOBILE} {
    /* 모바일: 탭(터치) 기반 — 호버 대신 카드 전체 클릭 처리 */
    &:hover {
      transform: none;
    }
    &:active {
      background: #13162d;
      border-color: #3a4070;
    }
  }
`;

/** 카드 상단: 카테고리 배지 + 날짜 */
export const SessionCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

/** 카드 상단 카테고리 배지 — 카테고리별 accentColor 반영 */
export const CategoryBadge = styled("span", categoryChipPropOptions)<{
  accentColor: string;
}>`
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 700;
  background: #1a1d35;
  border: 1px solid ${({ accentColor }) => accentColor};
  color: ${({ accentColor }) => accentColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 9rem;
`;

export const DateLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #a4a8be;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
`;

/** 핵심 요약 — 1줄 고정, 넘치면 말줄임 */
export const SummaryLine = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #e8e9f0;
  line-height: 1.5;
  margin: 0 0 1rem;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* ────────────────────────────────────────────────────────
   카드 하단 푸터: 흐름 지수 · 미니 카드팩 · 리뷰
──────────────────────────────────────────────────────── */

export const SessionFooter = styled.div`
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.875rem;
  border-top: 1px solid #1d2040;
  gap: 0.5rem;
`;

export const FooterGroup = styled.div<{ $alignEnd?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: ${({ $alignEnd }) => ($alignEnd ? "flex-end" : "flex-start")};
`;

export const FooterLabel = styled.span`
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #64688a;
`;

export const FortuneScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const FortuneDot = styled.div<{ $color: string }>`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;

  @keyframes fortunePulse {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  animation: fortunePulse 2s ease-in-out infinite;
`;

export const FortuneScoreText = styled.span<{ $color: string }>`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

export const StarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
`;

export const ReviewBadge = styled.span`
  font-size: 0.625rem;
  color: #64688a;
  background: #1a1d35;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
`;

/* ────────────────────────────────────────────────────────
   호버 오버레이
──────────────────────────────────────────────────────── */

export const HoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  border-radius: 0.75rem;
  opacity: 0;
  transition: opacity 300ms ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  /** 반투명 배경 — 버튼은 별도 레이어로 불투명 유지 */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #0c0e20;
    opacity: 0.6;
    border-radius: inherit;
  }
`;

export const HoverButton = styled.button`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.625rem 1.25rem;
  background: #3d5af1;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-family: inherit;
  pointer-events: auto;
  transform: translateY(0.5rem);
  transition:
    transform 300ms ease-in-out,
    background 150ms ease-in-out;

  &:hover {
    background: #5068f5;
  }
`;

/* ────────────────────────────────────────────────────────
   빈 상태 (Empty State)
──────────────────────────────────────────────────────── */

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
  flex: 1;
`;

export const EmptyIconWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #f5f5f5;
  border: 1px solid #e8eaf6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  color: #bdbdbd;

  @keyframes slowSpin {
    to {
      transform: rotate(360deg);
    }
  }

  svg {
    animation: slowSpin 8s linear infinite;
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #212121;
  margin: 0 0 0.5rem;
`;

export const EmptyDesc = styled.p`
  font-size: 0.75rem;
  color: #9e9e9e;
  max-width: 28rem;
  line-height: 1.7;
  margin: 0 0 1.5rem;
`;

export const EmptyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.5rem;
  background: #1a237e;
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 700;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease-in-out;

  &:hover {
    background: #283593;
    transform: scale(1.03);
  }
`;

/* ────────────────────────────────────────────────────────
   페이지네이션
──────────────────────────────────────────────────────── */

export const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
  gap: 1rem;

  /* 모바일에서는 무한스크롤 — 페이지네이션 행 숨김 */
  ${MOBILE} {
    display: none;
  }
`;

/** 무한스크롤 감지용 센티넬 — 모바일 전용 */
export const InfiniteScrollSentinel = styled.div`
  display: none;
  height: 1px;

  ${MOBILE} {
    display: block;
  }
`;

/** 더 불러오는 중 스피너 — 모바일 전용 */
export const LoadingMore = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0;
  color: #64688a;
  font-size: 0.75rem;
  gap: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  ${MOBILE} {
    display: flex;
  }
`;

export const TotalCount = styled.span`
  font-size: 0.75rem;
  color: #9e9e9e;

  strong {
    color: #1a237e;
    font-weight: 700;
  }
`;

export const PageNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const PageBtn = styled.button<{ $active?: boolean }>`
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-family: inherit;
  cursor: pointer;
  transition: all 150ms ease-in-out;

  background: ${({ $active }) => ($active ? "#d4af37" : "#f8f9ff")};
  border: 1px solid ${({ $active }) => ($active ? "#d4af37" : "#e8eaf6")};
  color: ${({ $active }) => ($active ? "#000000" : "#9e9e9e")};
  box-shadow: ${({ $active }) => ($active ? "0 0 10px #d4af37" : "none")};

  &:hover:not(:disabled) {
    border-color: #1a237e;
    color: #1a237e;
  }
`;

export const NavBtn = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background: #f8f9ff;
  border: 1px solid #e8eaf6;
  color: #9e9e9e;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease-in-out;

  &:hover:not(:disabled) {
    border-color: #1a237e;
    color: #1a237e;
  }

  &:disabled {
    opacity: 0.3;
    pointer-events: none;
  }
`;

/** 페이지네이션 행 좌우 대칭용 */
export const PaginationFooterSpacer = styled.div`
  width: 8rem;
  flex-shrink: 0;
`;
