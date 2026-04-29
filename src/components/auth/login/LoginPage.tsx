"use client";

import { useState } from "react";
import SpaceBackground from "@/components/common/background/SpaceBackground";
import AuthForm from "@/components/common/form/AuthForm";
import {
  AuthField,
  Input,
  PasswordInput,
} from "@/components/common/input/Input";
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
import { AssistRow, ForgotLink, SocialDivider } from "./LoginPage.style";

/** 카드 진입 애니메이션 */
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};

/**
 * 로그인 화면 UI
 * 라우트(`app/(auth)/login/page.tsx`)는 이 컴포넌트를 마운트하는 껍데기만 둡니다.
 */
export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Supabase 이메일/비밀번호 로그인 연결
  };

  const isFormValid = formData.email.trim() !== "" && formData.password !== "";

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
            <CardTitle>로그인</CardTitle>
            <CardSubtitle>계속하려면 계정에 로그인하세요</CardSubtitle>
          </CardHeader>

          <AuthForm autoComplete="off" onSubmit={handleSubmit}>
            <AuthField label="이메일" htmlFor="email">
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                name="login-email"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={formData.email}
                onChange={handleChange("email")}
              />
            </AuthField>

            <PasswordInput
              id="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              name="login-password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange("password")}
            />

            <AssistRow>
              <ForgotLink href="/forget-password">
                비밀번호를 잊으셨나요?
              </ForgotLink>
            </AssistRow>

            <SubmitButton
              type="submit"
              disabled={!isFormValid}
              whileHover={isFormValid ? { scale: 1.015 } : {}}
              whileTap={isFormValid ? { scale: 0.985 } : {}}
            >
              로그인
            </SubmitButton>

            <SocialDivider>또는</SocialDivider>

            {/*
             * TODO: 소셜 로그인 버튼 (우선순위 순)
             * 1순위 — 카카오 로그인
             * 2순위 — 구글 로그인
             * 3순위 — 애플 로그인
             */}
          </AuthForm>

          <CardFooter>
            계정이 없으신가요?
            <FooterLink href="/signup">회원가입</FooterLink>
          </CardFooter>
        </AuthCard>
      </AuthContentLayer>
    </AuthPageRoot>
  );
}
