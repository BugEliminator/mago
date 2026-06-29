"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Headphones,
  Clock,
  ShieldCheck,
  MessageSquare,
  Mail,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { MypageMobileFixedTopBarSpacer } from "@/components/mypage/common/mypageMobileFixedTopBar.style";
import {
  InquiryRoot,
  InquiryHeader,
  InquiryTitle,
  InquirySubtitle,
  MobileTopBar,
  BackButton,
  MobileHeaderBlock,
  MobileTitleText,
  MobileInquirySubtitle,
  MobileInquirySection,
  MobileTabBar,
  MobileTabChip,
  MobileTabPanel,
  InquiryBody,
  InquiryGrid,
  SectionLabel,
  InfoCard,
  InfoBlock,
  InfoDivider,
  InfoBlockTitle,
  InfoBlockDesc,
  QuickGuideBox,
  QuickGuideTitle,
  QuickGuideDesc,
  ChannelList,
  KakaoCard,
  ChannelLeft,
  ChannelIconBox,
  ChannelInfo,
  ChannelTitleRow,
  ChannelTitle,
  ChannelBadge,
  ChannelDesc,
  ChannelChevron,
  EmailCard,
  EmailTop,
  EmailBadge,
  EmailActions,
  EmailSendBtn,
  EmailCopyBtn,
} from "./InquiryPageClient.style";

/** 공식 수신 이메일 */
const ADMIN_EMAIL = "incertum.studio@gmail.com";

/** 카카오톡 1:1 오픈채팅 URL */
const KAKAO_OPENCHAT_URL = "https://open.kakao.com/o/sxIy8Uyi";

type InquiryTab = "channels" | "guide";

const INQUIRY_MOBILE_TABS: { id: InquiryTab; label: string }[] = [
  { id: "channels", label: "소통 채널 선택" },
  { id: "guide", label: "고객 지원 안내" },
];

type InquiryPageClientProps = {
  /** Supabase Auth 로그인 계정 이메일 */
  userEmail: string;
};

export default function InquiryPageClient({
  userEmail,
}: InquiryPageClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<InquiryTab>("channels");
  const [copied, setCopied] = useState(false);
  const senderEmail = userEmail.trim();

  /** 기본 메일 앱으로 문의 이메일 초안 열기 */
  const handleSendEmail = () => {
    const subject = encodeURIComponent("[마고] 서비스 이용 문의");
    const body = encodeURIComponent(
      `안녕하세요, AI 타로 MAGO 고객지원팀입니다.\n` +
        `겪으신 불편을 신속하게 해결해 드리기 위해 아래 양식을 작성해 주세요. ✨\n\n` +
        `----------------------------------------\n` +
        `1. 문의 유형 (해당하는 곳에 [V] 표시를 남겨주세요)\n` +
        `   [  ] 타로 리딩 결과 오류 / 유실\n` +
        `   [  ] 복채(코인) 결제 및 충전 관련\n` +
        `   [  ] 계정 및 로그인\n` +
        `   [  ] 기타 서비스 이용 및 제안\n\n` +
        `2. 가입 계정 (이메일): ${senderEmail || "(여기에 가입하신 이메일을 적어주세요)"}\n\n` +
        `3. 상세 문의 내용:\n` +
        `   (오류가 발생한 상황이나 질문 내용을 자유롭게 적어주세요. 스크린샷이 있다면 첨부해 주시면 좋습니다.)\n` +
        `   \n\n\n` +
        `----------------------------------------\n` +
        `💡 원활한 확인을 위한 안내 (선택 입력)\n` +
        `• 이용하신 기기: (예: 아이폰 14, 갤럭시 S23, PC 데스크톱)\n` +
        `• 접속 환경: (예: Safari 앱, 크롬 브라우저, 카카오톡 인앱 브라우저)\n` +
        `----------------------------------------`,
    );
    window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
    toast.success("기본 메일 앱 연결을 시도합니다.");
  };

  /** 관리자 이메일 주소 클립보드 복사 */
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(ADMIN_EMAIL);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = ADMIN_EMAIL;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success("주소가 클립보드에 복사되었습니다.");
    setTimeout(() => setCopied(false), 2000);
  };

  /** 고객 지원 안내 패널 */
  const renderGuidePanel = () => (
    <>
      <InfoCard>
        <InfoBlock>
          <InfoBlockTitle>
            <Clock size={14} color="#d4af37" />
            답변 운영 시간
          </InfoBlockTitle>
          <InfoBlockDesc>
            평일 오전 10시 ~ 오후 6시 사이에 문의를 남겨주시면 마고 리딩
            마스터가 정성을 다해 신속하게 답변해 드립니다.
          </InfoBlockDesc>
        </InfoBlock>

        <InfoDivider />

        <InfoBlock>
          <InfoBlockTitle>
            <ShieldCheck size={14} color="#3949ab" />
            개인정보 안심 보장
          </InfoBlockTitle>
          <InfoBlockDesc>
            서비스 내 결제 정보, 타로 결과 내역 확인 등을 위해 필요한 고유 ID
            정보는 안전한 암호화 절차를 거쳐 보호됩니다.
          </InfoBlockDesc>
        </InfoBlock>
      </InfoCard>

      <QuickGuideBox>
        <QuickGuideTitle>✦ QUICK GUIDE</QuickGuideTitle>
        <QuickGuideDesc>
          자주 묻는 질문이나 환불 정책에 관한 더 자세한 수칙은 「고객지원 및
          약관」 메뉴에서도 확인하실 수 있습니다.
        </QuickGuideDesc>
      </QuickGuideBox>
    </>
  );

  /** 소통 채널 패널 */
  const renderChannelsPanel = () => (
    <ChannelList>
      <KakaoCard
        role="button"
        tabIndex={0}
        onClick={() => window.open(KAKAO_OPENCHAT_URL, "_blank")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            window.open(KAKAO_OPENCHAT_URL, "_blank");
        }}
      >
        <ChannelLeft>
          <ChannelIconBox $color="#fee500">
            <MessageSquare size={20} color="#fee500" />
          </ChannelIconBox>
          <ChannelInfo>
            <ChannelTitleRow>
              <ChannelTitle>카카오톡 1:1 오픈챗 문의</ChannelTitle>
              <ChannelBadge>가장 빠른 답변</ChannelBadge>
            </ChannelTitleRow>
            <ChannelDesc>
              카카오톡 대화방으로 연결되어 실시간으로 궁금한 부분이나 불편
              상황을 즉시 해결할 수 있습니다.
            </ChannelDesc>
          </ChannelInfo>
        </ChannelLeft>
        <ChannelChevron>
          <ChevronRight size={16} />
        </ChannelChevron>
      </KakaoCard>

      <EmailCard>
        <EmailTop>
          <ChannelIconBox>
            <Mail size={20} color="#3949ab" />
          </ChannelIconBox>
          <ChannelInfo>
            <ChannelTitleRow>
              <ChannelTitle style={{ color: "#ffffff" }}>
                이메일 문의
              </ChannelTitle>
              <EmailBadge>발신: {senderEmail || "이메일 없음"}</EmailBadge>
            </ChannelTitleRow>
            <ChannelDesc>
              버튼을 눌러 메일을 보내주세요.
              <br />
              연결이 안 될 경우 주소를 복사하여 직접 메일을 발송해 주세요.
            </ChannelDesc>
          </ChannelInfo>
        </EmailTop>

        <EmailActions>
          <EmailSendBtn type="button" onClick={handleSendEmail}>
            메일 보내기
            <ExternalLink size={14} />
          </EmailSendBtn>
          <EmailCopyBtn
            type="button"
            $copied={copied}
            onClick={handleCopyEmail}
          >
            {copied ? (
              <Check size={14} color="#4ade80" />
            ) : (
              <Copy size={14} />
            )}
            {copied ? "복사 완료" : "주소 복사하기"}
          </EmailCopyBtn>
        </EmailActions>
      </EmailCard>
    </ChannelList>
  );

  return (
    <InquiryRoot>
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
          <Headphones size={18} />
          문의하기
        </MobileTitleText>
        <MobileInquirySubtitle>
          이용 중 궁금한 점이 있으시거나 오류를 발견하셨다면 편하신 채널로
          말씀해 주세요.
        </MobileInquirySubtitle>
      </MobileHeaderBlock>

      {/* 모바일 전용: 탭 + 패널 */}
      <MobileInquirySection>
        <MobileTabBar role="tablist" aria-label="문의하기 탭">
          {INQUIRY_MOBILE_TABS.map((tab) => (
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
          {activeTab === "channels"
            ? renderChannelsPanel()
            : renderGuidePanel()}
        </MobileTabPanel>
      </MobileInquirySection>

      {/* 데스크톱 헤더 */}
      <InquiryHeader>
        <InquiryTitle>
          <Headphones size={20} />
          문의하기
        </InquiryTitle>
        <InquirySubtitle>
          이용 중 궁금한 점이 있으시거나 오류를 발견하셨다면 편하신 채널로
          말씀해 주세요.
        </InquirySubtitle>
      </InquiryHeader>

      {/* 데스크톱 본문 */}
      <InquiryBody>
        <InquiryGrid>
          <div>
            <SectionLabel>고객 지원 안내</SectionLabel>
            {renderGuidePanel()}
          </div>

          <div>
            <SectionLabel>소통 채널 선택</SectionLabel>
            {renderChannelsPanel()}
          </div>
        </InquiryGrid>
      </InquiryBody>
    </InquiryRoot>
  );
}
