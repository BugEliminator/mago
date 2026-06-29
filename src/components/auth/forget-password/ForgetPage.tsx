"use client";

import { useState } from "react";
import { toast } from "sonner";
import SpaceBackground from "@/components/common/background/SpaceBackground";
import AuthMobileBackHeader from "@/components/auth/AuthMobileBackHeader";
import AuthCardBrandLogo from "@/components/auth/AuthCardBrandLogo";
import AuthForm from "@/components/common/form/AuthForm";
import { AuthField, Input } from "@/components/common/input/Input";
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
import { supabase } from "@/lib/supabaseClient";

/** 카드 진입 애니메이션 — Login/Signup과 동일 easing */
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};

function getPasswordResetRedirectTo(): string {
  return `${window.location.origin}/reset-password`;
}

/**
 * 비밀번호 찾기 — 재설정 메일 발송 후 사용자가 링크로 `/reset-password` 이동
 */
export default function ForgetPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: getPasswordResetRedirectTo(),
      }
    );
    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("재설정 링크를 보냈습니다.", {
      description: "메일함을 확인해 주세요. 스팸함도 함께 확인해 보세요.",
    });
  };

  const isValid = email.trim() !== "";

  return (
    <AuthPageRoot>
      <SpaceBackground />
      <AuthMobileBackHeader backHref="/login" backAriaLabel="로그인으로" />

      <AuthContentLayer>
        <AuthCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <CardHeader>
            <AuthCardBrandLogo />
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
                autoComplete="email"
                autoCorrect="off"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </AuthField>

            <SubmitButton
              type="submit"
              disabled={!isValid || isSubmitting}
              whileHover={isValid && !isSubmitting ? { scale: 1.015 } : {}}
              whileTap={isValid && !isSubmitting ? { scale: 0.985 } : {}}
            >
              {isSubmitting ? "전송 중…" : "재설정 메일 보내기"}
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
