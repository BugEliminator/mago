"use client";

import { useState } from "react";
import SpaceBackground from "@/components/common/background/SpaceBackground";
import AuthForm from "@/components/common/form/AuthForm";
import { AuthField, Input } from "@/components/common/input/Input";
import {
  AuthPageRoot,
  AuthContentLayer,
  AuthCard,
  CardHeader,
  CardBrand,
  CardTitle,
  CardSubtitle,
  SubmitButton,
  CardFooter,
  FooterLink,
} from "@/components/auth/AuthScreen.style";

/** 카드 진입 애니메이션 — Login/Signup과 동일 easing */
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};

/**
 * 비밀번호 찾기 — 가입 이메일 입력 후 재설정 메일 발송(퍼블)
 * 이후 Supabase `resetPasswordForEmail` 등으로 연동 예정.
 */
export default function ForgetPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Supabase 비밀번호 재설정 메일 발송 + 리다이렉트 URL 설정
  };

  const isValid = email.trim() !== "";

  return (
    <AuthPageRoot>
      <SpaceBackground />
      <AuthContentLayer>
        <AuthCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <CardHeader>
            <CardBrand>MAGO</CardBrand>
            <CardTitle>비밀번호 찾기</CardTitle>
            <CardSubtitle>
              가입 시 사용한 이메일을 입력해 주세요.
              <br />
              재설정 링크가 메일로 전송됩니다.
            </CardSubtitle>
          </CardHeader>

          <AuthForm autoComplete="off" onSubmit={handleSubmit}>
            <AuthField label="이메일" htmlFor="forget-email">
              <Input
                id="forget-email"
                type="email"
                placeholder="your@email.com"
                name="forget-email"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </AuthField>

            <SubmitButton
              type="submit"
              disabled={!isValid}
              whileHover={isValid ? { scale: 1.015 } : {}}
              whileTap={isValid ? { scale: 0.985 } : {}}
            >
              재설정 메일 보내기
            </SubmitButton>
          </AuthForm>

          <CardFooter>
            로그인으로 돌아가시려면
            <FooterLink href="/login">로그인</FooterLink>
          </CardFooter>
        </AuthCard>
      </AuthContentLayer>
    </AuthPageRoot>
  );
}
