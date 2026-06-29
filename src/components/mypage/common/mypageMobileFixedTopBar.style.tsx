import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  HEADER_BAR_HEIGHT_MOBILE,
  HEADER_BAR_PADDING_X_MOBILE,
  HEADER_BAR_PADDING_Y_MOBILE,
} from "@/components/layout/Header.style";
import { MYPAGE_IMMERSIVE_MOBILE_SURFACE } from "@/components/mypage/layout/MypageLayoutShell.style";
import { MYPAGE_SECTION_UNDERBAR_COLOR } from "./mypageMobileSectionUnderbar";

const MOBILE = "@media (max-width: 640px)";

/**
 * 몰입형 마이페이지 모바일 — fixed TopBar
 * (조상 overflow-x: hidden 환경에서 sticky가 깨져 fixed 사용)
 * 세로 치수는 메인 Header 모바일(3.5rem)과 동일
 */
export const mypageMobileFixedTopBarStyle = css`
  ${MOBILE} {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 30;
    background: ${MYPAGE_IMMERSIVE_MOBILE_SURFACE};
    padding: calc(${HEADER_BAR_PADDING_Y_MOBILE} + env(safe-area-inset-top, 0px))
      ${HEADER_BAR_PADDING_X_MOBILE} ${HEADER_BAR_PADDING_Y_MOBILE};
    border-bottom: 1px solid ${MYPAGE_SECTION_UNDERBAR_COLOR};
    box-sizing: border-box;
  }
`;

/** fixed TopBar가 차지하는 문서 흐름 높이 — 바로 아래에 배치 */
export const MypageMobileFixedTopBarSpacer = styled.div`
  display: none;

  ${MOBILE} {
    display: block;
    flex-shrink: 0;
    width: 100%;
    box-sizing: border-box;
    height: calc(
      env(safe-area-inset-top, 0px) + ${HEADER_BAR_HEIGHT_MOBILE} + 1px
    );
  }
`;
