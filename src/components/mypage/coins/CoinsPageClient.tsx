"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { requestClaimAttendanceFromClient } from "@/lib/requestClaimAttendanceFromClient";
import { useCoinStore } from "@/stores/coinStore";
import type { CoinPageInitialData } from "@/types/coin";
import {
  CircleDollarSign,
  Lock,
  Unlock,
  CalendarCheck,
  CreditCard,
  Tv,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
} from "lucide-react";
import {
  CHECKIN_REWARD,
  AD_REWARD,
  AD_MAX_COUNT,
  COIN_PACKAGES,
} from "./coinsMockData";
import type { CoinTransaction } from "./coinsMockData";
import type { CoinHistoryItem } from "@/types/coin";
import { MypageMobileFixedTopBarSpacer } from "@/components/mypage/common/mypageMobileFixedTopBar.style";
import {
  CoinsRoot,
  CoinsHeader,
  TitleGroup,
  CoinsTitle,
  CoinsSubtitle,
  DemoToggleBtn,
  MobileTopBar,
  BackButton,
  MobileHeaderBlock,
  MobileTitleText,
  MobileCoinsSubtitle,
  MobileCoinsSection,
  MobileTabBar,
  MobileTabChip,
  MobileTabPanel,
  CoinsBody,
  CoinsGrid,
  CoinsLeft,
  BalanceCard,
  BalanceInfo,
  BalanceLabel,
  BalanceAmount,
  BalanceNumber,
  BalanceUnit,
  BalanceActions,
  CheckInWrap,
  CheckInBtn,
  CheckInHint,
  CoinOrbWrap,
  SectionTitle,
  PackageSection,
  PackageGrid,
  PackageCard,
  PackageTop,
  PackageCoins,
  PackageCoinsLabel,
  PackageBonus,
  PackageRate,
  PackageBuyBtn,
  LockOverlay,
  LockIconWrap,
  LockTextGroup,
  LockTitle,
  LockDesc,
  AdSection,
  AdCardWrap,
  AdCard,
  AdLeft,
  AdIconBox,
  AdText,
  AdTitle,
  AdDesc,
  AdRight,
  AdCountLabel,
  AdCountHighlight,
  AdWatchBtn,
  HistoryPanel,
  HistoryPanelTitle,
  HistoryList,
  MobileHistoryList,
  HistoryItem,
  HistoryItemInfo,
  HistoryItemDesc,
  HistoryItemDate,
  HistoryItemAmount,
} from "./CoinsPageClient.style";

/** 현재 시각을 "YYYY.MM.DD HH:MM" 형태로 반환 — 데모 광고/유료 내역용 */
function nowLabel(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type CoinsMobileTab = "pay" | "ad" | "history";

const COINS_MOBILE_TABS: { id: CoinsMobileTab; label: string }[] = [
  { id: "pay", label: "유료 복채 충전" },
  { id: "ad", label: "무료 복채 충전" },
  { id: "history", label: "최근 이용 내역" },
];

/** 엽전 충전소 부제 */
function CoinsPageSubtitle() {
  return (
    <>
      마고의 신비로운 운세와 타로 리딩을 잠금해제할 수 있는
      <br />
      영험한 재화입니다.
    </>
  );
}

type CoinsPageClientProps = {
  initialData: CoinPageInitialData;
};

export default function CoinsPageClient({ initialData }: CoinsPageClientProps) {
  const router = useRouter();
  const setCoinBalance = useCoinStore((s) => s.setBalance);
  const setCoinHasCheckedIn = useCoinStore((s) => s.setHasCheckedInToday);
  const [activeTab, setActiveTab] = useState<CoinsMobileTab>("pay");
  const [isLocked, setIsLocked] = useState(true);
  const [balance, setBalance] = useState(initialData.balance);
  const [hasCheckedIn, setHasCheckedIn] = useState(
    initialData.hasCheckedInToday,
  );
  const [adCount, setAdCount] = useState(0);
  const [histories, setHistories] = useState<CoinHistoryItem[]>(
    initialData.histories,
  );
  /** 데모 잠금 해제 시 광고·유료만 로컬에 쌓는 목 내역 */
  const [demoTransactions, setDemoTransactions] = useState<CoinTransaction[]>(
    [],
  );

  /** 서버 prefetch → coinStore 동기화 (헤더 등과 공유) */
  useEffect(() => {
    setCoinBalance(initialData.balance);
    setCoinHasCheckedIn(initialData.hasCheckedInToday);
  }, [
    initialData.balance,
    initialData.hasCheckedInToday,
    setCoinBalance,
    setCoinHasCheckedIn,
  ]);

  /** 데모 이용 내역 맨 앞에 추가 */
  const addDemoTransaction = (tx: Omit<CoinTransaction, "id" | "date">) => {
    setDemoTransactions((prev) => [
      { ...tx, id: Date.now(), date: nowLabel() },
      ...prev,
    ]);
  };

  /** 출석 체크 — Supabase EARN_ATTENDANCE */
  const handleCheckIn = async () => {
    if (hasCheckedIn) return;

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError != null || session?.access_token == null) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    const result = await requestClaimAttendanceFromClient(
      session.access_token,
    );

    if (!result.ok) {
      if (result.code === "ALREADY_CHECKED_IN") {
        setHasCheckedIn(true);
        setCoinHasCheckedIn(true);
      }
      toast.error(result.error);
      return;
    }

    setBalance(result.newBalance);
    setHasCheckedIn(true);
    setCoinBalance(result.newBalance);
    setCoinHasCheckedIn(true);
    setHistories((prev) => [result.history, ...prev]);
    toast.success(`출석 완료! +${CHECKIN_REWARD}냥 적립`);
  };

  /** 광고 시청 */
  const handleWatchAd = () => {
    if (adCount >= AD_MAX_COUNT) return;
    const next = adCount + 1;
    setAdCount(next);
    setBalance((b) => {
      const nextBalance = b + AD_REWARD;
      setCoinBalance(nextBalance);
      return nextBalance;
    });
    addDemoTransaction({
      type: "charge_ad",
      amount: AD_REWARD,
      description: "데일리 행운 광고 시청 보상",
    });
    if (next >= AD_MAX_COUNT) {
      toast.success(
        `광고 보상 완료! 오늘 최대 횟수(${AD_MAX_COUNT}회)를 채웠습니다.`,
      );
    } else {
      toast.success(`광고 보상 +${AD_REWARD}냥 적립`);
    }
  };

  /** 유료 패키지 구매 */
  const handleBuyPackage = (
    amount: number,
    priceLabel: string,
    coinsLabel: string,
  ) => {
    setBalance((b) => {
      const nextBalance = b + amount;
      setCoinBalance(nextBalance);
      return nextBalance;
    });
    addDemoTransaction({
      type: "charge_pay",
      amount,
      description: `엽전 ${coinsLabel} 충전 (${priceLabel})`,
    });
    toast.success(`${coinsLabel} 충전 완료! +${amount}냥 적립`);
  };

  const adDone = adCount >= AD_MAX_COUNT;

  /** 잔액 + 출석 배너 */
  const renderBalanceCard = () => (
    <BalanceCard>
      <BalanceInfo>
        <BalanceLabel>현재 보유 중인 재화</BalanceLabel>
        <BalanceAmount>
          <BalanceNumber>{balance}</BalanceNumber>
          <BalanceUnit>냥</BalanceUnit>
        </BalanceAmount>
      </BalanceInfo>

      <BalanceActions>
        <CheckInWrap>
          <CheckInBtn
            type="button"
            $done={hasCheckedIn}
            disabled={hasCheckedIn}
            onClick={() => void handleCheckIn()}
          >
            <CalendarCheck size={16} />
            {hasCheckedIn ? "출석 수령 완료" : `${CHECKIN_REWARD}냥 수령하기`}
          </CheckInBtn>
          <CheckInHint>
            * 매일 한국 표준시(KST) 자정에 초기화됩니다.
          </CheckInHint>
        </CheckInWrap>

        <CoinOrbWrap>
          <CircleDollarSign size={24} color="#d4af37" />
        </CoinOrbWrap>
      </BalanceActions>
    </BalanceCard>
  );

  /** 유료 복채 충전 */
  const renderPaySection = (showTitle: boolean) => (
    <PackageSection>
      {showTitle && <SectionTitle>✦ 유료 복채 충전</SectionTitle>}
      <PackageGrid>
        {COIN_PACKAGES.map((pkg) => (
          <PackageCard key={pkg.priceLabel}>
            <PackageTop>
              <PackageCoins>
                <PackageCoinsLabel>{pkg.coins}</PackageCoinsLabel>
                {pkg.bonusLabel != null && (
                  <PackageBonus>{pkg.bonusLabel}</PackageBonus>
                )}
              </PackageCoins>
              <PackageRate>{pkg.rate}</PackageRate>
            </PackageTop>
            <PackageBuyBtn
              type="button"
              onClick={() =>
                handleBuyPackage(pkg.amount, pkg.priceLabel, pkg.coins)
              }
            >
              <CreditCard size={13} color="#3949ab" />
              {pkg.priceLabel}
            </PackageBuyBtn>
          </PackageCard>
        ))}

        {isLocked && (
          <LockOverlay>
            <LockIconWrap>
              <Lock size={16} color="#f87171" />
            </LockIconWrap>
            <LockTitle>결제 모듈 연동 준비 중</LockTitle>
            <LockDesc>
              본 기능은 정식 사업자 및 서비스 오픈 스케줄에 맞춰 안전하게
              활성화될 예정입니다. (Coming Soon)
            </LockDesc>
          </LockOverlay>
        )}
      </PackageGrid>
    </PackageSection>
  );

  /** 무료 복채 충전 (광고) */
  const renderAdSection = (showTitle: boolean) => (
    <AdSection>
      {showTitle && (
        <SectionTitle $accent="#3949ab">✦ 무료 복채 충전</SectionTitle>
      )}
      <AdCardWrap>
        <AdCard>
          <AdLeft>
            <AdIconBox>
              <Tv size={20} color="#3949ab" />
            </AdIconBox>
            <AdText>
              <AdTitle>광고 시청하고 엽전 5냥 보상 받기</AdTitle>
              <AdDesc>
                광고를 끝까지 시청하시면 엽전 5냥을
                <br />
                즉시 적립해 드려요.
              </AdDesc>
            </AdText>
          </AdLeft>
          <AdRight>
            <AdCountLabel>
              오늘 참여 <AdCountHighlight>{adCount}</AdCountHighlight>/
              {AD_MAX_COUNT}
            </AdCountLabel>
            <AdWatchBtn
              type="button"
              $disabled={adDone}
              disabled={adDone}
              onClick={handleWatchAd}
            >
              {adDone ? "오늘 완료" : "광고 보기"}
            </AdWatchBtn>
          </AdRight>
        </AdCard>

        {isLocked && (
          <LockOverlay $compact>
            <LockIconWrap>
              <Lock size={16} color="#f87171" />
            </LockIconWrap>
            <LockTextGroup>
              <LockTitle>무료 충전소 준비 중</LockTitle>
              <LockDesc>
                수익형 광고 SDK 연동 심사 진행 예정 단계입니다.
              </LockDesc>
            </LockTextGroup>
          </LockOverlay>
        )}
      </AdCardWrap>
    </AdSection>
  );

  /** 이용 내역 아이템 목록 */
  const renderHistoryItems = () => (
    <>
      {histories.map((tx) => {
        const isPlus = tx.amount > 0;
        return (
          <HistoryItem key={tx.id}>
            <HistoryItemInfo>
              <HistoryItemDesc title={tx.title}>{tx.title}</HistoryItemDesc>
              <HistoryItemDate>{tx.dateLabel}</HistoryItemDate>
            </HistoryItemInfo>
            <HistoryItemAmount $plus={isPlus}>
              {isPlus ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
              {isPlus ? `+${tx.amount}냥` : `${tx.amount}냥`}
            </HistoryItemAmount>
          </HistoryItem>
        );
      })}
      {!isLocked &&
        demoTransactions.map((tx) => {
          const isPlus = tx.amount > 0;
          return (
            <HistoryItem key={`demo-${tx.id}`}>
              <HistoryItemInfo>
                <HistoryItemDesc title={tx.description}>
                  {tx.description}
                </HistoryItemDesc>
                <HistoryItemDate>{tx.date}</HistoryItemDate>
              </HistoryItemInfo>
              <HistoryItemAmount $plus={isPlus}>
                {isPlus ? (
                  <ArrowUpRight size={13} />
                ) : (
                  <ArrowDownLeft size={13} />
                )}
                {isPlus ? `+${tx.amount}냥` : `${tx.amount}냥`}
              </HistoryItemAmount>
            </HistoryItem>
          );
        })}
    </>
  );

  /** 모바일 탭 패널 콘텐츠 */
  const renderMobileTabContent = () => {
    if (activeTab === "pay") return renderPaySection(false);
    if (activeTab === "ad") return renderAdSection(false);
    return <MobileHistoryList>{renderHistoryItems()}</MobileHistoryList>;
  };

  return (
    <CoinsRoot>
      {/* 모바일 전용: 뒤로가기 */}
      <MobileTopBar>
        <BackButton
          type="button"
          aria-label="뒤로가기"
          onClick={() => router.push("/mypage")}
        >
          <ChevronLeft size={18} />
        </BackButton>
      </MobileTopBar>
      <MypageMobileFixedTopBarSpacer aria-hidden />

      {/* 모바일 전용: 제목 + 부제 */}
      <MobileHeaderBlock>
        <MobileTitleText>
          <CircleDollarSign size={18} />
          엽전 충전소
        </MobileTitleText>
        <MobileCoinsSubtitle>
          <CoinsPageSubtitle />
        </MobileCoinsSubtitle>
      </MobileHeaderBlock>

      {/* 모바일 전용: 잔액 + 탭 + 패널 */}
      <MobileCoinsSection>
        {renderBalanceCard()}

        <MobileTabBar role="tablist" aria-label="엽전 충전 탭">
          {COINS_MOBILE_TABS.map((tab) => (
            <MobileTabChip
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </MobileTabChip>
          ))}
        </MobileTabBar>

        <MobileTabPanel role="tabpanel">{renderMobileTabContent()}</MobileTabPanel>
      </MobileCoinsSection>

      {/* 데스크톱 헤더 */}
      <CoinsHeader>
        <TitleGroup>
          <CoinsTitle>
            <CircleDollarSign size={20} />
            엽전 충전소
          </CoinsTitle>
          <CoinsSubtitle>
            <CoinsPageSubtitle />
          </CoinsSubtitle>
        </TitleGroup>

        {/* 데모 잠금/해제 토글 */}
        <DemoToggleBtn
          type="button"
          $locked={isLocked}
          onClick={() => setIsLocked((v) => !v)}
        >
          {isLocked ? (
            <>
              <Lock size={11} />
              데모 잠금 상태 (클릭시 해제)
            </>
          ) : (
            <>
              <Unlock size={11} />
              데모 해제 상태 (클릭시 잠금)
            </>
          )}
        </DemoToggleBtn>
      </CoinsHeader>

      {/* 데스크톱 2:1 그리드 — 고정 높이 40rem, 이용 내역은 내부 스크롤 */}
      <CoinsBody>
        <CoinsGrid>
          <CoinsLeft>
            {renderBalanceCard()}
            {renderPaySection(true)}
            {renderAdSection(true)}
          </CoinsLeft>

          <HistoryPanel>
            <HistoryPanelTitle>
              <History size={13} color="#3949ab" />
              최근 이용 내역
            </HistoryPanelTitle>
            <HistoryList>{renderHistoryItems()}</HistoryList>
          </HistoryPanel>
        </CoinsGrid>
      </CoinsBody>
    </CoinsRoot>
  );
}
