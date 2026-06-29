"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SpaceBackground from "@/components/common/background/SpaceBackground";
import AuthMobileBackHeader from "@/components/auth/AuthMobileBackHeader";
import AuthForm from "@/components/common/form/AuthForm";
import {
  AuthField,
  Input,
  PasswordInput,
} from "@/components/common/input/Input";
import AuthCardBrandLogo from "@/components/auth/AuthCardBrandLogo";
import {
  AuthPageRoot,
  AuthContentLayer,
  AuthCard,
  CardHeader,
  CardTitle,
  CardSubtitle,
  SubmitButton,
  CardFooter,
  FooterLink,
} from "@/components/auth/AuthScreen.style";
import { preloadLandingDeckImages } from "@/lib/preloadLandingDeckImages";
import { supabase } from "@/lib/supabaseClient";
import {
  AssistRow,
  ForgotLink,
  SocialDivider,
} from "./LoginPage.style";

/** 잘못된 이메일/비밀번호 시 노출 문구 */
const LOGIN_INVALID_CREDS_TOAST =
  "이메일 또는 비밀번호가 일치하지 않습니다.";

/** 카드 진입 애니메이션 */
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};

function isInvalidLoginCredentialsMessage(message: string): boolean {
  return (
    message === "Invalid login credentials" ||
    /invalid login credentials/i.test(message)
  );
}

/** 로그인 실패 토스트 아이콘 — `public/icon/lock-keyhole.svg` */
function LoginErrorToastIcon() {
  return (
    <span className="mago-toast-icon" aria-hidden>
      <img src="/icon/lock-keyhole.svg" width={22} height={22} alt="" />
    </span>
  );
}

/**
 * 로그인 화면 UI
 * 라우트(`app/(auth)/login/page.tsx`)는 이 컴포넌트를 마운트하는 껍데기만 둡니다.
 */
export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  /** 이메일·비밀번호 Supabase 세션 로그인 — 실패 시 자물쇠 아이콘 토스트 */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });

    setIsSubmitting(false);

    if (error) {
      const msg = isInvalidLoginCredentialsMessage(error.message)
        ? LOGIN_INVALID_CREDS_TOAST
        : error.message;
      toast.error(msg, { icon: <LoginErrorToastIcon /> });
      return;
    }

    await preloadLandingDeckImages();
    router.refresh();
    router.push("/");
  };

  const isFormValid = formData.email.trim() !== "" && formData.password !== "";

  return (
    <AuthPageRoot>
      <SpaceBackground />
      <AuthMobileBackHeader backHref="/" backAriaLabel="홈으로" />

      <AuthContentLayer>
        <AuthCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <CardHeader>
            <AuthCardBrandLogo />
            <CardTitle>로그인</CardTitle>
            <CardSubtitle>계속하려면 계정에 로그인하세요</CardSubtitle>
          </CardHeader>

          <AuthForm autoComplete="on" onSubmit={handleSubmit}>
            <AuthField label="이메일" htmlFor="email">
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                name="login-email"
                autoComplete="email"
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
              disabled={!isFormValid || isSubmitting}
              whileHover={
                isFormValid && !isSubmitting ? { scale: 1.015 } : {}
              }
              whileTap={isFormValid && !isSubmitting ? { scale: 0.985 } : {}}
            >
              {isSubmitting ? "로그인 중…" : "로그인"}
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
