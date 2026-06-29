"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import {
  StepHeaderCloseButton,
  StepHeaderDescription,
  StepHeaderEyebrow,
  StepHeaderFixedZone,
  StepHeaderRoot,
  StepHeaderTitle,
  StepperDot,
  StepperItem,
  StepperLabel,
  StepperLineWrap,
  StepperProgress,
  StepperRow,
  StepperShell,
  StepperTrack,
} from "./SetupStepHeader.style";

export const STEP_TOTAL = 3 as const;
export type SetupStep = 1 | 2 | 3;

const SETUP_STEPS: readonly SetupStep[] = [1, 2, 3];

const CLOSE_ICON_SIZE = 20;
const CLOSE_ICON_STROKE = 2;

type SetupStepHeaderNavProps = {
  currentStep: SetupStep;
  onCloseHome: () => void;
  disabled?: boolean;
};

type SetupStepHeaderCopyProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
};

/** 도트·진행 바 */
function SetupStepper({ currentStep }: { currentStep: SetupStep }) {
  return (
    <StepperShell>
      <StepperLineWrap>
        <StepperTrack />
        <StepperProgress
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentStep - 1) / (STEP_TOTAL - 1)) * 100}%`,
          }}
        />
      </StepperLineWrap>
      <StepperRow>
        {SETUP_STEPS.map((item) => {
          const isActive = item === currentStep;
          const isComplete = item < currentStep;
          return (
            <StepperItem key={item}>
              <StepperDot $active={isActive} $complete={isComplete}>
                {isComplete && <span />}
              </StepperDot>
              <StepperLabel $active={isActive}>STEP {item}</StepperLabel>
            </StepperItem>
          );
        })}
      </StepperRow>
    </StepperShell>
  );
}

/** 상단 고정 — X + 스텝퍼 */
export function SetupStepHeaderNav({
  currentStep,
  onCloseHome,
  disabled = false,
}: SetupStepHeaderNavProps) {
  return (
    <StepHeaderFixedZone>
      <StepHeaderCloseButton
        type="button"
        aria-label="메인으로"
        disabled={disabled}
        onClick={onCloseHome}
      >
        <X size={CLOSE_ICON_SIZE} strokeWidth={CLOSE_ICON_STROKE} aria-hidden />
      </StepHeaderCloseButton>
      <SetupStepper currentStep={currentStep} />
    </StepHeaderFixedZone>
  );
}

/** 고정 — 소제목·제목·설명 */
export function SetupStepHeaderCopy({
  eyebrow,
  title,
  description,
}: SetupStepHeaderCopyProps) {
  return (
    <StepHeaderRoot>
      <StepHeaderEyebrow>{eyebrow}</StepHeaderEyebrow>
      <StepHeaderTitle>{title}</StepHeaderTitle>
      <StepHeaderDescription>{description}</StepHeaderDescription>
    </StepHeaderRoot>
  );
}
