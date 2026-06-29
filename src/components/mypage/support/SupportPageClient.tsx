"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearTarotReadingLocalDraft } from "@/lib/clearTarotReadingLocalDraft";
import { requestWithdrawFromClient } from "@/lib/requestWithdrawFromClient";
import { supabase } from "@/lib/supabaseClient";
import { MypageMobileFixedTopBarSpacer } from "@/components/mypage/common/mypageMobileFixedTopBar.style";
import {
  FileSpreadsheet,
  ShieldCheck,
  RefreshCw,
  FileText,
  HelpCircle,
  UserMinus,
  ExternalLink,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";
import {
  SupportRoot,
  SupportHeader,
  SupportTitle,
  SupportSubtitle,
  MobileTopBar,
  BackButton,
  MobileHeaderBlock,
  MobileTitleText,
  MobileSupportSubtitle,
  MobileSupportSection,
  MobileTabBar,
  MobileTabChip,
  MobileTabPanel,
  SupportBody,
  SupportGrid,
  SectionLabel,
  GuideCard,
  GuideBlock,
  GuideDivider,
  GuideBlockTitle,
  GuideBlockDesc,
  NoticeBox,
  NoticeTitle,
  NoticeDesc,
  DocList,
  DocLink,
  DocLeft,
  DocIconBox,
  DocInfo,
  DocTitle,
  DocDesc,
  DocChevron,
  DangerSection,
  DangerLabel,
  DangerCard,
  DangerLeft,
  DangerIconBox,
  DangerInfo,
  DangerTitle,
  DangerDesc,
  WithdrawBtn,
  ModalBackdrop,
  ModalPanel,
  ModalTitleRow,
  ModalTitle,
  ModalWarningBox,
  ModalWarningLabel,
  ModalWarningList,
  ModalWarningItem,
  ModalWarningBullet,
  ModalBtnRow,
  ModalCancelBtn,
  ModalConfirmBtn,
} from "./SupportPageClient.style";

/** 노션 문서 URL — 실제 운영 주소 */
const NOTION_LINKS = {
  terms:
    "https://mesquite-reason-06a.notion.site/MAGO-37b91f05fe0b80008fa2c52227851422",
  privacy:
    "https://mesquite-reason-06a.notion.site/MAGO-37b91f05fe0b8090a42ff7355138a571?pvs=73",
  refund:
    "https://mesquite-reason-06a.notion.site/MAGO-37b91f05fe0b80079db4da231c4b7739",
  faq: "https://mesquite-reason-06a.notion.site/MAGO-FAQ-37b91f05fe0b800988c4e3ccdc8b1b6f?pvs=73",
};

type SupportTab = "docs" | "guide" | "withdraw";

const SUPPORT_MOBILE_TABS: { id: SupportTab; label: string }[] = [
  { id: "docs", label: "조회할 문서 선택" },
  { id: "guide", label: "준수 가이드라인" },
  { id: "withdraw", label: "탈퇴하기" },
];

export default function SupportPageClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SupportTab>("docs");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /** 탈퇴 확인 — auth.users 삭제 후 로그아웃·홈 이동 */
  const handleConfirmWithdraw = async () => {
    if (isWithdrawing) return;

    setIsWithdrawing(true);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError != null || session?.access_token == null) {
      setIsWithdrawing(false);
      toast.error("로그인이 필요합니다.");
      return;
    }

    const result = await requestWithdrawFromClient(session.access_token);

    if (!result.ok) {
      setIsWithdrawing(false);
      toast.error(result.error);
      return;
    }

    clearTarotReadingLocalDraft(session.user.id);
    await supabase.auth.signOut();
    setShowWithdrawModal(false);
    setIsWithdrawing(false);
    toast.success("탈퇴 처리가 완료되었습니다. 이용해 주셔서 감사합니다.");
    setTimeout(() => router.push("/"), 1500);
  };

  /** 준수 가이드라인 패널 */
  const renderGuidePanel = () => (
    <>
      <GuideCard>
        <GuideBlock>
          <GuideBlockTitle>
            <ShieldCheck size={14} color="#4ade80" />
            개인정보 투명성 고지
          </GuideBlockTitle>
          <GuideBlockDesc>
            InCertum 스튜디오는 이용자의 가입 최소 정보 외 불필요한 데이터를
            무단 수집하거나 제3자에게 임의 제공하지 않습니다.
          </GuideBlockDesc>
        </GuideBlock>

        <GuideDivider />

        <GuideBlock>
          <GuideBlockTitle>
            <RefreshCw size={14} color="#d4af37" />
            공정한 재화 환불제도
          </GuideBlockTitle>
          <GuideBlockDesc>
            유료 충전하신 엽전은 콘텐츠를 조회하지 않은 시점에서 7일 이내
            청약 철회가 완벽하게 지원됩니다.
          </GuideBlockDesc>
        </GuideBlock>
      </GuideCard>

      <NoticeBox>
        <NoticeTitle>✦ NOTICE</NoticeTitle>
        <NoticeDesc>
          모든 약관 문서는 법률 개정에 따라 수정될 수 있으며, 개정 사항은 적용
          7일 전 회원가입 시 기재된 메일 또는 서비스 홈을 통해 공지됩니다.
        </NoticeDesc>
      </NoticeBox>
    </>
  );

  /** 문서 목록 패널 */
  const renderDocsPanel = () => (
    <DocList>
      <DocLink
        href={NOTION_LINKS.terms}
        target="_blank"
        rel="noopener noreferrer"
        $hoverColor="#818cf8"
      >
        <DocLeft>
          <DocIconBox $bg="#1a1e3d" $border="#3949ab40">
            <FileText size={16} color="#818cf8" />
          </DocIconBox>
          <DocInfo>
            <DocTitle>이용약관</DocTitle>
            <DocDesc>
              마고 서비스 이용과 관련한 이용 주체의 권리·의무를 명시합니다.
            </DocDesc>
          </DocInfo>
        </DocLeft>
        <DocChevron>
          <ExternalLink size={14} />
        </DocChevron>
      </DocLink>

      <DocLink
        href={NOTION_LINKS.privacy}
        target="_blank"
        rel="noopener noreferrer"
        $hoverColor="#4ade80"
      >
        <DocLeft>
          <DocIconBox $bg="#0f2a1e" $border="#1a4a30">
            <ShieldCheck size={16} color="#4ade80" />
          </DocIconBox>
          <DocInfo>
            <DocTitle>개인정보처리방침</DocTitle>
            <DocDesc>
              가입 정보 파기 방법과 Supabase 위탁 및 안전성 조치를 명기합니다.
            </DocDesc>
          </DocInfo>
        </DocLeft>
        <DocChevron>
          <ExternalLink size={14} />
        </DocChevron>
      </DocLink>

      <DocLink
        href={NOTION_LINKS.refund}
        target="_blank"
        rel="noopener noreferrer"
        $hoverColor="#d4af37"
      >
        <DocLeft>
          <DocIconBox $bg="#1f1a00" $border="#3d3300">
            <RefreshCw size={16} color="#d4af37" />
          </DocIconBox>
          <DocInfo>
            <DocTitle>환불 정책</DocTitle>
            <DocDesc>
              미사용 재화의 환불 조건 및 콘텐츠 시청 완료 시 청약철회 불가
              기준입니다.
            </DocDesc>
          </DocInfo>
        </DocLeft>
        <DocChevron>
          <ExternalLink size={14} />
        </DocChevron>
      </DocLink>

      <DocLink
        href={NOTION_LINKS.faq}
        target="_blank"
        rel="noopener noreferrer"
        $hoverColor="#38bdf8"
      >
        <DocLeft>
          <DocIconBox $bg="#0c1a2e" $border="#1a3a5c">
            <HelpCircle size={16} color="#38bdf8" />
          </DocIconBox>
          <DocInfo>
            <DocTitle>자주 묻는 질문 (FAQ)</DocTitle>
            <DocDesc>
              결제 오류 대처 요령 및 진정성 있는 타로 셔플 메커니즘을 상세히
              다룹니다.
            </DocDesc>
          </DocInfo>
        </DocLeft>
        <DocChevron>
          <ExternalLink size={14} />
        </DocChevron>
      </DocLink>
    </DocList>
  );

  /** 탈퇴 패널 */
  const renderWithdrawPanel = () => (
    <DangerCard>
      <DangerLeft>
        <DangerIconBox>
          <UserMinus size={20} color="#f87171" />
        </DangerIconBox>
        <DangerInfo>
          <DangerTitle>마고 서비스 탈퇴하기</DangerTitle>
          <DangerDesc>
            탈퇴 시 보유하신 엽전 및 소중한 운세 해설 기록이 즉시 삭제되어
            영구히 소멸됩니다.
          </DangerDesc>
        </DangerInfo>
      </DangerLeft>

      <WithdrawBtn type="button" onClick={() => setShowWithdrawModal(true)}>
        탈퇴 신청
      </WithdrawBtn>
    </DangerCard>
  );

  /** 모바일 탭 패널 콘텐츠 */
  const renderMobileTabContent = () => {
    if (activeTab === "docs") return renderDocsPanel();
    if (activeTab === "guide") return renderGuidePanel();
    return renderWithdrawPanel();
  };

  return (
    <>
      <SupportRoot>
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
            <FileSpreadsheet size={18} />
            고객지원 및 약관
          </MobileTitleText>
          <MobileSupportSubtitle>
            마고(MAGO)의 서비스 규정 및 유저 보호를 위한 지침들을 투명하게
            고지합니다.
          </MobileSupportSubtitle>
        </MobileHeaderBlock>

        {/* 모바일 전용: 탭 + 패널 */}
        <MobileSupportSection>
          <MobileTabBar role="tablist" aria-label="고객지원 탭">
            {SUPPORT_MOBILE_TABS.map((tab) => (
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

          <MobileTabPanel role="tabpanel">
            {renderMobileTabContent()}
          </MobileTabPanel>
        </MobileSupportSection>

        {/* 데스크톱 헤더 */}
        <SupportHeader>
          <SupportTitle>
            <FileSpreadsheet size={20} />
            고객지원 및 약관
          </SupportTitle>
          <SupportSubtitle>
            마고(MAGO)의 서비스 규정 및 유저 보호를 위한 지침들을 투명하게
            고지합니다.
          </SupportSubtitle>
        </SupportHeader>

        {/* 데스크톱 본문 */}
        <SupportBody>
          <SupportGrid>
            <div>
              <SectionLabel>준수 가이드라인</SectionLabel>
              {renderGuidePanel()}
            </div>

            <div>
              <SectionLabel>조회할 문서 선택</SectionLabel>
              {renderDocsPanel()}
            </div>
          </SupportGrid>

          <DangerSection>
            <DangerLabel>Danger Zone</DangerLabel>
            {renderWithdrawPanel()}
          </DangerSection>
        </SupportBody>
      </SupportRoot>

      {/* ── 회원 탈퇴 확인 모달 (body Portal — 헤더 위 블러 포함) ── */}
      {mounted &&
        showWithdrawModal &&
        createPortal(
          <ModalBackdrop onClick={() => setShowWithdrawModal(false)}>
            <ModalPanel onClick={(e) => e.stopPropagation()}>
              <ModalTitleRow>
                <AlertTriangle size={20} color="#f87171" />
                <ModalTitle>
                  정말로 마고(MAGO)를 탈퇴하시겠습니까?
                </ModalTitle>
              </ModalTitleRow>

              <ModalWarningBox>
                <ModalWarningLabel>탈퇴 시 유의사항</ModalWarningLabel>
                <ModalWarningList>
                  <ModalWarningItem>
                    <ModalWarningBullet>•</ModalWarningBullet>
                    <span>
                      <strong>보유 재화 소멸</strong>: 유저님이 보유 중인 모든
                      &apos;엽전&apos;(유료 및 무료 포함)은 탈퇴 즉시 자동
                      소멸되며 환불이 불가능합니다.
                    </span>
                  </ModalWarningItem>
                  <ModalWarningItem>
                    <ModalWarningBullet>•</ModalWarningBullet>
                    <span>
                      <strong>타로 히스토리 삭제</strong>: AI가 리딩해 드린
                      기존 타로 운세 결과 및 보관함 내역이 모두 영구 삭제되며
                      복구할 수 없습니다.
                    </span>
                  </ModalWarningItem>
                  <ModalWarningItem>
                    <ModalWarningBullet>•</ModalWarningBullet>
                    <span>
                      <strong>개인정보 파기 및 보존</strong>: 이메일 등의 계정
                      식별 정보는 즉시 파기됩니다. (단, 거래 내역 등의 대금
                      결제에 관한 로그는 관계법령에 의거 5년간 안전하게 분리
                      보관됩니다.)
                    </span>
                  </ModalWarningItem>
                </ModalWarningList>
              </ModalWarningBox>

              <ModalBtnRow>
                <ModalCancelBtn
                  type="button"
                  disabled={isWithdrawing}
                  onClick={() => setShowWithdrawModal(false)}
                >
                  취소
                </ModalCancelBtn>
                <ModalConfirmBtn
                  type="button"
                  disabled={isWithdrawing}
                  onClick={() => void handleConfirmWithdraw()}
                >
                  {isWithdrawing ? "처리 중..." : "확인, 탈퇴합니다"}
                </ModalConfirmBtn>
              </ModalBtnRow>
            </ModalPanel>
          </ModalBackdrop>,
          document.body,
        )}
    </>
  );
}
