"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  UserCog,
  Copy,
  Check,
  Calendar,
  Clock,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronLeft,
} from "lucide-react";
import BirthDateField from "@/components/common/date/BirthDateField";
import BirthTimeField from "@/components/common/date/BirthTimeField";
import LanguageSwitcher from "@/components/common/dropdown/LanguageSwitcher";
import { TarotCardToastIcon } from "@/components/common/toast/ToastIcons";
import { supabase } from "@/lib/supabaseClient";
import { toGenderDb } from "@/lib/server/fetchProfileFromDb";
import { PROFILE_EMPTY_FORM, type ProfileForm } from "./profileMockData";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_POLICY_DESC,
  isPasswordStrong,
} from "@/lib/passwordPolicy";
import { writeProfileExtraNeverAgain } from "@/lib/profileExtraPrompt";
import { useLanguageStore, type LanguageCode } from "@/stores/languageStore";
import BannerEmailLine from "./BannerEmailLine";
import { MypageMobileFixedTopBarSpacer } from "@/components/mypage/common/mypageMobileFixedTopBar.style";
import {
  ProfileRoot,
  ProfileHeaderRow,
  TitleGroup,
  ProfileTitle,
  ProfileSubtitle,
  LastSyncBadge,
  MobileTopBar,
  BackButton,
  MobileHeaderBlock,
  MobileTitleRow,
  MobileTitleText,
  MobileProfileSubtitle,
  MobileBannerSection,
  BannerCard,
  BannerLeft,
  OrbWrap,
  OrbRingOuter,
  OrbRingInner,
  OrbBody,
  BannerNameBlock,
  BannerNickname,
  MagoCodeBlock,
  MagoCodeLabel,
  MagoCodeRow,
  MagoCodeText,
  CopyButton,
  SettingsPanel,
  SettingsColumns,
  SettingsColumn,
  PanelDivider,
  PanelTitle,
  FieldGroup,
  FieldLabel,
  FieldLabelRow,
  FieldHint,
  DarkInput,
  PasswordFieldWrap,
  EyeBtn,
  GenderGrid,
  GenderBtn,
  CheckboxLabel,
  FormFooter,
  ResetBtn,
  SaveBtn,
} from "./ProfilePageClient.style";

type GenderOption = "남성" | "여성" | "선택 안 함";
const GENDER_OPTIONS: GenderOption[] = ["남성", "여성", "선택 안 함"];
const MAX_NICKNAME_LENGTH = 20;

/** 프로필 설정 페이지 부제 — 데스크톱·모바일 공통 */
function ProfilePageSubtitle() {
  return (
    <>
      당신만을 위한 정교한 운명 해석을 위해 필요해요.
      <br />
      정보가 많을수록 더 깊은 통찰을 전해드립니다.
    </>
  );
}

type ProfilePageClientProps = {
  /** 서버에서 prefetch한 프로필 데이터 — null이면 빈 폼 */
  initialProfile: ProfileForm | null;
};

/**
 * 프로필 설정 — Supabase profiles 연동
 * 설정 완료 버튼으로 일괄 저장, 초기화는 마지막 저장 스냅샷으로 롤백
 */
export default function ProfilePageClient({
  initialProfile,
}: ProfilePageClientProps) {
  const router = useRouter();
  const setStoreLanguage = useLanguageStore((s) => s.setLanguage);

  const buildInitial = (): ProfileForm =>
    initialProfile != null
      ? { ...initialProfile, currentPassword: "", newPassword: "" }
      : { ...PROFILE_EMPTY_FORM };

  const [form, setForm] = useState<ProfileForm>(buildInitial);
  /** 저장 성공 시 갱신 — 초기화 롤백 기준점 */
  const [committed, setCommitted] = useState<ProfileForm>(buildInitial);

  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  function handleField<K extends keyof ProfileForm>(
    key: K,
    value: ProfileForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /** 마고 코드(uid) 클립보드 복사 */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(form.uid);
      setCopied(true);
      toast.success("코드가 복사되었습니다.", {
        description: "친구에게 전달해서 엽전을 얻어보세요!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  /** 폼 초기화 — 마지막 저장(committed) 스냅샷으로 롤백 */
  const handleReset = () => {
    setForm({ ...committed, currentPassword: "", newPassword: "" });
    toast("변경사항을 초기화했습니다.", { icon: <TarotCardToastIcon /> });
  };

  /** 설정 완료 — profiles UPDATE + (선택) 비밀번호 변경 */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nickname = form.nickname.trim();
    if (!nickname) {
      toast.error("닉네임을 입력해 주세요.");
      return;
    }
    if (nickname.length > MAX_NICKNAME_LENGTH) {
      toast.error(
        `닉네임은 최대 ${MAX_NICKNAME_LENGTH}자까지 입력 가능합니다.`,
      );
      return;
    }

    /** 비밀번호 변경 유효성 */
    if (form.newPassword) {
      if (!form.currentPassword) {
        toast.error(
          "비밀번호를 변경하려면 현재 비밀번호를 먼저 입력해 주세요.",
        );
        return;
      }
      if (!isPasswordStrong(form.newPassword)) {
        toast.error(PASSWORD_POLICY_DESC);
        return;
      }
    }

    setIsSaving(true);

    /** 비밀번호 변경 먼저 처리 */
    if (form.newPassword && form.currentPassword) {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.currentPassword,
      });

      if (verifyError) {
        setIsSaving(false);
        toast.error("현재 비밀번호가 올바르지 않습니다.");
        return;
      }

      const { error: pwError } = await supabase.auth.updateUser({
        password: form.newPassword,
      });

      if (pwError) {
        setIsSaving(false);
        toast.error(`비밀번호 변경에 실패했습니다: ${pwError.message}`);
        return;
      }
    }

    /** profiles UPDATE */
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user == null) {
      setIsSaving(false);
      toast.error("로그인 세션이 만료되었습니다. 다시 로그인해 주세요.");
      return;
    }

    const birthDateValue = form.noBirthDate
      ? null
      : `${form.birthYear}-${String(form.birthMonth).padStart(2, "0")}-${String(form.birthDay).padStart(2, "0")}`;

    const bornTimeValue = form.noBirthTime
      ? null
      : `${String(form.birthHour).padStart(2, "0")}:${String(form.birthMinute).padStart(2, "0")}:00`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        nickname,
        gender: toGenderDb(form.gender),
        birth_date: birthDateValue,
        born_time: bornTimeValue,
        language: form.language,
      })
      .eq("id", user.id);

    setIsSaving(false);

    if (updateError) {
      toast.error(`저장에 실패했습니다: ${updateError.message}`);
      return;
    }

    /** 언어 설정 — Zustand(헤더 반영) */
    setStoreLanguage(form.language as LanguageCode);

    /** 마이페이지 저장 완료 — 추가 정보 모달 재노출 방지 */
    writeProfileExtraNeverAgain(user.id);

    /** 저장 성공 — committed 갱신, 비밀번호 필드 초기화 */
    const now = new Date();
    const lastSync = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
    const saved: ProfileForm = {
      ...form,
      nickname,
      lastSync,
      currentPassword: "",
      newPassword: "",
    };
    setForm(saved);
    setCommitted(saved);

    toast.success("프로필 설정 수정 완료");
  };

  return (
    <ProfileRoot>
      {/* 모바일 전용: 뒤로가기 */}
      <MobileTopBar>
        <BackButton
          type="button"
          aria-label="뒤로가기"
          onClick={() => router.push("/mypage")}
        >
          <ChevronLeft size={18} />
        </BackButton>
      </MobileTopBar>
      <MypageMobileFixedTopBarSpacer aria-hidden />

      {/* 모바일 전용: 제목 + 부제 — 뒤로가기 바로 아래 */}
      <MobileHeaderBlock>
        <MobileTitleRow>
          <MobileTitleText>프로필 설정</MobileTitleText>
          {committed.lastSync && (
            <LastSyncBadge>Last Sync: {committed.lastSync}</LastSyncBadge>
          )}
        </MobileTitleRow>
        <MobileProfileSubtitle>
          <ProfilePageSubtitle />
        </MobileProfileSubtitle>
      </MobileHeaderBlock>

      {/* 상단 배너 — 허브와 동일 Orb 프로필 카드 */}
      <MobileBannerSection>
        <BannerCard>
        <BannerLeft>
          {/* 성좌 네뷸라 Orb */}
          <OrbWrap>
            <OrbRingOuter />
            <OrbRingInner />
            <OrbBody>
              <span>
                <span className="orb-glow" />
                <span className="orb-dot" />
              </span>
            </OrbBody>
          </OrbWrap>

          <BannerNameBlock>
            <BannerNickname>
              {committed.nickname || "닉네임 없음"}
            </BannerNickname>
            <BannerEmailLine email={form.email} />
          </BannerNameBlock>
        </BannerLeft>

        {/* 마고 코드 */}
        <MagoCodeBlock>
          <MagoCodeLabel>내 마고 코드 (초대 ID)</MagoCodeLabel>
          <MagoCodeRow>
            <MagoCodeText>{form.uid}</MagoCodeText>
            <CopyButton type="button" $copied={copied} onClick={handleCopy}>
              {copied ? (
                <>
                  <Check size={11} />
                  완료
                </>
              ) : (
                <>
                  <Copy size={11} />
                  복사
                </>
              )}
            </CopyButton>
          </MagoCodeRow>
        </MagoCodeBlock>
      </BannerCard>
      </MobileBannerSection>

      {/* 데스크톱 헤더 */}
      <ProfileHeaderRow>
        <TitleGroup>
          <ProfileTitle>
            <UserCog size={20} />
            프로필 설정
          </ProfileTitle>
          <ProfileSubtitle>
            <ProfilePageSubtitle />
          </ProfileSubtitle>
        </TitleGroup>
        {committed.lastSync && (
          <LastSyncBadge>Last Sync: {committed.lastSync}</LastSyncBadge>
        )}
      </ProfileHeaderRow>

      {/* 본문 폼 */}
      <form onSubmit={handleSubmit}>
        <SettingsPanel>
          <SettingsColumns>
            {/* ────── 왼쪽: 운세 맞춤 설정 ────── */}
            <SettingsColumn>
              <PanelTitle>✦ 운세 맞춤 설정</PanelTitle>

              {/* 성별 */}
              <FieldGroup>
                <FieldLabel>성별</FieldLabel>
                <GenderGrid>
                  {GENDER_OPTIONS.map((g) => (
                    <GenderBtn
                      key={g}
                      type="button"
                      $active={form.gender === g}
                      onClick={() => handleField("gender", g)}
                    >
                      {g}
                    </GenderBtn>
                  ))}
                </GenderGrid>
              </FieldGroup>

              {/* 생년월일 */}
              <FieldGroup>
                <FieldLabelRow>
                  <FieldLabel>
                    <Calendar size={13} color="#3949ab99" />
                    생년월일
                  </FieldLabel>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={form.noBirthDate}
                      onChange={(e) =>
                        handleField("noBirthDate", e.target.checked)
                      }
                    />
                    선택 안 함
                  </CheckboxLabel>
                </FieldLabelRow>
                <BirthDateField
                  value={
                    form.noBirthDate
                      ? ""
                      : `${form.birthYear}-${String(form.birthMonth).padStart(2, "0")}-${String(form.birthDay).padStart(2, "0")}`
                  }
                  onChange={(dateStr) => {
                    if (!dateStr) return;
                    const [y, m, d] = dateStr.split("-");
                    setForm((prev) => ({
                      ...prev,
                      birthYear: Number(y),
                      birthMonth: Number(m),
                      birthDay: Number(d),
                    }));
                  }}
                  disabled={form.noBirthDate}
                />
              </FieldGroup>

              {/* 태어난 시간 */}
              <FieldGroup>
                <FieldLabelRow>
                  <FieldLabel>
                    <Clock size={13} color="#3949ab99" />
                    태어난 시간
                  </FieldLabel>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={form.noBirthTime}
                      onChange={(e) =>
                        handleField("noBirthTime", e.target.checked)
                      }
                    />
                    선택 안 함
                  </CheckboxLabel>
                </FieldLabelRow>
                <BirthTimeField
                  value={
                    form.noBirthTime
                      ? ""
                      : `${String(form.birthHour).padStart(2, "0")}:${String(form.birthMinute).padStart(2, "0")}`
                  }
                  onChange={(timeStr) => {
                    if (!timeStr) return;
                    const [h, m] = timeStr.split(":");
                    setForm((prev) => ({
                      ...prev,
                      birthHour: Number(h),
                      birthMinute: Number(m),
                    }));
                  }}
                  disabled={form.noBirthTime}
                />
              </FieldGroup>
            </SettingsColumn>

            <PanelDivider />

            {/* ────── 오른쪽: 일반 계정 설정 ────── */}
            <SettingsColumn>
              <PanelTitle $accent="#3949ab">✦ 일반 계정 설정</PanelTitle>

              {/* 닉네임 */}
              <FieldGroup>
                <FieldLabelRow>
                  <FieldLabel>닉네임</FieldLabel>
                  <FieldHint>최대 {MAX_NICKNAME_LENGTH}자</FieldHint>
                </FieldLabelRow>
                <DarkInput
                  type="text"
                  placeholder="서비스에서 사용할 이름을 지어주세요"
                  maxLength={MAX_NICKNAME_LENGTH}
                  value={form.nickname}
                  onChange={(e) => handleField("nickname", e.target.value)}
                />
              </FieldGroup>

              {/* 현재 비밀번호 */}
              <FieldGroup>
                <FieldLabelRow>
                  <FieldLabel>현재 비밀번호</FieldLabel>
                  <FieldHint>비밀번호 변경 시에만 입력</FieldHint>
                </FieldLabelRow>
                <PasswordFieldWrap>
                  <DarkInput
                    as="input"
                    type={showCurrentPw ? "text" : "password"}
                    placeholder="기존 비밀번호를 먼저 입력해 주세요"
                    value={form.currentPassword}
                    onChange={(e) =>
                      handleField("currentPassword", e.target.value)
                    }
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <EyeBtn
                    type="button"
                    onClick={() => setShowCurrentPw((v) => !v)}
                  >
                    {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </EyeBtn>
                </PasswordFieldWrap>
              </FieldGroup>

              {/* 새 비밀번호 */}
              <FieldGroup>
                <FieldLabelRow>
                  <FieldLabel>새 비밀번호</FieldLabel>
                  <FieldHint>
                    변경할 때만 입력 ({PASSWORD_MIN_LENGTH}자↑ 영문+숫자)
                  </FieldHint>
                </FieldLabelRow>
                <PasswordFieldWrap>
                  <DarkInput
                    as="input"
                    type={showNewPw ? "text" : "password"}
                    placeholder={`${PASSWORD_MIN_LENGTH}자 이상, 영문과 숫자 포함`}
                    value={form.newPassword}
                    onChange={(e) => handleField("newPassword", e.target.value)}
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <EyeBtn type="button" onClick={() => setShowNewPw((v) => !v)}>
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </EyeBtn>
                </PasswordFieldWrap>
              </FieldGroup>

              {/* 서비스 환경 언어 — draft, 설정 완료 시 저장 */}
              <FieldGroup>
                <FieldLabel>서비스 환경 언어</FieldLabel>
                <LanguageSwitcher
                  variant="form"
                  value={form.language as LanguageCode}
                  onChange={(code) => handleField("language", code)}
                  showToast={false}
                />
              </FieldGroup>

              {/* 저장 / 초기화 */}
              <FormFooter>
                <ResetBtn type="button" onClick={handleReset}>
                  <RefreshCw size={13} />
                  초기화
                </ResetBtn>
                <SaveBtn type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <RefreshCw
                        size={13}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      설정 완료
                    </>
                  )}
                </SaveBtn>
              </FormFooter>
            </SettingsColumn>
          </SettingsColumns>
        </SettingsPanel>
      </form>
    </ProfileRoot>
  );
}
