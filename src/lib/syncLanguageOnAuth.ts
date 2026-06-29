import { supabase } from "@/lib/supabaseClient";
import {
  LANGUAGE_STORE_KEY,
  useLanguageStore,
  type LanguageCode,
} from "@/stores/languageStore";
import { resolveAvailableLanguage } from "@/lib/languageOptions";

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

/** localStorage에 언어 값이 명시적으로 저장되어 있는지 확인 */
function isLanguageLocallySet(): boolean {
  try {
    return localStorage.getItem(LANGUAGE_STORE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * 로그인/가입 성공 시 언어 설정 동기화
 *
 * SIGNED_IN (로그인·가입):
 *   - localStorage에 값 있음 → DB UPDATE (로컬 우선, 게스트 선택 보존)
 *   - localStorage 없음     → DB SELECT → 스토어·localStorage SET (다른 기기 설정 복원)
 *
 * INITIAL_SESSION (페이지 진입, 기존 세션):
 *   onlyPullIfEmpty = true 로 호출 → localStorage가 비어 있을 때만 DB에서 pull
 *   (매 페이지 로드마다 DB push 하지 않도록 보호)
 */
export async function syncLanguageOnAuth(
  userId: string,
  { onlyPullIfEmpty = false }: { onlyPullIfEmpty?: boolean } = {},
): Promise<void> {
  const locallySet = isLanguageLocallySet();
  const store = useLanguageStore.getState();

  if (locallySet && !onlyPullIfEmpty) {
    /** 로컬 값 → DB push (미지원 언어는 ko) */
    await supabase
      .from("profiles")
      .update({ language: resolveAvailableLanguage(store.language) })
      .eq("id", userId);
  } else if (!locallySet) {
    /** DB 값 → 로컬 pull */
    const { data } = await supabase
      .from("profiles")
      .select("language")
      .eq("id", userId)
      .maybeSingle();

    const dbLang = (data as { language: string | null } | null)?.language;
    if (isValidLanguageCode(dbLang)) {
      store.setLanguage(resolveAvailableLanguage(dbLang));
    }
  }
}
