"use client";

import { useCallback } from "react";
import { NOTION_LINKS } from "@/lib/support/notionLinks";
import {
  openEmailInquiry,
  openKakaoInquiry,
} from "@/lib/support/inquiryContact";
import {
  FooterBrandLink,
  FooterBrandLogo,
  FooterCopyright,
  FooterDisclaimer,
  FooterInner,
  FooterInquiryGroup,
  FooterLead,
  FooterNav,
  FooterNavButton,
  FooterNavDivider,
  FooterNavLink,
  FooterRoot,
} from "./Footer.style";

const FOOTER_DISCLAIMER =
  "MAGO가 제공하는 타로 리딩은 삶의 통찰과 조언을 위한 참고용 서비스이며, 절대적인 미래 예측이나 법적·의학적·전문적 판단을 대체할 수 없습니다.";

/**
 * 사이트 푸터 — 브랜드·약관 링크·문의·면책·저작권
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleKakaoInquiry = useCallback(() => {
    openKakaoInquiry();
  }, []);

  const handleEmailInquiry = useCallback(() => {
    void openEmailInquiry();
  }, []);

  return (
    <FooterRoot>
      <FooterInner>
        <FooterBrandLink href="/" aria-label="MAGO 홈">
          <FooterBrandLogo src="/logo.png" alt="MAGO" />
        </FooterBrandLink>
        <FooterLead>동서양의 지혜를 담은 프라이빗 AI 타로 마스터</FooterLead>

        <FooterNav aria-label="푸터 링크">
          <FooterNavLink
            href={NOTION_LINKS.terms}
            target="_blank"
            rel="noopener noreferrer"
          >
            이용약관
          </FooterNavLink>
          <FooterNavDivider aria-hidden>|</FooterNavDivider>
          <FooterNavLink
            href={NOTION_LINKS.privacy}
            target="_blank"
            rel="noopener noreferrer"
          >
            개인정보처리방침
          </FooterNavLink>
          <FooterNavDivider aria-hidden>|</FooterNavDivider>
          <FooterNavLink
            href={NOTION_LINKS.refund}
            target="_blank"
            rel="noopener noreferrer"
          >
            환불 정책
          </FooterNavLink>
          <FooterNavDivider aria-hidden>|</FooterNavDivider>
          <FooterInquiryGroup>
            <span>문의하기 (</span>
            <FooterNavButton type="button" onClick={handleKakaoInquiry}>
              카카오톡
            </FooterNavButton>
            <span>/</span>
            <FooterNavButton type="button" onClick={handleEmailInquiry}>
              이메일
            </FooterNavButton>
            <span>)</span>
          </FooterInquiryGroup>
        </FooterNav>

        <FooterDisclaimer>{FOOTER_DISCLAIMER}</FooterDisclaimer>
        <FooterCopyright>
          © {currentYear} MAGO. All rights reserved.
        </FooterCopyright>
      </FooterInner>
    </FooterRoot>
  );
}
