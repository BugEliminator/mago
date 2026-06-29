import styled from "@emotion/styled";

/** 하단 nav 높이 — 본문 inset 계산용 */
export const MOBILE_BOTTOM_NAV_HEIGHT = "3.75rem";

export const BottomNavRoot = styled.nav`
  display: none;

  @media (max-width: 640px) {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #f5f5f5;
    border-top: 1px solid #e0e0e0;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
`;

export const BottomNavList = styled.div`
  display: flex;
  width: 100%;
  min-height: ${MOBILE_BOTTOM_NAV_HEIGHT};
  padding: 0.375rem 0.25rem 0.5rem;
  box-sizing: border-box;
`;

export const BottomNavItem = styled.button<{ $active?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin: 0;
  padding: 0.25rem 0.125rem;
  border: none;
  background: transparent;
  font-family: inherit;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#1a237e" : "#9e9e9e")};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  transition: color 0.15s ease;
`;

export const BottomNavIcon = styled.span<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $active }) => ($active ? "1.375rem" : "1.25rem")};
  height: ${({ $active }) => ($active ? "1.375rem" : "1.25rem")};
  line-height: 0;
  flex-shrink: 0;
  transform: ${({ $active }) => ($active ? "scale(1.08)" : "scale(1)")};
  transition:
    transform 0.15s ease,
    width 0.15s ease,
    height 0.15s ease;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export const BottomNavLabel = styled.span<{ $active?: boolean }>`
  font-size: ${({ $active }) => ($active ? "0.6875rem" : "0.625rem")};
  line-height: 1.2;
  letter-spacing: ${({ $active }) => ($active ? "0" : "-0.01em")};
  white-space: nowrap;
  transition: font-size 0.15s ease;
`;

/** 하단 fixed nav 아래 콘텐츠가 가려지지 않도록 */
export const MobilePageBottomInset = styled.div<{ $enabled: boolean }>`
  @media (max-width: 640px) {
    padding-bottom: ${({ $enabled }) =>
      $enabled
        ? `calc(${MOBILE_BOTTOM_NAV_HEIGHT} + env(safe-area-inset-bottom, 0px))`
        : "0"};
  }
`;
