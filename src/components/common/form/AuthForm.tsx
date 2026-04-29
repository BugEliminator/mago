import type { FormHTMLAttributes } from "react";
import { AuthFormRoot } from "./AuthForm.style";

type AuthFormProps = FormHTMLAttributes<HTMLFormElement>;

/**
 * 로그인·회원가입·비밀번호 찾기 등 인증 폼의 세로 간격·폭 레이아웃을 통일합니다.
 */
export default function AuthForm({ children, ...rest }: AuthFormProps) {
  return <AuthFormRoot {...rest}>{children}</AuthFormRoot>;
}
