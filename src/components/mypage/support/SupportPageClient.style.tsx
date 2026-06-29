import styled from "@emotion/styled";
import { mypageMobileSectionUnderbarStyle } from "@/components/mypage/common/mypageMobileSectionUnderbar";
import { mypageMobileFixedTopBarStyle } from "@/components/mypage/common/mypageMobileFixedTopBar.style";

const MOBILE = "@media (max-width: 640px)";

/* ────────────────────────────────────────────
   외부 흰 셸
──────────────────────────────────────────── */
export const SupportRoot = styled.div`
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

export const SupportHeader = styled.div`
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

export const MobileSupportSubtitle = styled.p`
  font-size: 0.75rem;
  color: #9e9e9e;
  margin: 0;
  line-height: 1.5;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

/** 모바일 본문 — 탭 + 패널 */
export const MobileSupportSection = styled.div`
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

export const SupportTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
`;

export const SupportSubtitle = styled.p`
  font-size: 0.75rem;
  color: #9e9e9e;
  margin: 0;
`;

/* ────────────────────────────────────────────
   다크 인셋 본문
──────────────────────────────────────────── */
export const SupportBody = styled.div`
  background: #0d0f1f;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  ${MOBILE} {
    display: none;
  }
`;

export const SupportGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 2rem;
  align-items: start;
`;

/* ────────────────────────────────────────────
   공통 레이블
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

/* ────────────────────────────────────────────
   왼쪽: 준수 가이드라인
──────────────────────────────────────────── */
export const GuideCard = styled.div`
  background: #161932;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const GuideBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const GuideDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #1d2040;
`;

export const GuideBlockTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

export const GuideBlockDesc = styled.p`
  font-size: 0.6875rem;
  color: #9ea3c0;
  line-height: 1.6;
  margin: 0;
  font-weight: 300;
`;

export const NoticeBox = styled.div`
  background: #16193266;
  border: 1px solid #1d204050;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.75rem;
`;

export const NoticeTitle = styled.span`
  font-size: 0.5625rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #d4af37;
`;

export const NoticeDesc = styled.p`
  font-size: 0.625rem;
  color: #64688a;
  line-height: 1.5;
  margin: 0;
  font-weight: 300;
`;

/* ────────────────────────────────────────────
   오른쪽: 문서 카드 목록
──────────────────────────────────────────── */
export const DocList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const DocLink = styled.a<{ $hoverColor: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.125rem;
  border-radius: 0.75rem;
  border: 1px solid #1d2040;
  background: #16193266;
  cursor: pointer;
  text-decoration: none;
  transition: background 150ms, border-color 150ms;

  &:hover {
    background: #1b1e3e;
    border-color: ${({ $hoverColor }) => `${$hoverColor}40`};
  }

  &:hover h4 {
    color: ${({ $hoverColor }) => $hoverColor};
  }

  &:hover > span:last-child {
    color: #ffffff;
    transform: translate(2px, -2px);
  }
`;

export const DocLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
`;

export const DocIconBox = styled.div<{ $bg?: string; $border?: string }>`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: ${({ $bg }) => $bg ?? "#272a5a"};
  border: 1px solid ${({ $border }) => $border ?? "#272a5a"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const DocInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

export const DocTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  transition: color 150ms;
`;

export const DocDesc = styled.p`
  font-size: 0.625rem;
  color: #64688a;
  margin: 0;
  line-height: 1.5;
`;

export const DocChevron = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: #4a4e6a;
  transition: color 150ms, transform 150ms;
`;

/* ────────────────────────────────────────────
   Danger Zone
──────────────────────────────────────────── */
export const DangerSection = styled.div`
  border-top: 1px solid #1d2040;
  padding-top: 1.5rem;
`;

export const DangerLabel = styled.span`
  display: block;
  font-size: 0.625rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #f87171;
  margin-bottom: 0.75rem;
`;

export const DangerCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #7f1d1d40;
  background: #7f1d1d12;

  ${MOBILE} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const DangerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
`;

export const DangerIconBox = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  background: #7f1d1d30;
  border: 1px solid #7f1d1d40;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const DangerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const DangerTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

export const DangerDesc = styled.p`
  font-size: 0.625rem;
  color: #9ea3c0;
  margin: 0;
  line-height: 1.5;
  font-weight: 300;
`;

export const WithdrawBtn = styled.button`
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  background: #7f1d1d40;
  border: 1px solid #7f1d1d60;
  border-radius: 0.5rem;
  color: #fca5a5;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 150ms, color 150ms;
  white-space: nowrap;

  ${MOBILE} {
    width: 100%;
    padding: 0.625rem 1rem;
  }

  &:hover {
    background: #7f1d1d60;
    color: #ffffff;
  }
`;

/* ────────────────────────────────────────────
   회원 탈퇴 확인 모달 (rose 전용)
──────────────────────────────────────────── */
export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: #00000075;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  /* 헤더(z-index: 100) 위에 표시 — MypageStack(z-index: 1) 밖 body Portal과 함께 사용 */
  z-index: 300;
`;

export const ModalPanel = styled.div`
  width: 100%;
  max-width: 27.5rem;
  background: #1a1c35;
  border: 1px solid #7f1d1d50;
  border-radius: 1.25rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 8px 32px #00000060;
`;

export const ModalTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const ModalTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

export const ModalWarningBox = styled.div`
  background: #0d0f1f80;
  border: 1px solid #1d2040;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ModalWarningLabel = styled.span`
  font-size: 0.5625rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #f87171;
`;

export const ModalWarningList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ModalWarningItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  font-size: 0.6875rem;
  color: #9ea3c0;
  line-height: 1.55;
  font-weight: 300;
`;

export const ModalWarningBullet = styled.span`
  color: #f87171;
  flex-shrink: 0;
  line-height: 1.55;
`;

export const ModalBtnRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ModalCancelBtn = styled.button`
  flex: 1;
  padding: 0.625rem;
  background: #212344;
  border: 1px solid #2e3465;
  border-radius: 0.5rem;
  color: #9ea3c0;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 150ms;

  &:hover {
    background: #2c2f5e;
    color: #ffffff;
  }
`;

export const ModalConfirmBtn = styled.button`
  flex: 1;
  padding: 0.625rem;
  background: #dc2626;
  border: none;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 150ms;
  box-shadow: 0 2px 8px #dc262640;

  &:hover {
    background: #ef4444;
  }
`;
