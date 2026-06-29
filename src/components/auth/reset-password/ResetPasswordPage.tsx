"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import SpaceBackground from "@/components/common/background/SpaceBackground";
import AuthCardBrandLogo from "@/components/auth/AuthCardBrandLogo";
import AuthForm from "@/components/common/form/AuthForm";
import { PasswordInput } from "@/components/common/input/Input";
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
import { InfoBanner } from "@/components/auth/signup/SignupPage.style";
import { supabase } from "@/lib/supabaseClient";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_POLICY_DESC,
  isPasswordStrong,
} from "@/lib/passwordPolicy";

/** 카드 진입 애니메이션 — Forget/Login과 동일 */
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};

type RecoveryStatus = "checking" | "ready" | "invalid";

/**
 * 메일 복구 링크로 들어온 사용자가 새 비밀번호를 설정하는 화면
 * — 구조·스타일은 `ForgetPage`와 동일한 인증 카드 패턴
 */
function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [recoveryStatus, setRecoveryStatus] =
    useState<RecoveryStatus>("checking");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** PKCE code 또는 URL hash 기반 복구 세션 확보 */
  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          setRecoveryStatus("invalid");
          return;
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;

      if (session) {
        setRecoveryStatus("ready");
        return;
      }

      /* hash 기반 토큰은 클라이언트에서 비동기 파싱될 수 있음 */
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 400);
      });
      if (cancelled) return;

      const { data: again } = await supabase.auth.getSession();
      setRecoveryStatus(again.session ? "ready" : "invalid");
    };

    void initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !cancelled) {
        setRecoveryStatus("ready");
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!isPasswordStrong(password)) {
      toast.error(PASSWORD_POLICY_DESC);
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    await supabase.auth.signOut();
    toast.success("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
    router.replace("/login");
  };

  const passwordsMatch = password === passwordConfirm && password.length > 0;
  const isFormValid = isPasswordStrong(password) && passwordsMatch;

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
            <AuthCardBrandLogo />
            <CardTitle>새 비밀번호 설정</CardTitle>
            <CardSubtitle>
              새로 사용할 비밀번호를 입력해 주세요.
              <br />
              {PASSWORD_POLICY_DESC}
              <br />
              비밀번호와 확인란은 동일해야 합니다.
            </CardSubtitle>
          </CardHeader>

          {recoveryStatus === "checking" ? (
            <InfoBanner role="status">연결 확인 중…</InfoBanner>
          ) : null}

          {recoveryStatus === "invalid" ? (
            <>
              <InfoBanner role="alert">
                유효하지 않거나 만료된 링크입니다.
                <br />
                비밀번호 찾기에서 메일을 다시 요청해 주세요.
              </InfoBanner>
              <CardFooter>
                <FooterLink href="/forget-password">비밀번호 찾기</FooterLink>
                {" · "}
                <FooterLink href="/login">로그인</FooterLink>
              </CardFooter>
            </>
          ) : null}

          {recoveryStatus === "ready" ? (
            <AuthForm autoComplete="off" onSubmit={handleSubmit}>
              <PasswordInput
                id="reset-password"
                label="비밀번호"
                placeholder={`비밀번호 (${PASSWORD_MIN_LENGTH}자 이상, 영문+숫자)`}
                name="new-password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <PasswordInput
                id="reset-password-confirm"
                label="비밀번호 확인"
                placeholder="비밀번호를 다시 입력하세요"
                name="new-password-confirm"
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />

              <SubmitButton
                type="submit"
                disabled={!isFormValid || isSubmitting}
                whileHover={
                  isFormValid && !isSubmitting ? { scale: 1.015 } : {}
                }
                whileTap={isFormValid && !isSubmitting ? { scale: 0.985 } : {}}
              >
                {isSubmitting ? "저장 중…" : "비밀번호 변경"}
              </SubmitButton>
            </AuthForm>
          ) : null}

          {recoveryStatus === "ready" ? (
            <CardFooter>
              로그인으로 돌아가시려면
              <FooterLink href="/login">로그인</FooterLink>
            </CardFooter>
          ) : null}
        </AuthCard>
      </AuthContentLayer>
    </AuthPageRoot>
  );
}

/** `useSearchParams` 사용을 위해 Suspense 경계 */
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthPageRoot>
          <SpaceBackground />
          <AuthContentLayer>
            <AuthCard
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <CardHeader>
                <AuthCardBrandLogo />
                <CardTitle>새 비밀번호 설정</CardTitle>
                <CardSubtitle>불러오는 중…</CardSubtitle>
              </CardHeader>
            </AuthCard>
          </AuthContentLayer>
        </AuthPageRoot>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
