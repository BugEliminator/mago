import styled from "@emotion/styled";
import { mypageMobileFixedTopBarStyle } from "@/components/mypage/common/mypageMobileFixedTopBar.style";

export { MypageMobileBackButton as BackButton } from "@/components/mypage/common/mypageMobileBackButton.style";

const MOBILE = "@media (max-width: 640px)";

/** 인증 화면 모바일 fixed TopBar — 마이페이지·메인 Header와 동일 높이 */
export const AuthMobileTopBar = styled.div`
  display: none;

  ${MOBILE} {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    width: 100%;
    ${mypageMobileFixedTopBarStyle}
  }
`;
