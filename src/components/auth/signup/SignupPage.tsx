"use client";

import { useEffect, useRef, useState } from "react";
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
import {
  ActionRow,
  CodeHint,
  OtpCell,
  OtpRow,
  TextButton,
  TimerHint,
} from "./SignupPage.style";

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

function createEmptyOtp(): string[] {
  return Array.from({ length: OTP_LENGTH }, () => "");
}

type SignupStep = 1 | 2;

/**
 * 회원가입 화면 — 1단계(계정 정보) / 2단계(이메일 6자리 인증 코드)
 * OTP 6칸은 이 화면에서만 사용합니다.
 * 퍼블리싱 단계이며 API·메일 발송·검증·타이머 카운트다운은 TODO.
 */
export default function SignupPage() {
  const [step, setStep] = useState<SignupStep>(1);
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
  });
  const [otpDigits, setOtpDigits] = useState<string[]>(createEmptyOtp);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFieldChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  /** 1단계: 인증 메일 발송 후 2단계로 이동 (발송 로직은 TODO) */
  const handleStep1Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 닉네임·이메일·비밀번호 검증 후 6자리 인증 코드 메일 발송
    setOtpDigits(createEmptyOtp());
    setStep(2);
  };

  /** 2단계: 코드 검증 + 회원가입 완료 (TODO) */
  const handleStep2Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Supabase 등으로 코드 검증 및 계정 생성
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

  /** 첫 칸에서 붙여넣기 시 6자리까지 한 번에 채움 */
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
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

  /** 인증 단계 진입 시 첫 칸 포커스 */
  useEffect(() => {
    if (step !== 2) return;
    const t = window.setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [step]);

  const step1Valid =
    formData.nickname.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.password !== "";

  const step2Valid = otpDigits.every((d) => d !== "");

  const goBackToStep1 = () => {
    setOtpDigits(createEmptyOtp());
    setStep(1);
  };

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
            <CardTitle>회원가입</CardTitle>
            <CardSubtitle>
              {step === 1
                ? "계정 정보를 입력해 주세요"
                : "이메일로 보낸 인증 코드를 입력해 주세요"}
            </CardSubtitle>
          </CardHeader>

          {step === 1 && (
            <AuthForm autoComplete="off" onSubmit={handleStep1Submit}>
              <AuthField label="닉네임" htmlFor="nickname">
                <Input
                  id="nickname"
                  type="text"
                  placeholder="서비스에서 사용할 이름"
                  name="signup-nickname"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
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
                placeholder="비밀번호를 입력하세요"
                name="signup-password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleFieldChange("password")}
              />

              <SubmitButton
                type="submit"
                disabled={!step1Valid}
                whileHover={step1Valid ? { scale: 1.015 } : {}}
                whileTap={step1Valid ? { scale: 0.985 } : {}}
              >
                인증 코드 보내기
              </SubmitButton>
            </AuthForm>
          )}

          {step === 2 && (
            <AuthForm autoComplete="off" onSubmit={handleStep2Submit}>
              <CodeHint>
                <strong>{formData.email}</strong> 로 인증 메일을 보냈습니다.
                <br />
                메일의 6자리 숫자를 입력해 주세요.
              </CodeHint>

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

              {/* 퍼블 고정값 — 추후 3분 카운트다운 등 연동 */}
              <TimerHint>남은 시간 2분 30초</TimerHint>

              <ActionRow>
                <TextButton type="button" onClick={goBackToStep1}>
                  ← 이전
                </TextButton>
                <TextButton
                  type="button"
                  onClick={() => {
                    // TODO: 재발송 API + 쿨다운(예: 60초)
                  }}
                >
                  인증 코드 다시 보내기
                </TextButton>
              </ActionRow>

              <SubmitButton
                type="submit"
                disabled={!step2Valid}
                whileHover={step2Valid ? { scale: 1.015 } : {}}
                whileTap={step2Valid ? { scale: 0.985 } : {}}
              >
                가입 완료
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
