import styled from "@emotion/styled";
import { LAYOUT_CONTENT_MAX_WIDTH } from "@/lib/layout";

export const HeaderContainer = styled.header`
  width: calc(100% - 4rem);
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 2rem;
  z-index: 100;
  max-width: ${LAYOUT_CONTENT_MAX_WIDTH};
  left: 50%;
  transform: translateX(-50%);
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

export const Logo = styled.h1`
  font-family: "Noto Serif KR", serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
  flex-shrink: 0;

  a {
    color: inherit;
    text-decoration: none;
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

export const NavLink = styled.li`
  list-style: none;
  margin: 0;
  padding: 0;

  a {
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
