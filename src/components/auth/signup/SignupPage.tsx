"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  ActionRow,
  CodeHint,
  ErrorBanner,
  InfoBanner,
  OtpCell,
  OtpRow,
  SpamFolderHint,
  TextButton,
  TimerHint,
} from "./SignupPage.style";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import {
  SIGNUP_EMAIL_ALREADY_REGISTERED_TOAST,
  SIGNUP_WITHDRAW_COOLDOWN_TOAST_TITLE,
  formatSignupWithdrawCooldownDescription,
  isSignupObfuscatedExistingUser,
  resolveSignupAuthError,
} from "@/lib/mapSignupAuthError";
import { preloadLandingDeckImages } from "@/lib/preloadLandingDeckImages";
import { requestApplyReferrerFromClient } from "@/lib/requestApplyReferrerFromClient";
import { requestCheckSignupEmailFromClient } from "@/lib/requestCheckSignupEmailFromClient";
import { requestCompleteSignupFromClient } from "@/lib/requestCompleteSignupFromClient";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_POLICY_DESC,
  isPasswordStrong,
} from "@/lib/passwordPolicy";

/** 카드 진입 애니메이션 */
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};

const OTP_LENGTH = 6;

/** OTP 입력 단계 — 표시용 남은 시간(초). Supabase 만료와 무관한 UI 타이머 */
const OTP_COUNTDOWN_TOTAL_SECONDS = 180;

/** 남은 시간 본문만 — 항상 MM분 SS초 (두 자리 패딩) */
function formatOtpCountdownParts(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${String(minutes).padStart(2, "0")}분 ${String(seconds).padStart(2, "0")}초`;
}

/** OTP 화면 타이머 안내 — 카운트다운 또는 만료 문구 */
const OTP_TIMER_EXPIRED_MESSAGE =
  "시간이 만료되었습니다. 인증 코드를 다시 보내주세요.";

function createEmptyOtp(): string[] {
  return Array.from({ length: OTP_LENGTH }, () => "");
}

type SignupStep = 1 | 2;

const MAX_NICKNAME_LENGTH = 20;

/** 인증 메일 재발송 최소 간격(ms) — 재발송 성공 이후(클라이언트 안내용) */
const RESEND_COOLDOWN_MS = 30_000;

/**
 * 재발송 rate limit 응답 — 빨간 배너 대신 토스트만 사용
 */
function isAuthResendRateLimitMessage(message: string): boolean {
  return (
    /only request this after/i.test(message) ||
    /after \d+\s*seconds/i.test(message) ||
    /rate limit/i.test(message) ||
    /too many requests/i.test(message) ||
    /over_email_send_rate_limit/i.test(message)
  );
}

/** 영문 rate limit 메시지에서 대기 초 추출(실패 시 null) */
function parseResendWaitSecondsFromMessage(message: string): number | null {
  const m = message.match(/after (\d+)\s*seconds?/i);
  if (m) return parseInt(m[1], 10);
  return null;
}

function showResendCooldownToast(waitSeconds: number): void {
  const sec = Math.max(1, waitSeconds);
  toast.warning("30초마다 시도할 수 있습니다.", {
    description: `${sec}초 후에 다시 시도해주세요.`,
  });
}

/** 초를 응답에서 못 읽을 때 — 빨간 배너 없이 일반 안내만 */
function showResendRateLimitToastGeneric(): void {
  toast.warning("30초마다 시도할 수 있습니다.", {
    description: "잠시 후 다시 시도해주세요.",
  });
}

function getEmailRedirectTo(): string {
  return `${window.location.origin}/auth/callback`;
}

/** signUp 실패 메시지 — 중복 이메일 등은 토스트, 그 외는 빨간 배너 */
function showSignupStep1Error(
  message: string,
  setAuthError: (msg: string | null) => void,
): void {
  const resolved = resolveSignupAuthError(message);
  if (resolved?.kind === "toast") {
    setAuthError(null);
    if (resolved.description != null) {
      toast.error(resolved.message, { description: resolved.description });
    } else {
      toast.error(resolved.message);
    }
    return;
  }
  setAuthError(message);
}

/** OTP 인증 완료 후 프로필·가입 보상 생성 → 추천인 처리 → 메인 이동 */
async function finishSignupAfterAuth(
  accessToken: string,
  form: { email: string; nickname: string; referrerCode: string },
  router: ReturnType<typeof useRouter>,
): Promise<void> {
  const complete = await requestCompleteSignupFromClient({
    accessToken,
    email: form.email.trim(),
    nickname: form.nickname.trim(),
  });

  if (!complete.ok) {
    toast.error(complete.error);
    return;
  }

  await tryApplyReferrerOnSignup(accessToken, form.referrerCode);
  await preloadLandingDeckImages();
  router.replace("/");
}

/** 가입 완료 후 추천인 보상 시도 — 잘못된 코드는 조용히 스킵 */
async function tryApplyReferrerOnSignup(
  accessToken: string,
  referrerCode: string,
): Promise<void> {
  const trimmed = referrerCode.trim();
  if (trimmed.length === 0) return;

  await requestApplyReferrerFromClient({
    referrerCode: trimmed,
    accessToken,
  });
}

/**
 * 회원가입 — 1단계: Supabase signUp(인증 메일·OTP 발송),
 * 2단계: 메일의 6자리 코드 입력 후 verifyOtp로 가입 완료.
 */
export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>(1);
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    referrerCode: "",
  });
  const [otpDigits, setOtpDigits] = useState<string[]>(createEmptyOtp);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [authError, setAuthError] = useState<string | null>(null);
  const [resendInfo, setResendInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(
    OTP_COUNTDOWN_TOTAL_SECONDS,
  );
  /** 마지막으로 재발송에 성공한 시각(ms). null이면 아직 재발송하지 않았거나 1단계로 돌아감 */
  const lastResendSuccessAtRef = useRef<number | null>(null);

  const handleFieldChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setAuthError(null);
    };

  /** 1단계 — Supabase 회원가입(OTP 메일 발송) */
  const handleStep1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);

    const nicknameVal = formData.nickname.trim();
    if (!nicknameVal) {
      setAuthError("닉네임을 입력해 주세요.");
      return;
    }
    if (nicknameVal.length > MAX_NICKNAME_LENGTH) {
      setAuthError(
        `닉네임은 최대 ${MAX_NICKNAME_LENGTH}자까지 입력 가능합니다.`,
      );
      return;
    }
    if (!isPasswordStrong(formData.password)) {
      setAuthError(PASSWORD_POLICY_DESC);
      return;
    }

    setIsSubmitting(true);

    const email = formData.email.trim();
    const cooldownCheck = await requestCheckSignupEmailFromClient(email);
    if (!cooldownCheck.ok) {
      setIsSubmitting(false);
      toast.error(cooldownCheck.error);
      return;
    }
    if (!cooldownCheck.allowed) {
      setIsSubmitting(false);
      toast.error(SIGNUP_WITHDRAW_COOLDOWN_TOAST_TITLE, {
        description: formatSignupWithdrawCooldownDescription(
          cooldownCheck.daysUntilEligible,
        ),
      });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: formData.password,
      options: {
        emailRedirectTo: getEmailRedirectTo(),
        data: {
          nickname: formData.nickname.trim(),
        },
      },
    });

    setIsSubmitting(false);

    if (error) {
      showSignupStep1Error(error.message, setAuthError);
      return;
    }

    if (isSignupObfuscatedExistingUser(data.user)) {
      setAuthError(null);
      toast.error(SIGNUP_EMAIL_ALREADY_REGISTERED_TOAST);
      return;
    }

    if (data.session) {
      await finishSignupAfterAuth(data.session.access_token, formData, router);
      return;
    }

    setOtpDigits(createEmptyOtp());
    setResendInfo(null);
    lastResendSuccessAtRef.current = null;
    setStep(2);
    toast.success("인증 코드가 전송되었습니다.", {
      description: "메일이 오지 않았다면 스팸함도 확인해주세요.",
    });
  };

  /** 2단계 — 6자리 OTP 검증 */
  const handleStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    const token = otpDigits.join("");
    if (token.length !== OTP_LENGTH) return;

    setIsVerifyingOtp(true);
    const email = formData.email.trim();

    let result = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });
    if (result.error) {
      result = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });
    }

    setIsVerifyingOtp(false);

    if (result.error) {
      setAuthError(result.error.message);
      return;
    }
    if (result.data.session) {
      await finishSignupAfterAuth(
        result.data.session.access_token,
        formData,
        router,
      );
      return;
    }
    setAuthError("세션이 만들어지지 않았습니다. 다시 시도해 주세요.");
  };

  const handleResendSignupEmail = async () => {
    const now = Date.now();
    const lastAt = lastResendSuccessAtRef.current;
    if (lastAt !== null) {
      const waitMs = RESEND_COOLDOWN_MS - (now - lastAt);
      if (waitMs > 0) {
        showResendCooldownToast(Math.ceil(waitMs / 1000));
        return;
      }
    }

    setResendInfo(null);
    setAuthError(null);
    setIsResending(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: formData.email.trim(),
      options: {
        emailRedirectTo: getEmailRedirectTo(),
      },
    });

    setIsResending(false);

    if (error) {
      const msg = error.message ?? "";
      if (isAuthResendRateLimitMessage(msg)) {
        const parsed = parseResendWaitSecondsFromMessage(msg);
        if (parsed !== null) {
          showResendCooldownToast(parsed);
        } else {
          showResendRateLimitToastGeneric();
        }
        return;
      }
      setAuthError(msg);
      return;
    }
    lastResendSuccessAtRef.current = Date.now();
    setResendInfo("인증 메일을 다시 보냈습니다. 메일함을 확인해 주세요.");
    setOtpSecondsLeft(OTP_COUNTDOWN_TOTAL_SECONDS);
  };

  const handleOtpChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      if (raw === "") {
        setOtpDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
        return;
      }
      const digit = raw.slice(-1);
      setOtpDigits((prev) => {
        const next = [...prev];
        next[index] = digit;
        return next;
      });
      if (index < OTP_LENGTH - 1) {
        otpInputRefs.current[index + 1]?.focus();
      }
    };

  const handleOtpKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Backspace") return;
      if (otpDigits[index] !== "" || index === 0) return;
      e.preventDefault();
      setOtpDigits((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
      otpInputRefs.current[index - 1]?.focus();
    };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (pasted === "") return;
    const chars = pasted.split("");
    setOtpDigits((prev) => {
      const next = [...prev];
      chars.forEach((c, i) => {
        if (i < OTP_LENGTH) next[i] = c;
      });
      return next;
    });
    const focusAt = Math.min(chars.length, OTP_LENGTH - 1);
    otpInputRefs.current[focusAt]?.focus();
  };

  useEffect(() => {
    if (step !== 2) return;
    const t = window.setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [step]);

  /** 2단계 진입 시 3분부터 1초마다 감소 */
  useEffect(() => {
    if (step !== 2) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOtpSecondsLeft(OTP_COUNTDOWN_TOTAL_SECONDS);
    const id = window.setInterval(() => {
      setOtpSecondsLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [step]);

  const step1Valid =
    formData.nickname.trim() !== "" &&
    formData.nickname.trim().length <= MAX_NICKNAME_LENGTH &&
    formData.email.trim() !== "" &&
    isPasswordStrong(formData.password);

  const step2Valid = otpDigits.every((d) => d !== "");

  const goBackToStep1 = () => {
    setOtpDigits(createEmptyOtp());
    setAuthError(null);
    setResendInfo(null);
    lastResendSuccessAtRef.current = null;
    setStep(1);
  };

  return (
    <AuthPageRoot>
      <SpaceBackground />
      <AuthMobileBackHeader backHref="/login" backAriaLabel="로그인으로" />

      <AuthContentLayer>
        <AuthCard variants={cardVariants} initial="hidden" animate="visible">
          <CardHeader>
            <AuthCardBrandLogo />
            <CardTitle>회원가입</CardTitle>
            <CardSubtitle>
              {step === 1
                ? "계정 정보를 입력해 주세요"
                : "이메일로 보낸 인증 코드를 입력해 주세요"}
            </CardSubtitle>
          </CardHeader>

          {authError && <ErrorBanner role="alert">{authError}</ErrorBanner>}

          {step === 1 && (
            <AuthForm autoComplete="off" onSubmit={handleStep1Submit}>
              <AuthField
                label={`닉네임 (최대 ${MAX_NICKNAME_LENGTH}자)`}
                htmlFor="nickname"
              >
                <Input
                  id="nickname"
                  type="text"
                  placeholder="서비스에서 사용할 이름"
                  name="signup-nickname"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={MAX_NICKNAME_LENGTH}
                  value={formData.nickname}
                  onChange={handleFieldChange("nickname")}
                />
              </AuthField>

              <AuthField label="이메일" htmlFor="signup-email">
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  name="signup-email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleFieldChange("email")}
                />
              </AuthField>

              <PasswordInput
                id="signup-password"
                label="비밀번호"
                placeholder={`비밀번호 (${PASSWORD_MIN_LENGTH}자 이상, 영문+숫자 필수)`}
                name="signup-password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleFieldChange("password")}
              />

              <AuthField
                label="추천인 마고 코드 (선택)"
                htmlFor="signup-referrer"
              >
                <Input
                  id="signup-referrer"
                  type="text"
                  placeholder="친구의 마고 코드를 입력해 주세요"
                  name="signup-referrer"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={formData.referrerCode}
                  onChange={handleFieldChange("referrerCode")}
                />
              </AuthField>

              <SubmitButton
                type="submit"
                disabled={!step1Valid || isSubmitting}
                whileHover={step1Valid && !isSubmitting ? { scale: 1.015 } : {}}
                whileTap={step1Valid && !isSubmitting ? { scale: 0.985 } : {}}
              >
                {isSubmitting ? "처리 중…" : "인증 코드 보내기"}
              </SubmitButton>
            </AuthForm>
          )}

          {step === 2 && (
            <AuthForm autoComplete="off" onSubmit={handleStep2Submit}>
              <CodeHint>
                <strong>{formData.email}</strong> 로 인증 메일을 보냈습니다.
                <br />
                메일에 적힌 <strong>6자리 숫자</strong>를 입력해 주세요.
              </CodeHint>

              <SpamFolderHint>
                메일이 오지 않는다면 스팸함 또는 프로모션함을 확인해 주세요.
              </SpamFolderHint>

              {resendInfo && (
                <InfoBanner role="status">{resendInfo}</InfoBanner>
              )}

              <AuthField label="인증 코드" htmlFor="email-code-0">
                <OtpRow>
                  {otpDigits.map((digit, index) => (
                    <OtpCell
                      key={index}
                      ref={(el) => {
                        otpInputRefs.current[index] = el;
                      }}
                      id={`email-code-${index}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      maxLength={1}
                      value={digit}
                      onChange={handleOtpChange(index)}
                      onKeyDown={handleOtpKeyDown(index)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      aria-label={`인증 코드 ${index + 1}번째 숫자`}
                    />
                  ))}
                </OtpRow>
              </AuthField>

              <TimerHint aria-live="polite">
                {otpSecondsLeft <= 0
                  ? OTP_TIMER_EXPIRED_MESSAGE
                  : `남은 시간 ${formatOtpCountdownParts(otpSecondsLeft)}`}
              </TimerHint>

              <ActionRow>
                <TextButton type="button" onClick={goBackToStep1}>
                  ← 이전
                </TextButton>
                <TextButton
                  type="button"
                  disabled={isResending}
                  onClick={() => void handleResendSignupEmail()}
                >
                  {isResending ? "전송 중…" : "인증 코드 다시 보내기"}
                </TextButton>
              </ActionRow>

              <SubmitButton
                type="submit"
                disabled={!step2Valid || isVerifyingOtp}
                whileHover={
                  step2Valid && !isVerifyingOtp ? { scale: 1.015 } : {}
                }
                whileTap={step2Valid && !isVerifyingOtp ? { scale: 0.985 } : {}}
              >
                {isVerifyingOtp ? "확인 중…" : "가입 완료"}
              </SubmitButton>
            </AuthForm>
          )}

          <CardFooter>
            이미 계정이 있으신가요?
            <FooterLink href="/login">로그인</FooterLink>
          </CardFooter>
        </AuthCard>
      </AuthContentLayer>
    </AuthPageRoot>
  );
}
