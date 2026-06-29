import styled from "@emotion/styled";
import { motion } from "framer-motion";
import Link from "next/link";

/** 전체 화면 오버레이 — 배경 클릭 시 닫기 */
const DrawerOverlayBase = styled.div`
  position: fixed;
  inset: 0;
  z-index: 150;
  background: #000000;
`;

/** motion 바깥 래핑 — AnimatePresence exit 가 정상 동작 */
export const DrawerOverlay = motion(DrawerOverlayBase);

/** 오른쪽에서 슬라이드 인 — 너비 72vw, 최대 18rem */
const DrawerPanelBase = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 151;
  width: min(72vw, 18rem);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px #03040733;
`;

/** styled(motion(...)) 대신 motion(styled(...)) — exit transform 전달 보장 */
export const DrawerPanel = motion(DrawerPanelBase);

/** 드로어 상단 — 로고 영역과 닫기 버튼 */
export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #eeeeee;
`;

export const DrawerCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: #616161;
  cursor: pointer;
  transition: background 150ms ease;
  flex-shrink: 0;

  &:hover {
    background: #f5f5f5;
    color: #212121;
  }
`;

/** 드로어 메뉴 목록 */
export const DrawerNav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  overflow-y: auto;
`;

export const DrawerNavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  background: transparent;
  color: #212121;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background 150ms ease;

  &:hover {
    background: #f5f5f5;
  }
`;

/** Link 전용 — DrawerNavItem 과 동일 스타일 */
export const DrawerNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  background: transparent;
  color: #212121;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  text-decoration: none;
  transition: background 150ms ease;
  box-sizing: border-box;

  &:hover {
    background: #f5f5f5;
  }
`;

/** 구분선 */
export const DrawerDivider = styled.hr`
  border: none;
  border-top: 1px solid #eeeeee;
  margin: 0.5rem 0;
`;
