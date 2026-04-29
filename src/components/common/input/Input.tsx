"use client";

import { forwardRef, useState } from "react";
import type { ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  FieldGroup,
  FieldLabel,
  InputWrapper,
  AuthTextInput,
  EyeToggle,
} from "./Input.style";

/** 라벨 + 자식(인풋 등) 묶음 — 회원가입·비밀번호 찾기에서도 재사용 */
export function AuthField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <FieldGroup>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
    </FieldGroup>
  );
}

export type InputProps = Omit<
  React.ComponentPropsWithoutRef<typeof AuthTextInput>,
  "$hasToggle"
>;

/**
 * 인증 폼용 단일 라인 인풋 (이메일 등)
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    return <AuthTextInput ref={ref} {...props} />;
  }
);

export type PasswordInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof AuthTextInput>,
  "type" | "$hasToggle"
> & {
  label: string;
  id: string;
};

/**
 * 비밀번호 필드 — 표시/숨김 토글 내장
 */
export function PasswordInput({
  label,
  id,
  ...inputProps
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FieldGroup>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputWrapper>
        <AuthTextInput
          id={id}
          type={showPassword ? "text" : "password"}
          $hasToggle
          {...inputProps}
        />
        <EyeToggle
          type="button"
          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </EyeToggle>
      </InputWrapper>
    </FieldGroup>
  );
}
