"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FolderClock,
  Compass,
  Search,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { HistoryListItem } from "./historyTypes";
import MiniCardStack from "./MiniCardStack";
import { getFortuneFlowScoreTheme } from "@/lib/fortuneFlowScoreTheme";
import { MypageMobileFixedTopBarSpacer } from "@/components/mypage/common/mypageMobileFixedTopBar.style";
import {
  getIntentCategoryOption,
  INTENT_CATEGORY_OPTIONS,
  type IntentCategoryOption,
} from "@/components/tarot/setup/setupIntentCatalog";
import type { TarotCategory } from "@/types/tarot";
import {
  HISTORY_OVERLAY_CLASS,
  HISTORY_OVERLAY_BTN_CLASS,
  HistoryRoot,
  HistoryHeader,
  TitleGroup,
  HistoryTitle,
  HistorySubtitle,
  MobileHistorySubtitle,
  SearchWrapper,
  SearchIconWrap,
  SearchInputField,
  FilterRowDesktop,
  FilterChipGroupMobile,
  FilterRowMobile,
  FilterChip,
  SessionGrid,
  SessionCard,
  SessionCardHeader,
  CategoryBadge,
  DateLabel,
  SummaryLine,
  SessionFooter,
  FooterGroup,
  FooterLabel,
  FortuneScoreRow,
  FortuneDot,
  FortuneScoreText,
  StarRow,
  ReviewBadge,
  HoverOverlay,
  HoverButton,
  EmptyState,
  EmptyIconWrapper,
  EmptyTitle,
  EmptyDesc,
  EmptyButton,
  PaginationRow,
  TotalCount,
  PageNav,
  PageBtn,
  NavBtn,
  PaginationFooterSpacer,
  MobileTopBar,
  BackButton,
  MobileHeaderBlock,
  MobileTitleRow,
  MobileTitleText,
  MobileTotalBadge,
  MobileSearchWrapper,
  InfiniteScrollSentinel,
  LoadingMore,
  MobileSessionGrid,
} from "./HistoryPageClient.style";

const PAGE_SIZE = 6;
const MOBILE_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

/** 히스토리 페이지 부제 — 데스크톱·모바일 공통 */
const HISTORY_PAGE_SUBTITLE =
  "마고와 함께 나누었던 깊은 조언과 고민들을 한자리에서 다시 볼 수 있습니다.";

/** 퍼블리싱 기준 카테고리 필터 칩 고정 노출 순서 */
const HISTORY_FILTER_CATEGORY_IDS: readonly TarotCategory[] = [
  "career",
  "love",
  "money",
  "health",
  "study",
  "family",
  "travel",
  "dream",
  "custom",
];

const HISTORY_CATEGORY_FILTER_OPTIONS: readonly string[] = [
  "전체",
  ...HISTORY_FILTER_CATEGORY_IDS.map(
    (id) => getIntentCategoryOption(id)?.badgeLabel ?? id,
  ),
];

/** 필터 칩 5개씩 2줄 */
const HISTORY_FILTER_CHIP_ROWS: readonly (readonly string[])[] = [
  HISTORY_CATEGORY_FILTER_OPTIONS.slice(0, 5),
  HISTORY_CATEGORY_FILTER_OPTIONS.slice(5, 10),
];

/** badgeLabel 기준 카테고리 메타 조회 */
function getCategoryOption(category: string): IntentCategoryOption | null {
  const exact = INTENT_CATEGORY_OPTIONS.find((o) => o.badgeLabel === category);
  if (exact) return exact;

  const partial = INTENT_CATEGORY_OPTIONS.find((o) =>
    category.startsWith(o.badgeLabel.split("/")[0]),
  );
  return partial ?? null;
}

/** 카테고리 아이콘 조회 */
function getCategoryIcon(category: string): LucideIcon | null {
  return getCategoryOption(category)?.icon ?? null;
}

/** 카테고리 accentColor — 없으면 primary blue */
function getCategoryAccentColor(category: string): string {
  return getCategoryOption(category)?.accentColor ?? "#1a237e";
}

/** YYYY.MM.DD 포맷 */
function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

type HistoryPageClientProps = {
  initialSessions: HistoryListItem[];
};

/**
 * 내 운세 히스토리 — tarot_sessions 목록 기반 UI
 * 데스크톱: 페이지네이션 / 모바일: 무한스크롤
 */
export default function HistoryPageClient({
  initialSessions,
}: HistoryPageClientProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /** 모바일 무한스크롤 표시 개수 */
  const [mobileVisibleCount, setMobileVisibleCount] =
    useState(MOBILE_PAGE_SIZE);
  const [isMobileLoadingMore, setIsMobileLoadingMore] = useState(false);

  /** 무한스크롤 센티넬 ref */
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  /** summary_line 검색 — 300ms 디바운스 */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  /** 필터/검색 변경 시 무한스크롤 카운트 초기화 */
  useEffect(() => {
    setMobileVisibleCount(MOBILE_PAGE_SIZE);
  }, [debouncedSearchTerm, selectedCategory]);

  /** 필터링 + 최신순 정렬 (서버 fetch는 이미 최신순) */
  const filteredData = useMemo(() => {
    return initialSessions.filter((item) => {
      if (
        selectedCategory !== "전체" &&
        item.main_category !== selectedCategory
      )
        return false;
      if (debouncedSearchTerm) {
        return item.summary_line
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
      }
      return true;
    });
  }, [initialSessions, selectedCategory, debouncedSearchTerm]);

  /** 전체 리딩 수 — 필터·검색과 무관 */
  const totalSessionCount = initialSessions.length;

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  /** 모바일 표시 데이터 */
  const mobileData = filteredData.slice(0, mobileVisibleCount);
  const hasMobileMore = mobileVisibleCount < filteredData.length;

  /** IntersectionObserver — 센티넬 노출 시 다음 배치 로드 */
  const loadMore = useCallback(() => {
    if (!hasMobileMore || isMobileLoadingMore) return;
    setIsMobileLoadingMore(true);
    // 데이터가 이미 클라이언트에 있으므로 setTimeout으로 UX 딜레이만 부여
    setTimeout(() => {
      setMobileVisibleCount((prev) => prev + MOBILE_PAGE_SIZE);
      setIsMobileLoadingMore(false);
    }, 400);
  }, [hasMobileMore, isMobileLoadingMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const renderFilterChip = (cat: string) => {
    const isActive = cat === selectedCategory;
    const accentColor =
      cat === "전체" ? "#1a237e" : getCategoryAccentColor(cat);
    const Icon = cat !== "전체" ? getCategoryIcon(cat) : null;

    return (
      <FilterChip
        key={cat}
        active={isActive}
        accentColor={accentColor}
        onClick={() => {
          setSelectedCategory(cat);
          setCurrentPage(1);
        }}
      >
        {Icon != null && (
          <Icon size={11} color={isActive ? accentColor : "#9e9e9e"} />
        )}
        {cat}
      </FilterChip>
    );
  };

  return (
    <HistoryRoot>
      {/* 모바일 전용: 뒤로가기 + 검색 */}
      <MobileTopBar>
        <BackButton
          type="button"
          aria-label="뒤로가기"
          onClick={() => router.push("/mypage")}
        >
          <ChevronLeft size={18} />
        </BackButton>
        <MobileSearchWrapper>
          <SearchIconWrap>
            <Search size={14} />
          </SearchIconWrap>
          <SearchInputField
            type="text"
            placeholder="핵심 요약 검색..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setCurrentPage(1);
            }}
          />
        </MobileSearchWrapper>
      </MobileTopBar>
      <MypageMobileFixedTopBarSpacer aria-hidden />

      {/* 모바일 전용: 제목 + 부제 */}
      <MobileHeaderBlock>
        <MobileTitleRow>
          <MobileTitleText>내 운세 히스토리</MobileTitleText>
          <MobileTotalBadge>
            총 <strong>{totalSessionCount}개</strong>
          </MobileTotalBadge>
        </MobileTitleRow>
        <MobileHistorySubtitle>
          마고와 함께 나누었던 깊은 조언과 고민들을
          <br />
          한자리에서 다시 볼 수 있습니다.
        </MobileHistorySubtitle>
      </MobileHeaderBlock>

      {/* 데스크톱 헤더 */}
      <HistoryHeader>
        <TitleGroup>
          <HistoryTitle>
            <FolderClock size={20} />내 운세 히스토리
          </HistoryTitle>
          <HistorySubtitle>{HISTORY_PAGE_SUBTITLE}</HistorySubtitle>
        </TitleGroup>

        <SearchWrapper>
          <SearchIconWrap>
            <Search size={14} />
          </SearchIconWrap>
          <SearchInputField
            type="text"
            placeholder="핵심 요약 검색..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setCurrentPage(1);
            }}
          />
        </SearchWrapper>
      </HistoryHeader>

      {/* 데스크톱 — 단일 행 wrap / 모바일 — 5개씩 2줄 가로 스크롤 */}
      <FilterRowDesktop>
        {HISTORY_CATEGORY_FILTER_OPTIONS.map((cat) => renderFilterChip(cat))}
      </FilterRowDesktop>
      <FilterChipGroupMobile>
        {HISTORY_FILTER_CHIP_ROWS.map((row, rowIndex) => (
          <FilterRowMobile key={rowIndex}>
            {row.map((cat) => renderFilterChip(cat))}
          </FilterRowMobile>
        ))}
      </FilterChipGroupMobile>

      {/* 콘텐츠 영역 */}
      {filteredData.length > 0 ? (
        <>
          {/* 데스크톱: paginatedData / 모바일: mobileData — CSS로 분기 */}
          <SessionGrid>
            {/* 데스크톱 세션 카드 */}
            {paginatedData.map((session) => {
              const scoreTheme = getFortuneFlowScoreTheme(
                session.fortune_score,
              );
              const categoryAccent = getCategoryAccentColor(
                session.main_category,
              );
              return (
                <SessionCard
                  key={`desktop-${session.id}`}
                  data-desktop-only
                  onClick={() => router.push(`/tarot/result/${session.id}`)}
                >
                  {/* 카드 헤더 */}
                  <SessionCardHeader>
                    <CategoryBadge accentColor={categoryAccent}>
                      {session.main_category} · {session.detail_category}
                    </CategoryBadge>
                    <DateLabel>
                      <Calendar size={10} />
                      {formatDate(session.created_at)}
                    </DateLabel>
                  </SessionCardHeader>

                  {/* 핵심 요약 */}
                  <SummaryLine>{`"${session.summary_line}"`}</SummaryLine>

                  {/* 푸터 */}
                  <SessionFooter>
                    <FooterGroup>
                      <FooterLabel>운세 흐름 지수</FooterLabel>
                      <FortuneScoreRow>
                        <FortuneDot $color={scoreTheme.color} />
                        <FortuneScoreText $color={scoreTheme.color}>
                          {session.fortune_score}%
                        </FortuneScoreText>
                      </FortuneScoreRow>
                    </FooterGroup>
                    <MiniCardStack count={session.card_count} />
                    <FooterGroup $alignEnd>
                      <FooterLabel>리뷰 상태</FooterLabel>
                      {session.has_reviewed ? (
                        <StarRow>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={10}
                              color={
                                i < (session.rating ?? 0)
                                  ? "#d4af37"
                                  : "#3d4060"
                              }
                              fill={
                                i < (session.rating ?? 0) ? "#d4af37" : "none"
                              }
                            />
                          ))}
                        </StarRow>
                      ) : (
                        <ReviewBadge>미작성</ReviewBadge>
                      )}
                    </FooterGroup>
                  </SessionFooter>

                  {/* 호버 오버레이 — 데스크톱 전용 */}
                  <HoverOverlay className={HISTORY_OVERLAY_CLASS}>
                    <HoverButton
                      className={HISTORY_OVERLAY_BTN_CLASS}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/tarot/result/${session.id}`);
                      }}
                    >
                      다시 읽어보기
                      <ChevronRight size={13} />
                    </HoverButton>
                  </HoverOverlay>
                </SessionCard>
              );
            })}
          </SessionGrid>

          {/* 모바일 세션 카드 그리드 (무한스크롤) */}
          <MobileSessionGrid>
            {mobileData.map((session) => {
              const scoreTheme = getFortuneFlowScoreTheme(
                session.fortune_score,
              );
              const categoryAccent = getCategoryAccentColor(
                session.main_category,
              );
              return (
                <SessionCard
                  key={`mobile-${session.id}`}
                  onClick={() => router.push(`/tarot/result/${session.id}`)}
                >
                  <SessionCardHeader>
                    <CategoryBadge accentColor={categoryAccent}>
                      {session.main_category} · {session.detail_category}
                    </CategoryBadge>
                    <DateLabel>
                      <Calendar size={10} />
                      {formatDate(session.created_at)}
                    </DateLabel>
                  </SessionCardHeader>
                  <SummaryLine>{`"${session.summary_line}"`}</SummaryLine>
                  <SessionFooter>
                    <FooterGroup>
                      <FooterLabel>운세 흐름 지수</FooterLabel>
                      <FortuneScoreRow>
                        <FortuneDot $color={scoreTheme.color} />
                        <FortuneScoreText $color={scoreTheme.color}>
                          {session.fortune_score}%
                        </FortuneScoreText>
                      </FortuneScoreRow>
                    </FooterGroup>
                    <MiniCardStack count={session.card_count} />
                    <FooterGroup $alignEnd>
                      <FooterLabel>리뷰 상태</FooterLabel>
                      {session.has_reviewed ? (
                        <StarRow>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={10}
                              color={
                                i < (session.rating ?? 0)
                                  ? "#d4af37"
                                  : "#3d4060"
                              }
                              fill={
                                i < (session.rating ?? 0) ? "#d4af37" : "none"
                              }
                            />
                          ))}
                        </StarRow>
                      ) : (
                        <ReviewBadge>미작성</ReviewBadge>
                      )}
                    </FooterGroup>
                  </SessionFooter>
                </SessionCard>
              );
            })}
          </MobileSessionGrid>

          {/* 무한스크롤 센티넬 + 로딩 인디케이터 */}
          <InfiniteScrollSentinel ref={sentinelRef} />
          {isMobileLoadingMore && (
            <LoadingMore>
              <Loader2
                size={16}
                style={{ animation: "spin 1s linear infinite" }}
              />
              불러오는 중...
            </LoadingMore>
          )}
        </>
      ) : (
        /* 빈 상태 */
        <EmptyState>
          <EmptyIconWrapper>
            <Compass size={28} />
          </EmptyIconWrapper>
          <EmptyTitle>아직 마고와 나눈 대화가 없어요</EmptyTitle>
          <EmptyDesc>
            현재 카테고리에 맞는 타로 질문 내역이 존재하지 않거나,
            <br />
            아직 리딩을 시작하지 않은 상태입니다.
            <br />
            오늘 당신의 운세 길잡이를 먼저 받아보세요!
          </EmptyDesc>
          <EmptyButton onClick={() => router.push("/")}>
            타로 보러 가기
          </EmptyButton>
        </EmptyState>
      )}

      {/* 데스크톱 하단 — 토탈 개수는 항상 표시, 페이지네이션은 결과 있을 때만 */}
      <PaginationRow>
        <TotalCount>
          총 <strong>{totalSessionCount}개</strong>의 고민 기록
        </TotalCount>

        {filteredData.length > 0 && totalPages > 1 ? (
          <PageNav>
            <NavBtn
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft size={15} />
            </NavBtn>

            {Array.from({ length: totalPages }, (_, idx) => (
              <PageBtn
                key={idx + 1}
                $active={currentPage === idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </PageBtn>
            ))}

            <NavBtn
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
            >
              <ChevronRight size={15} />
            </NavBtn>
          </PageNav>
        ) : null}

        <PaginationFooterSpacer />
      </PaginationRow>
    </HistoryRoot>
  );
}
