import styled from "@emotion/styled";
import Link from "next/link";
import {
  DESKTOP_MIN_WIDTH,
  LAYOUT_CONTENT_MAX_WIDTH,
  LAYOUT_PAGE_HORIZONTAL_PADDING,
} from "@/lib/layout/layout";

export const FooterRoot = styled.footer`
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
  padding: 2.5rem ${LAYOUT_PAGE_HORIZONTAL_PADDING} 3rem;
  border-top: 1px solid #243044;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.neutral.silver};

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    padding: 3rem 0 3.5rem;
  }
`;

export const FooterInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  max-width: ${LAYOUT_CONTENT_MAX_WIDTH};
  margin: 0 auto;
`;

export const FooterBrandLink = styled(Link)`
  display: inline-flex;
  line-height: 0;
  text-decoration: none;
`;

/** 푸터 MAGO 워드마크 — 헤더와 동일한 logo.png */
export const FooterBrandLogo = styled.img`
  display: block;
  height: 2rem;
  width: auto;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    height: 2.25rem;
  }
`;

export const FooterLead = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.neutral.silver};
  word-break: keep-all;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 0.9375rem;
  }
`;

export const FooterNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.625rem;
  margin-top: 0.25rem;
`;

export const FooterNavLink = styled.a`
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.neutral.silver};
  text-decoration: none;
  word-break: keep-all;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent.gold};
  }

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 0.875rem;
  }
`;

export const FooterNavButton = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.15em;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent.gold};
  }
`;

export const FooterNavDivider = styled.span`
  font-size: 0.8125rem;
  line-height: 1;
  color: #243044;
  user-select: none;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 0.875rem;
  }
`;

export const FooterInquiryGroup = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.neutral.silver};

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 0.875rem;
  }
`;

export const FooterDisclaimer = styled.p`
  margin: 0.75rem 0 0;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.neutral.silver};
  word-break: keep-all;
  opacity: 0.85;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 0.8125rem;
  }
`;

export const FooterCopyright = styled.p`
  margin: 1rem 0 0;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.neutral.silver};
  opacity: 0.75;

  @media (min-width: ${DESKTOP_MIN_WIDTH}) {
    font-size: 0.8125rem;
  }
`;
