import styled from "@emotion/styled";

/**
 * 푸터 컴포넌트
 * 저작권 정보 등을 표시하는 레이아웃 컴포넌트입니다.
 */

const FooterContainer = styled.footer`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.neutral.black};
  color: ${({ theme }) => theme.colors.neutral.silver};
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Copyright = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral.gray};
`;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>© {currentYear} MAGO. All rights reserved.</Copyright>
      </FooterContent>
    </FooterContainer>
  );
}
