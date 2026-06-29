import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { mypageMobileSectionUnderbarStyle } from "@/components/mypage/common/mypageMobileSectionUnderbar";
import { mypageMobileFixedTopBarStyle } from "@/components/mypage/common/mypageMobileFixedTopBar.style";

const MOBILE = "@media (max-width: 640px)";

const orbitRotate = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const orbitReverse = keyframes`
  from { transform: rotate(360deg); }
  to   { transform: rotate(0deg); }
`;

const nebulaPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.04); }
`;

/* ────────────────────────────── 루트 (히스토리와 동일한 흰 셸) ────────────────────────────── */
export const ProfileRoot = styled.div`
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

/* ─────────────────── 상단 배너 (Orb + 코드) ─────────────────── */
export const BannerCard = styled.div`
  position: relative;
  background: linear-gradient(135deg, #111325 0%, #14172f 55%, #0c0d1e 100%);
  border: 1px solid #1d2040;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow: hidden;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  /* 배경 아우라 블러 장식 */
  &::before {
    content: "";
    position: absolute;
    top: -3rem;
    left: -3rem;
    width: 12rem;
    height: 12rem;
    border-radius: 50%;
    background: radial-gradient(circle, #3949ab22 0%, #d4af3708 80%);
    filter: blur(2.5rem);
    pointer-events: none;
  }
`;

export const BannerLeft = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  min-width: 0;
  flex: 1;
`;

export const BannerNameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
  flex: 1;
`;

/** Orb 컨테이너 */
export const OrbWrap = styled.div`
  position: relative;
  width: 4rem;
  height: 4rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${nebulaPulse} 4s ease-in-out infinite;
`;

export const OrbRingOuter = styled.span`
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px dashed #d4af3730;
  animation: ${orbitRotate} 12s linear infinite;
`;

export const OrbRingInner = styled.span`
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  border: 1px solid #3949ab4d;
  animation: ${orbitReverse} 8s linear infinite;
`;

export const OrbBody = styled.span`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #3949ab, #e91e6380, #d4af37);
  padding: 2px;

  > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #121424, #14172f, #0c0e20);
    position: relative;
    overflow: hidden;
  }

  .orb-glow {
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: radial-gradient(
      circle at 35% 35%,
      #3949ab4d,
      #d4af3730,
      transparent
    );
    filter: blur(2px);
  }

  .orb-dot {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 0 8px #ffffffcc;
    position: relative;
    z-index: 1;
    animation: ${nebulaPulse} 2s ease-in-out infinite;
  }
`;

export const BannerNickname = styled.h3`
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #ffffff;
  margin: 0;
  line-height: 1;
`;

export const BannerEmail = styled.p`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #64688a;
  margin: 0;
  min-width: 0;
`;

/** 메일 아이콘 — 텍스트 첫 줄과 수직 정렬 */
export const BannerEmailIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 0;
`;

export const BannerEmailText = styled.span`
  flex: 1;
  min-width: 0;
  line-height: 1.4;
  overflow-wrap: break-word;
`;

/** 마고 코드 블록 */
export const MagoCodeBlock = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
    min-width: 20rem;
  }
`;

export const MagoCodeLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64688a;
`;

export const MagoCodeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  background: #14172f;
  border: 1px solid #1d2040;
  border-radius: 0.5rem;
  padding: 0.5rem 0.625rem;
`;

export const MagoCodeText = styled.span`
  flex: 1;
  min-width: 0;
  font-family: "Courier New", monospace;
  font-size: 0.6875rem;
  color: #8b8fa8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CopyButton = styled.button<{ $copied?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  border: 1px solid;
  flex-shrink: 0;
  margin-left: 0.5rem;
  cursor: pointer;
  transition:
    background 150ms,
    color 150ms,
    border-color 150ms;

  background: ${({ $copied }) => ($copied ? "#064e3b" : "#1b1f3e")};
  border-color: ${({ $copied }) => ($copied ? "#10b981" : "#2e3465")};
  color: ${({ $copied }) => ($copied ? "#34d399" : "#d1d5db")};

  &:hover {
    background: ${({ $copied }) => ($copied ? "#064e3b" : "#23284f")};
    color: ${({ $copied }) => ($copied ? "#34d399" : "#ffffff")};
  }
`;

/* ────────────── 헤더 (히스토리와 동일 패턴) ────────────── */
export const ProfileHeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
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

/** 뒤로가기 버튼 */
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

/** 모바일 — Orb 배너 하단 언더바 */
export const MobileBannerSection = styled.div`
  ${MOBILE} {
    width: 100%;
    ${mypageMobileSectionUnderbarStyle}
  }
`;

/** 모바일 제목 행 — 제목 + Last Sync */
export const MobileTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const MobileTitleText = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
`;

export const MobileProfileSubtitle = styled.p`
  font-size: 0.75rem;
  color: #9e9e9e;
  margin: 0;
  line-height: 1.5;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ProfileTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
`;

export const ProfileSubtitle = styled.p`
  font-size: 0.75rem;
  color: #9e9e9e;
  margin: 0;
`;

export const LastSyncBadge = styled.span`
  font-size: 0.625rem;
  font-family: "Courier New", monospace;
  letter-spacing: 0.02em;
  color: #9e9e9e;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  flex-shrink: 0;
`;

/** 운세 맞춤 + 일반 계정 설정 통합 패널 */
export const SettingsPanel = styled.div`
  background: #111325;
  border: 1px solid #1d2040;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

/** 좌·우 컬럼 + 세로 구분선 */
export const SettingsColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: stretch;

  @media (min-width: 720px) {
    grid-template-columns: 1fr auto 1fr;
    gap: 0;
  }
`;

export const SettingsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (min-width: 720px) {
    padding: 0 1.5rem;

    &:first-of-type {
      padding-left: 0;
    }

    &:last-of-type {
      padding-right: 0;
    }
  }

  @media (max-width: 719px) {
    &:not(:first-of-type) {
      padding-top: 1.5rem;
      border-top: 1px solid #1d2040;
    }
  }
`;

/** 데스크톱에서만 보이는 세로 구분선 */
export const PanelDivider = styled.div`
  display: none;

  @media (min-width: 720px) {
    display: block;
    width: 1px;
    background: #1d2040;
    align-self: stretch;
  }
`;

export const PanelTitle = styled.h4<{ $accent?: string }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ $accent }) => $accent ?? "#d4af37"};
  margin: 0 0 0.25rem;
`;

/* ─────────────────── 폼 필드 ─────────────────── */
export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const FieldLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FieldLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ea3c0;
`;

export const FieldHint = styled.span`
  font-size: 0.75rem;
  color: #64688a;
`;

export const FieldHintRed = styled.span`
  font-size: 0.5625rem;
  font-weight: 700;
  color: #ef4444;
  background: #1a0a0a;
  border: 1px solid #ef444430;
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
`;

/** 공통 텍스트 인풋 (다크 톤) */
export const DarkInput = styled.input<{ $readOnly?: boolean }>`
  width: 100%;
  background: #14172f;
  border: 1px solid ${({ $readOnly }) => ($readOnly ? "#14172f" : "#1d2040")};
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.8125rem;
  color: ${({ $readOnly }) => ($readOnly ? "#4a4e6a" : "#e2e4f0")};
  cursor: ${({ $readOnly }) => ($readOnly ? "not-allowed" : "text")};
  outline: none;
  box-sizing: border-box;
  transition: border-color 150ms;
  opacity: ${({ $readOnly }) => ($readOnly ? 0.6 : 1)};

  &::placeholder {
    color: #3a3d58;
  }

  &:focus {
    border-color: ${({ $readOnly }) => ($readOnly ? "#14172f" : "#3949ab")};
    box-shadow: ${({ $readOnly }) =>
      $readOnly ? "none" : "0 0 0 2px #3949ab22"};
  }
`;

/** 비밀번호 입력 래퍼 */
export const PasswordFieldWrap = styled.div`
  position: relative;
`;

export const EyeBtn = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #64688a;
  display: flex;
  align-items: center;
  padding: 0;

  &:hover {
    color: #9ea3c0;
  }
`;

/* 성별 선택 */
export const GenderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.375rem;
  background: #14172f;
  padding: 0.25rem;
  border-radius: 0.5rem;
  border: 1px solid #1d2040;
`;

export const GenderBtn = styled.button<{ $active?: boolean }>`
  padding: 0.625rem 0;
  font-size: 0.75rem;
  font-weight: 700;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition:
    background 150ms,
    color 150ms;

  background: ${({ $active }) => ($active ? "#1a237e" : "transparent")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#64688a")};

  &:hover {
    color: ${({ $active }) => ($active ? "#ffffff" : "#c5c8e0")};
  }
`;

/* 체크박스 + 레이블 인라인 */
export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #64688a;
  cursor: pointer;
  user-select: none;

  input[type="checkbox"] {
    width: 0.875rem;
    height: 0.875rem;
    accent-color: #3949ab;
    cursor: pointer;
  }
`;

/* ─────────────────── 하단 버튼 영역 ─────────────────── */
export const FormFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.625rem;
  padding-top: 1.25rem;
  border-top: 1px solid #1d2040;
  margin-top: auto;
`;

export const ResetBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5625rem 1rem;
  background: #14172f;
  border: 1px solid #1d2040;
  border-radius: 0.5rem;
  color: #9ea3c0;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 150ms,
    color 150ms,
    border-color 150ms;

  &:hover {
    background: #1a1e3d;
    border-color: #2e3465;
    color: #e2e4f0;
  }
`;

export const SaveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5625rem 1.25rem;
  background: #1a237e;
  border: none;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 150ms,
    opacity 150ms;
  box-shadow: 0 4px 12px #1a237e40;

  &:hover:not(:disabled) {
    background: #283593;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
