import styled from "@emotion/styled";
import Link from "next/link";
import { css } from "@emotion/react";
import { DESKTOP_MIN_WIDTH, LAYOUT_CONTENT_MAX_WIDTH } from "@/lib/layout";

/** 모바일 헤더 바 높이 — padding 0.75rem×2 + 콘텐츠 2rem */
export const HEADER_BAR_HEIGHT_MOBILE = "3.5rem";
/** 데스크톱 헤더 바 높이 — padding 1rem×2 + 콘텐츠 2rem */
export const HEADER_BAR_HEIGHT_DESKTOP = "4rem";
/** 모바일 헤더 세로·가로 패딩 — TopBar 등과 공유 */
export const HEADER_BAR_PADDING_Y_MOBILE = "0.75rem";
export const HEADER_BAR_PADDING_X_MOBILE = "1rem";
/** 모바일 헤더 본문 행 높이 (아이콘·로고 영역) */
export const HEADER_CONTENT_HEIGHT_MOBILE = "2rem";

const smartHideHeaderStyles = ($smartHidden?: boolean) => css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  max-width: none;
  margin: 0;
  border-radius: 0;
  box-shadow: none;
  transform: translateY(${$smartHidden ? "-100%" : "0"});
`;

/** $fixed: false 일 때 문서 흐름 — 타로 결과 등에서 스크롤과 함께 이동 */
export const HeaderContainer = styled.header<{
  $fixed?: boolean;
  $smartHide?: boolean;
  $smartHidden?: boolean;
}>`
  width: calc(100% - 4rem);
  padding: 1rem 2rem;
  background-color: #f5f5f5;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: ${LAYOUT_CONTENT_MAX_WIDTH};
  box-sizing: border-box;
  transition: none;

  ${({ $smartHide, $fixed }) =>
    $smartHide
      ? `
    position: relative;
    z-index: 10;
    margin: 2rem auto 0;
    left: auto;
    transform: none;
  `
      : $fixed !== false
        ? `
    position: fixed;
    top: 2rem;
    z-index: 100;
    left: 50%;
    transform: translateX(-50%);
  `
        : `
    position: relative;
    z-index: 10;
    margin: 2rem auto 0;
    left: auto;
    transform: none;
  `}

  /* ≥641px 고정 셸: sticky + 1240 폭 — 가로 스크롤 시 헤더가 콘텐츠와 함께 이동 */
  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    width: 100%;
    max-width: none;
    margin: 2rem 0 0;

    ${({ $smartHide, $fixed }) =>
      $smartHide
        ? `
      width: calc(100% - 4rem);
      max-width: ${LAYOUT_CONTENT_MAX_WIDTH};
      margin: 2rem auto 0;
      position: relative;
      transform: none;
    `
        : $fixed !== false
          ? `
      position: sticky;
      top: 2rem;
      left: auto;
      transform: none;
    `
          : `
      width: calc(100% - 4rem);
      max-width: ${LAYOUT_CONTENT_MAX_WIDTH};
      margin: 2rem auto 0;
    `}
  }

  /* 모바일: 상·좌·우 여백 없이 풀폭 흰 바 */
  @media (max-width: 640px) {
    width: 100%;
    max-width: none;
    padding: ${HEADER_BAR_PADDING_Y_MOBILE} ${HEADER_BAR_PADDING_X_MOBILE};
    border-radius: 0;
    margin: 0;
    box-shadow: none;

    ${({ $smartHide, $smartHidden, $fixed }) =>
      $smartHide
        ? css`
            ${smartHideHeaderStyles($smartHidden)}
            padding: ${HEADER_BAR_PADDING_Y_MOBILE} ${HEADER_BAR_PADDING_X_MOBILE};
            transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1);
          `
        : $fixed !== false
          ? `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      transform: none;
    `
          : `
      margin-top: 0;
    `}
  }
`;

export const HeaderContent = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: flex-start;
`;

/** 로고 영역 왼쪽 아이콘(SVG 원본 비율 유지) */
export const LogoMark = styled.img`
  display: block;
  height: 2rem;
  width: auto;
  flex-shrink: 0;

  @media (max-width: 640px) {
    height: 1.75rem;
  }
`;

/** 로고 타입워드 PNG — 카드 마크와 높이 맞춤 */
export const LogoWordmark = styled.img`
  display: block;
  height: 2rem;
  width: auto;
  flex-shrink: 0;

  @media (max-width: 640px) {
    height: 1.75rem;
  }
`;

export const Logo = styled.h1`
  margin: 0;
  flex-shrink: 0;

  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: inherit;
    text-decoration: none;

    @media (max-width: 640px) {
      gap: 0.375rem;
    }
  }
`;

export const StartButton = styled.button`
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #212121;
  background: linear-gradient(135deg, #f9a825 0%, #fbc02d 100%);
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 300ms ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(249, 168, 37, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
  justify-content: flex-end;

  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`;

/** 헤더 우측 칩 — LanguageSwitcher 트리거와 동일 톤(표시 전용) */
export const HeaderCoinChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  height: 2rem;
  padding: 0 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.625rem;
  background: #ffffff;
  color: #212121;
  font-size: 0.6875rem;
  font-weight: 600;
  font-family: inherit;
  flex-shrink: 0;
  box-sizing: border-box;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: #f5f5f5;
  border: none;
  color: #212121;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 150ms ease-in-out;

  &:hover {
    background-color: #e8eaf6;
    color: #1a237e;
  }

  &:active {
    background-color: #c5cae9;
  }
`;

/** 결과 페이지 헤더 — 메인으로 이동하는 홈 아이콘 (엽전·언어 칩과 동일 2rem) */
export const HeaderHomeLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  box-sizing: border-box;
  flex-shrink: 0;
  background-color: #f5f5f5;
  border: none;
  color: #212121;
  cursor: pointer;
  border-radius: 0.5rem;
  text-decoration: none;
  transition:
    background-color 150ms ease-in-out,
    color 150ms ease-in-out;

  &:hover {
    background-color: #e8eaf6;
    color: #1a237e;
  }

  &:active {
    background-color: #c5cae9;
  }
`;

export const NavLink = styled.li`
  list-style: none;
  margin: 0;
  padding: 0;

  a,
  button {
    color: #212121;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    transition: color 150ms ease-in-out;

    &:hover {
      color: #1a237e;
    }
  }
`;

/** NavLink와 동일한 텍스트 스타일의 버튼(로그아웃 등) */
export const NavTextButton = styled.button`
  margin: 0;
  padding: 0;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  color: #212121;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: color 150ms ease-in-out;

  &:hover {
    color: #1a237e;
  }
`;

/** ≥641px 데스크톱 전용 영역 */
export const DesktopOnly = styled.div`
  display: contents;

  @media (max-width: 640px) {
    display: none;
  }
`;

/** ≤640px 모바일 전용 영역 */
export const MobileOnly = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: contents;
  }
`;
