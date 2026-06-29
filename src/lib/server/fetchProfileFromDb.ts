import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import { PROFILE_EMPTY_FORM } from "@/components/mypage/profile/profileMockData";
import type { ProfileForm } from "@/components/mypage/profile/profileMockData";
import { resolveAvailableLanguage } from "@/lib/languageOptions";
import type { LanguageCode } from "@/stores/languageStore";

const VALID_LANG_CODES: readonly LanguageCode[] = [
  "ko",
  "en",
  "ja",
  "zh-CN",
  "zh-TW",
];

function isValidLanguageCode(val: unknown): val is LanguageCode {
  return (
    typeof val === "string" &&
    (VALID_LANG_CODES as readonly string[]).includes(val)
  );
}

/** DB gender(male/female/null) → UI 한글 표시값 */
function toGenderLabel(
  dbGender: string | null,
): ProfileForm["gender"] {
  if (dbGender === "male") return "남성";
  if (dbGender === "female") return "여성";
  return "선택 안 함";
}

/** DB birth_date("YYYY-MM-DD") → { year, month, day } */
function parseBirthDate(
  dateStr: string | null,
): { birthYear: number; birthMonth: number; birthDay: number; noBirthDate: boolean } {
  if (!dateStr) {
    return {
      birthYear: PROFILE_EMPTY_FORM.birthYear,
      birthMonth: PROFILE_EMPTY_FORM.birthMonth,
      birthDay: PROFILE_EMPTY_FORM.birthDay,
      noBirthDate: true,
    };
  }
  const [y, m, d] = dateStr.split("-").map(Number);
  return { birthYear: y, birthMonth: m, birthDay: d, noBirthDate: false };
}

/** DB born_time("HH:MM:SS") → { hour, minute } */
function parseBornTime(
  timeStr: string | null,
): { birthHour: number; birthMinute: number; noBirthTime: boolean } {
  if (!timeStr) {
    return { birthHour: 0, birthMinute: 0, noBirthTime: true };
  }
  const [h, m] = timeStr.split(":").map(Number);
  return { birthHour: h, birthMinute: m, noBirthTime: false };
}

/** DB updated_at → "YYYY.MM.DD" */
function formatLastSync(updatedAt: string | null): string {
  if (!updatedAt) return "";
  const d = new Date(updatedAt);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

type ProfileRow = {
  id: string;
  nickname: string | null;
  email: string | null;
  gender: string | null;
  birth_date: string | null;
  born_time: string | null;
  language: string | null;
  updated_at: string | null;
};

/**
 * profiles 테이블 SELECT → ProfileForm 변환
 * Server Component / Route Handler 전용 (admin client)
 */
export async function fetchProfileFromDb(
  userId: string,
): Promise<ProfileForm | null> {
  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch {
    return null;
  }

  const { data, error } = await admin
    .from("profiles")
    .select("id, nickname, email, gender, birth_date, born_time, language, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error != null || data == null) {
    console.error("[fetchProfileFromDb]", error?.message);
    return null;
  }

  const row = data as ProfileRow;
  const { birthYear, birthMonth, birthDay, noBirthDate } = parseBirthDate(row.birth_date);
  const { birthHour, birthMinute, noBirthTime } = parseBornTime(row.born_time);

  return {
    uid: row.id,
    nickname: row.nickname ?? "",
    email: row.email ?? "",
    gender: toGenderLabel(row.gender),
    birthYear,
    birthMonth,
    birthDay,
    noBirthDate,
    birthHour,
    birthMinute,
    noBirthTime,
    language: isValidLanguageCode(row.language)
      ? resolveAvailableLanguage(row.language)
      : "ko",
    currentPassword: "",
    newPassword: "",
    lastSync: formatLastSync(row.updated_at),
  };
}

/** UI 한글 성별 → DB 저장값 */
export function toGenderDb(
  label: ProfileForm["gender"],
): string | null {
  if (label === "남성") return "male";
  if (label === "여성") return "female";
  return null;
}
