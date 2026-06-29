"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { TarotCardToastIcon } from "@/components/common/toast/ToastIcons";
import { AuthField } from "@/components/common/input/Input";
import BirthDateField from "@/components/common/date/BirthDateField";
import BirthTimeField from "@/components/common/date/BirthTimeField";
import {
  AuthCard,
  CardHeader,
  CardBrand,
  CardTitle,
  CardSubtitle,
  SubmitButton,
} from "@/components/auth/AuthScreen.style";
import {
  Overlay,
  FieldStack,
  WheelFieldHeader,
  WheelFieldLabel,
  OptionalToggle,
  OptionalToggleBox,
  OptionalToggleText,
  OptionalCheckImg,
  GenderSegmentRow,
  GenderSegment,
  ButtonRow,
  TextActionButton,
} from "./ProfileExtraPromptModal.style";
import { supabase } from "@/lib/supabaseClient";
import {
  readProfileExtraNeverAgain,
  writeProfileExtraNeverAgain,
  profileHasAnyExtraInfo,
} from "@/lib/profileExtraPrompt";

/** 모달 닫을 때 공통 토스트 문구 */
const PROFILE_EXTRA_CLOSE_TOAST =
  "추가 정보는 마이페이지에서 언제든 입력·수정할 수 있어요.";

/** 선택 안 함 체크 시 표시 — `public/icon/check.svg` */
function OptionalCheckMarkIcon() {
  return (
    <OptionalCheckImg
      src="/icon/check.svg"
      alt=""
      decoding="async"
      aria-hidden
    />
  );
}

/** 성별 세그먼트 — 남성 / 여성 / 선택 안 함(값 없음) */
const GENDER_SEGMENTS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
  { value: "", label: "선택 안 함" },
];

/** 카드 진입 애니메이션 */
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};

type FormState = {
  gender: string;
  birthDate: string;
  bornTime: string;
};

const emptyForm: FormState = {
  gender: "",
  birthDate: "",
  bornTime: "",
};

/**
 * 로그인 사용자에게 성별·생년월일·출생 시각 선택 입력을 유도하는 모달
 * — 메인(`/`)에서만 마운트됨. 설정 완료·다시 보지 않기로만 닫을 수 있음.
 */
export default function ProfileExtraPromptModal() {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  /** 기본값: 선택 안 함(체크됨) */
  const [skipBirthDate, setSkipBirthDate] = useState(true);
  const [skipBornTime, setSkipBornTime] = useState(true);

  /** 체크 해제 시 복원할 마지막 선택값 */
  const lastBirthDateRef = useRef<string>("");
  const lastBornTimeRef = useRef<string>("");

  const closeWithToast = useCallback(() => {
    toast(PROFILE_EXTRA_CLOSE_TOAST, { icon: <TarotCardToastIcon /> });
    setOpen(false);
  }, []);

  /** 세션·프로필·로컬 플래그에 따라 모달 표시 여부 결정 */
  const syncPromptVisibility = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const uid = session?.user.id;
    if (!uid) {
      setUserId(null);
      setOpen(false);
      return;
    }

    if (readProfileExtraNeverAgain(uid)) {
      setUserId(uid);
      setOpen(false);
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("gender,birth_date,born_time")
      .eq("id", uid)
      .maybeSingle();

    if (error) {
      console.error("[ProfileExtraPromptModal]", error);
      setUserId(uid);
      setOpen(false);
      return;
    }

    setUserId(uid);

    if (profileHasAnyExtraInfo(profile)) {
      setOpen(false);
      return;
    }

    setForm(emptyForm);
    setSkipBirthDate(true);
    setSkipBornTime(true);
    lastBirthDateRef.current = "";
    lastBornTimeRef.current = "";
    setOpen(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void syncPromptVisibility();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncPromptVisibility();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [syncPromptVisibility]);

  /** 다시 보지 않기 — 로컬에만 저장 */
  const handleNeverAgain = () => {
    if (!userId) {
      return;
    }
    writeProfileExtraNeverAgain(userId);
    closeWithToast();
  };

  /** 폼 저장 — 입력된 필드만 PATCH */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId || saving) {
      return;
    }

    const payload: Record<string, string> = {};
    const g = form.gender.trim();
    if (g.length > 0) {
      payload.gender = g;
    }
    if (!skipBirthDate && form.birthDate.length > 0) {
      payload.birth_date = form.birthDate;
    }
    if (!skipBornTime && form.bornTime.length > 0) {
      payload.born_time = `${form.bornTime}:00`;
    }

    if (Object.keys(payload).length === 0) {
      /** 전부 선택 안 함이어도 한 번 응답한 것으로 처리 */
      writeProfileExtraNeverAgain(userId);
      closeWithToast();
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", userId);

    setSaving(false);

    if (error) {
      console.error("[ProfileExtraPromptModal] update", error);
      toast.error("저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    writeProfileExtraNeverAgain(userId);
    closeWithToast();
  };

  if (!open) {
    return null;
  }

  return (
    <Overlay role="presentation">
      <AuthCard
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-extra-prompt-title"
        style={{
          position: "relative",
          maxHeight: "calc(100vh - 3rem)",
          overflowY: "auto",
        }}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <CardHeader>
          <CardBrand>MAGO</CardBrand>
          <CardTitle id="profile-extra-prompt-title">추가 정보</CardTitle>
          <CardSubtitle>
            당신만을 위한 정교한 운명 해석을 위해 필요해요. <br />
            정보가 많을수록 AI 마고가 더 깊은 통찰을 전해드립니다.
          </CardSubtitle>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <FieldStack>
            <AuthField label="성별" htmlFor="profile-extra-gender-male">
              <GenderSegmentRow role="radiogroup" aria-label="성별">
                {GENDER_SEGMENTS.map((opt) => {
                  const inputId =
                    opt.value === ""
                      ? "profile-extra-gender-none"
                      : `profile-extra-gender-${opt.value}`;
                  return (
                    <GenderSegment
                      key={opt.value || "none"}
                      $selected={form.gender === opt.value}
                    >
                      <input
                        type="radio"
                        name="profile-extra-gender"
                        id={inputId}
                        value={opt.value}
                        checked={form.gender === opt.value}
                        disabled={saving}
                        onChange={() =>
                          setForm((prev) => ({
                            ...prev,
                            gender: opt.value,
                          }))
                        }
                      />
                      <span>{opt.label}</span>
                    </GenderSegment>
                  );
                })}
              </GenderSegmentRow>
            </AuthField>

            <div>
              <WheelFieldHeader>
                <WheelFieldLabel>생년월일</WheelFieldLabel>
                <OptionalToggle $checked={skipBirthDate} $disabled={saving}>
                  <input
                    type="checkbox"
                    checked={skipBirthDate}
                    disabled={saving}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setSkipBirthDate(next);
                      if (next) {
                        setForm((prev) => ({ ...prev, birthDate: "" }));
                        return;
                      }
                      const restore =
                        lastBirthDateRef.current ||
                        String(new Date().getFullYear() - 30) + "-01-01";
                      setForm((prev) => ({ ...prev, birthDate: restore }));
                    }}
                  />
                  <OptionalToggleBox $checked={skipBirthDate}>
                    {skipBirthDate ? <OptionalCheckMarkIcon /> : null}
                  </OptionalToggleBox>
                  <OptionalToggleText $checked={skipBirthDate}>
                    선택 안 함
                  </OptionalToggleText>
                </OptionalToggle>
              </WheelFieldHeader>
              <BirthDateField
                id="profile-extra-birth"
                value={form.birthDate}
                onChange={(next) => {
                  lastBirthDateRef.current = next;
                  setForm((prev) => ({ ...prev, birthDate: next }));
                }}
                disabled={saving || skipBirthDate}
              />
            </div>

            <div>
              <WheelFieldHeader>
                <WheelFieldLabel>태어난 시간</WheelFieldLabel>
                <OptionalToggle $checked={skipBornTime} $disabled={saving}>
                  <input
                    type="checkbox"
                    checked={skipBornTime}
                    disabled={saving}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setSkipBornTime(next);
                      if (next) {
                        setForm((prev) => ({ ...prev, bornTime: "" }));
                        return;
                      }
                      const restore = lastBornTimeRef.current || "12:00";
                      setForm((prev) => ({ ...prev, bornTime: restore }));
                    }}
                  />
                  <OptionalToggleBox $checked={skipBornTime}>
                    {skipBornTime ? <OptionalCheckMarkIcon /> : null}
                  </OptionalToggleBox>
                  <OptionalToggleText $checked={skipBornTime}>
                    선택 안 함
                  </OptionalToggleText>
                </OptionalToggle>
              </WheelFieldHeader>
              <BirthTimeField
                id="profile-extra-time"
                value={form.bornTime}
                onChange={(next) => {
                  lastBornTimeRef.current = next;
                  setForm((prev) => ({ ...prev, bornTime: next }));
                }}
                disabled={saving || skipBornTime}
              />
            </div>
          </FieldStack>

          <ButtonRow>
            <SubmitButton
              type="submit"
              disabled={saving}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? "저장 중…" : "설정 완료"}
            </SubmitButton>
            <TextActionButton
              type="button"
              onClick={handleNeverAgain}
              disabled={saving || !userId}
            >
              다시 보지 않기
            </TextActionButton>
          </ButtonRow>
        </form>
      </AuthCard>
    </Overlay>
  );
}
