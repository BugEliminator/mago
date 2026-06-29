import { css } from "@emotion/react";

/** 데스크톱 마이페이지 헤더 border-bottom과 동일 */
export const MYPAGE_SECTION_UNDERBAR_COLOR = "#f0f0f0";

/** 모바일 섹션 하단 언더바 — padding-bottom + border-bottom */
export const mypageMobileSectionUnderbarStyle = css`
  padding-bottom: 1rem;
  border-bottom: 1px solid ${MYPAGE_SECTION_UNDERBAR_COLOR};
  box-sizing: border-box;
`;
