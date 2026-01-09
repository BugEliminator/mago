import styled from "@emotion/styled";

/**
 * 헤더 컴포넌트
 * 향후 네비게이션 메뉴 등을 추가할 수 있는 레이아웃 컴포넌트입니다.
 */

const HeaderContainer = styled.header`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.neutral.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily.display};
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.blue};
`;

export default function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>MAGO</Logo>
        {/* 향후 네비게이션 메뉴 추가 예정 */}
      </HeaderContent>
    </HeaderContainer>
  );
}
