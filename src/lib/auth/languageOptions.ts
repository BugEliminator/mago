import type { LanguageCode } from "@/stores/languageStore";

export type LanguageOption = {
  code: LanguageCode;
  name: string;
  isAvailable: boolean;
};

/** 지원 언어 목록 — 헤더·프로필 공용 */
export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { code: "ko", name: "한국어", isAvailable: true },
  { code: "en", name: "English", isAvailable: false },
  { code: "ja", name: "日本語", isAvailable: false },
  { code: "zh-CN", name: "简体中文", isAvailable: false },
  { code: "zh-TW", name: "繁體中文", isAvailable: false },
];

/** 선택 가능한 언어인지 */
export function isLanguageAvailable(code: LanguageCode): boolean {
  return (
    LANGUAGE_OPTIONS.find((option) => option.code === code)?.isAvailable ??
    false
  );
}

/** 미지원 언어는 한국어로 폴백 */
export function resolveAvailableLanguage(code: LanguageCode): LanguageCode {
  return isLanguageAvailable(code) ? code : "ko";
}

/** 코드 → 표시명 */
export function getLanguageDisplayName(code: LanguageCode): string {
  return LANGUAGE_OPTIONS.find((o) => o.code === code)?.name ?? code;
}
