import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  DESKTOP_MIN_WIDTH,
  LAYOUT_CONTENT_MAX_WIDTH,
  LAYOUT_PAGE_HORIZONTAL_PADDING,
  MYPAGE_BELOW_HEADER_OFFSET,
} from "@/lib/layout";

/** 마이페이지 몰입형 서브페이지 모바일 풀크림 셸 배경 */
export const MYPAGE_IMMERSIVE_MOBILE_SURFACE = "#fdfcf8";

/** @deprecated MYPAGE_IMMERSIVE_MOBILE_SURFACE 사용 */
export const MYPAGE_HISTORY_MOBILE_SURFACE = MYPAGE_IMMERSIVE_MOBILE_SURFACE;

/**
 * 마이페이지 루트 — SpaceBackground가 뷰포트 전체 fixed
 */
export const MypageChrome = styled.div<{ $isImmersiveMobileShell?: boolean }>`
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  z-index: 1;

  ${({ $isImmersiveMobileShell }) =>
    $isImmersiveMobileShell &&
    css`
      @media (max-width: 640px) {
        background: ${MYPAGE_IMMERSIVE_MOBILE_SURFACE};
      }
    `}
`;

/** 몰입형 마이페이지 모바일에서 SpaceBackground 숨김 */
export const SpaceBackgroundSlot = styled.div<{ $hideOnImmersiveMobile?: boolean }>`
  ${({ $hideOnImmersiveMobile }) =>
    $hideOnImmersiveMobile &&
    css`
      @media (max-width: 640px) {
        display: none;
      }
    `}
`;

/**
 * SpaceBackground(z-0) 위 콘텐츠 스택
 * 헤더 하단과 본문 사이 1.5rem 간격
 */
/**
 * 모바일에서는 글로벌 헤더가 마이페이지 전체에 걸쳐 숨겨지므로
 * safe-area-inset + 최소 여백만 적용
 */
export const MypageStack = styled.div<{
  $isMobileHub?: boolean;
  $isImmersiveMobileShell?: boolean;
}>`
  position: relative;
  z-index: 1;
  padding-top: ${MYPAGE_BELOW_HEADER_OFFSET};
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    padding-top: calc(1rem + env(safe-area-inset-top, 0px));
  }

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding-top: 1.5rem;
  }

  ${({ $isImmersiveMobileShell }) =>
    $isImmersiveMobileShell &&
    css`
      @media (max-width: 640px) {
        padding-top: 0;
        background: ${MYPAGE_IMMERSIVE_MOBILE_SURFACE};
      }
    `}
`;

/** 최대 너비 박스 — 사이드바 + 콘텐츠 나란히 */
export const MypageInner = styled.div<{ $isImmersiveMobileShell?: boolean }>`
  width: 100%;
  max-width: ${LAYOUT_CONTENT_MAX_WIDTH};
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0 0 2rem;
  display: flex;
  gap: 1.5rem;
  flex: 1;
  align-items: flex-start;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    max-width: none;
  }

  @media (max-width: 640px) {
    padding: 0 ${LAYOUT_PAGE_HORIZONTAL_PADDING} 5rem;
  }

  ${({ $isImmersiveMobileShell }) =>
    $isImmersiveMobileShell &&
    css`
      @media (max-width: 640px) {
        flex: none;
        width: 100%;
        padding: 0;
        background: ${MYPAGE_IMMERSIVE_MOBILE_SURFACE};
        align-items: stretch;
      }
    `}
`;

/** 오른쪽 메인 콘텐츠 영역 */
export const MypageMain = styled.main<{ $isImmersiveMobileShell?: boolean }>`
  flex: 1;
  min-width: 0;
  margin: 0;

  ${({ $isImmersiveMobileShell }) =>
    $isImmersiveMobileShell &&
    css`
      @media (max-width: 640px) {
        flex: none;
        width: 100%;
        background: ${MYPAGE_IMMERSIVE_MOBILE_SURFACE};
      }
    `}
`;
