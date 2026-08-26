import styled from "@emotion/styled";
import Link from "next/link";

/** 보조 행 — 비밀번호 찾기 링크 오른쪽 정렬 */
export const AssistRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -0.375rem;
`;

/** 비밀번호를 잊으셨나요? 링크 */
export const ForgotLink = styled(Link)`
  font-size: 0.8125rem;
  color: #e8b84a;
  transition: color 150ms ease;

  &:hover {
    color: #f5d078;
  }
`;

/** 소셜 구분선 */
export const SocialDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 0;
  font-size: 0.8125rem;
  color: #6b7388;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #3e465c;
  }
`;

/** 카카오 공식 버튼색 — 말풍선 로고 + "카카오 로그인" */
export const KakaoLoginButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9375rem;
  margin-top: 0.125rem;
  background: #fee500;
  border: none;
  border-radius: 0.75rem;
  color: #191919;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/** 카카오 말풍선 로고 */
export const KakaoLogoMark = styled.span`
  display: inline-flex;
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;
