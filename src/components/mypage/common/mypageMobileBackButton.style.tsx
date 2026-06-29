import styled from "@emotion/styled";
import { HEADER_CONTENT_HEIGHT_MOBILE } from "@/components/layout/Header.style";

/** 몰입형 마이페이지·로그인 모바일 TopBar 뒤로가기 — 메인 Header 본문 행(2rem)과 동일 */
export const MypageMobileBackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${HEADER_CONTENT_HEIGHT_MOBILE};
  height: ${HEADER_CONTENT_HEIGHT_MOBILE};
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid #e8eaf6;
  background: #ffffff;
  color: #424242;
  cursor: pointer;
  transition: background 150ms ease-in-out;

  &:hover {
    background: #f0f0f0;
  }
`;
