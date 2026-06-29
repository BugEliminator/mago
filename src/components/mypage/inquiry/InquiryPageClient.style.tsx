import styled from "@emotion/styled";
import { mypageMobileSectionUnderbarStyle } from "@/components/mypage/common/mypageMobileSectionUnderbar";
import { mypageMobileFixedTopBarStyle } from "@/components/mypage/common/mypageMobileFixedTopBar.style";

const MOBILE = "@media (max-width: 640px)";

/* ────────────────────────────────────────────
   외부 흰 셸
──────────────────────────────────────────── */
export const InquiryRoot = styled.div`
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

export const InquiryHeader = styled.div`
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

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

export const MobileInquirySubtitle = styled.p`
  font-size: 0.75rem;
  color: #9e9e9e;
  margin: 0;
  line-height: 1.5;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

/** 모바일 본문 — 탭 + 패널 */
export const MobileInquirySection = styled.div`
  display: none;

  ${MOBILE} {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
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

/** 모바일 탭 패널 */
export const MobileTabPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #0d0f1f;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  padding: 1rem;
`;

export const InquiryTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
`;

export const InquirySubtitle = styled.p`
  font-size: 0.75rem;
  color: #9e9e9e;
  margin: 0;
`;

/* ────────────────────────────────────────────
   다크 인셋 본문
──────────────────────────────────────────── */
export const InquiryBody = styled.div`
  background: #0d0f1f;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  padding: 2rem;

  ${MOBILE} {
    display: none;
  }
`;

export const InquiryGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 2rem;
  align-items: start;
`;

/* ────────────────────────────────────────────
   왼쪽: 고객 지원 안내
──────────────────────────────────────────── */
export const SectionLabel = styled.span`
  display: block;
  font-size: 0.625rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64688a;
  margin-bottom: 0.75rem;
`;

export const InfoCard = styled.div`
  background: #161932;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const InfoDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #1d2040;
`;

export const InfoBlockTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

export const InfoBlockDesc = styled.p`
  font-size: 0.75rem;
  color: #9ea3c0;
  line-height: 1.6;
  margin: 0;
  font-weight: 300;
`;

export const QuickGuideBox = styled.div`
  background: #161932;
  border: 1px solid #1d204066;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.75rem;
`;

export const QuickGuideTitle = styled.span`
  font-size: 0.5625rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #d4af37;
`;

export const QuickGuideDesc = styled.p`
  font-size: 0.625rem;
  color: #64688a;
  line-height: 1.5;
  margin: 0;
  font-weight: 300;
`;

/* ────────────────────────────────────────────
   오른쪽: 소통 채널
──────────────────────────────────────────── */
export const ChannelList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/** 카카오톡 채널 — 클릭 가능 */
export const KakaoCard = styled.div`
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #1d2040;
  background: #16193266;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
  transition:
    background 150ms,
    border-color 150ms;

  &:hover {
    background: #1b1e3e;
    border-color: #d4af3740;
  }

  &:hover h4 {
    color: #fee500;
  }

  &:hover > span {
    color: #ffffff;
    transform: translateX(3px);
  }
`;

export const ChannelLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  min-width: 0;
`;

export const ChannelIconBox = styled.div<{ $color?: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  background: ${({ $color }) => ($color ? `${$color}1a` : "#1a1e3d")};
  border: 1px solid ${({ $color }) => ($color ? `${$color}33` : "#2e3465")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ChannelInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

export const ChannelTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const ChannelTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  transition: color 150ms;
`;

export const ChannelBadge = styled.span`
  font-size: 0.625rem;
  font-weight: 900;
  color: #4ade80;
  background: #4ade8015;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
`;

export const ChannelDesc = styled.p`
  font-size: 0.75rem;
  color: #64688a;
  margin: 0;
  line-height: 1.5;
`;

export const ChannelChevron = styled.span`
  color: #4a4e6a;
  display: flex;
  align-items: center;
  align-self: center;
  flex-shrink: 0;
  transition:
    color 150ms,
    transform 150ms;
`;

/** 이메일 채널 */
export const EmailCard = styled.div`
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #1d2040;
  background: #16193266;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const EmailTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

export const EmailBadge = styled.span`
  font-size: 0.625rem;
  font-family: "Courier New", monospace;
  font-weight: 700;
  color: #3949ab;
  background: #3949ab18;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  word-break: break-all;
`;

export const EmailActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;

  @media (min-width: 480px) {
    flex-direction: row;
  }

  ${MOBILE} {
    flex-direction: column;
  }
`;

export const EmailSendBtn = styled.button`
  flex: 1;
  padding: 0.625rem 1rem;
  background: #3949ab;
  border: none;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  box-shadow: 0 2px 8px #3949ab40;
  transition: background 150ms;

  &:hover {
    background: #3d55cc;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const EmailCopyBtn = styled.button<{ $copied: boolean }>`
  flex-shrink: 0;
  min-width: 7.75rem;
  max-width: 7.75rem;
  padding: 0.625rem 1rem;
  background: #1b1f3e;
  border: 1px solid #2e3465;
  border-radius: 0.5rem;
  color: ${({ $copied }) => ($copied ? "#4ade80" : "#9ea3c0")};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition:
    background 150ms,
    color 150ms;

  ${MOBILE} {
    min-width: 0;
    max-width: none;
    width: 100%;
  }

  &:hover {
    background: #23284f;
    color: #ffffff;
  }
`;
