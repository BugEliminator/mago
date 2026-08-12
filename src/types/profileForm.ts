import type { LanguageCode } from "@/stores/languageStore";

/**
 * 프로필 설정 폼 타입 — Supabase profiles 테이블 대응
 * (gender: UI 한글값, DB는 male/female/null 변환)
 */
export type ProfileForm = {
  /** profiles.id — 마고 코드(초대 ID) 표시용 */
  uid: string;
  nickname: string;
  email: string;
  gender: "남성" | "여성" | "선택 안 함";
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  noBirthDate: boolean;
  birthHour: number;
  birthMinute: number;
  noBirthTime: boolean;
  /** profiles.language */
  language: LanguageCode;
  /** 비밀번호 입력 (폼 로컬 전용, DB 저장 안 함) */
  currentPassword: string;
  newPassword: string;
  /** profiles.updated_at 포맷 표시용 */
  lastSync: string;
};

/** 폼 초기 빈 상태 (서버 prefetch 실패 시 fallback) */
export const PROFILE_EMPTY_FORM: ProfileForm = {
  uid: "",
  nickname: "",
  email: "",
  gender: "선택 안 함",
  birthYear: 1990,
  birthMonth: 1,
  birthDay: 1,
  noBirthDate: true,
  birthHour: 0,
  birthMinute: 0,
  noBirthTime: true,
  language: "ko",
  currentPassword: "",
  newPassword: "",
  lastSync: "",
};
