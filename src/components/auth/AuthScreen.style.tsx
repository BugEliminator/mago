import styled from "@emotion/styled";
import { motion } from "framer-motion";
import Link from "next/link";

/** 인증 화면 페이지 루트 — SpaceBackground 기준점 */
export const AuthPageRoot = styled.main`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;

/** 인증 콘텐츠 레이어 — 카드 중앙 정렬 */
export const AuthContentLayer = styled.section`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

/** 글래스모피즘 카드 */
const AuthCardBase = styled.div`
  width: 100%;
  max-width: 420px;
  background: #1c2238;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid #3d455c;
  border-radius: 1.5rem;
  padding: 2.75rem 1rem 2.25rem;
  box-shadow:
    inset 0 0 0 1px #4a3c24,
    0 32px 64px #030407;
`;
export const AuthCard = motion(AuthCardBase);

/** 카드 상단 */
export const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

/** 브랜드 심볼 — 텍스트 (비밀번호 찾기 등) */
export const CardBrand = styled.p`
  margin: 0 0 1.25rem;
  font-family: "Noto Serif KR", serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #f9a825;
`;

/** 브랜드 로고 — 로그인·회원가입 */
export const CardBrandLogoWrap = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 0 1.25rem;
  line-height: 0;
`;

/** 제목 */
export const CardTitle = styled.h1`
  margin: 0 0 0.5rem;
  font-family: "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: #f5f6fa;
  letter-spacing: -0.01em;
`;

/** 부제 */
export const CardSubtitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #8b93a8;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

/** 주요 제출 버튼 */
const SubmitButtonBase = styled.button`
  width: 100%;
  padding: 0.9375rem;
  margin-top: 0.125rem;
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  border: none;
  border-radius: 0.75rem;
  color: #f5f6fa;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: 0 4px 20px #12182f;
  transition: box-shadow 200ms ease;

  &:hover {
    box-shadow: 0 6px 28px #1a2250;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;
export const SubmitButton = motion(SubmitButtonBase);

/** 카드 하단 문구 영역 */
export const CardFooter = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #8e96ab;
`;

/** 카드 하단 링크 */
export const FooterLink = styled(Link)`
  margin-left: 0.25rem;
  font-weight: 500;
  color: #e0b140;
  transition: color 150ms ease;

  &:hover {
    color: #f5c94a;
  }
`;
