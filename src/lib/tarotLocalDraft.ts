import type { SetupStep } from "@/components/tarot/setup/SetupStepHeader";
import {
  isTarotGuestBrowseActive,
  setTarotGuestBrowseActive,
} from "@/lib/tarotGuestBrowse";
import {
  LEGACY_TAROT_READING_SETUP_STORAGE_KEY,
  LEGACY_TAROT_SETUP_WIZARD_STORAGE_KEY,
  tarotReadingSetupStorageKeyForUser,
  tarotWizardStorageKeyForUser,
  TAROT_READING_SETUP_KEY_PREFIX,
  TAROT_WIZARD_STORAGE_KEY_PREFIX,
} from "@/lib/tarotLocalDraftKeys";
import {
  isCompleteTarotSessionSetup,
  isFormDataShape,
  isWizardProgressBeyondInitial,
  parseTarotWizardPersistRaw,
} from "@/lib/tarotSetupWizardDraft";
import {
  TAROT_SETUP_WIZARD_STORAGE_KEY,
  TAROT_WIZARD_INITIAL_FORM,
  useTarotSetupStore,
} from "@/stores/tarotSetupStore";
import type { TarotSessionSetup } from "@/types/tarot";

export { setTarotGuestBrowseActive, isTarotGuestBrowseActive };

/** 리딩 setup localStorage 키 접두사 (re-export) */
export const TAROT_READING_SETUP_STORAGE_KEY = TAROT_READING_SETUP_KEY_PREFIX;

export type TarotReadingSetupEnvelope = {
  ownerUserId: string;
  setup: TarotSessionSetup;
};

/** tarotSetup envelope 파싱 — owner 없는 레거시는 null */
export function parseTarotReadingSetupEnvelope(
  raw: string,
): TarotReadingSetupEnvelope | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const o = parsed as Record<string, unknown>;
    if (
      typeof o.ownerUserId === "string" &&
      o.ownerUserId.length > 0 &&
      isFormDataShape(o.setup)
    ) {
      return { ownerUserId: o.ownerUserId, setup: o.setup };
    }
    return null;
  } catch {
    return null;
  }
}

/** 레거시 단일 키 → 유저별 키로 이전 (owner 일치 시) */
function migrateLegacyWizardRawIfOwned(
  userId: string,
): string | null {
  try {
    const legacy = localStorage.getItem(LEGACY_TAROT_SETUP_WIZARD_STORAGE_KEY);
    if (legacy == null) return null;
    const parsed = parseTarotWizardPersistRaw(legacy);
    if (parsed == null || parsed.ownerUserId !== userId) return null;
    const userKey = tarotWizardStorageKeyForUser(userId);
    localStorage.setItem(userKey, legacy);
    localStorage.removeItem(LEGACY_TAROT_SETUP_WIZARD_STORAGE_KEY);
    return legacy;
  } catch {
    return null;
  }
}

function migrateLegacyReadingSetupRawIfOwned(
  userId: string,
): string | null {
  try {
    const legacy = localStorage.getItem(LEGACY_TAROT_READING_SETUP_STORAGE_KEY);
    if (legacy == null) return null;
    const envelope = parseTarotReadingSetupEnvelope(legacy);
    if (envelope == null || envelope.ownerUserId !== userId) return null;
    const userKey = tarotReadingSetupStorageKeyForUser(userId);
    localStorage.setItem(userKey, legacy);
    localStorage.removeItem(LEGACY_TAROT_READING_SETUP_STORAGE_KEY);
    return legacy;
  } catch {
    return null;
  }
}

function readWizardPersistRawForUser(userId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const userKey = tarotWizardStorageKeyForUser(userId);
    const direct = localStorage.getItem(userKey);
    if (direct != null) return direct;
    return migrateLegacyWizardRawIfOwned(userId);
  } catch {
    return null;
  }
}

function readReadingSetupRawForUser(userId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const userKey = tarotReadingSetupStorageKeyForUser(userId);
    const direct = localStorage.getItem(userKey);
    if (direct != null) return direct;
    return migrateLegacyReadingSetupRawIfOwned(userId);
  } catch {
    return null;
  }
}

/** 로그인 유저와 일치하는 결제 완료 setup */
export function readTarotReadingSetupForUser(
  userId: string,
): TarotSessionSetup | null {
  const raw = readReadingSetupRawForUser(userId);
  if (raw == null) return null;
  const envelope = parseTarotReadingSetupEnvelope(raw);
  if (envelope == null || envelope.ownerUserId !== userId) return null;
  if (!isCompleteTarotSessionSetup(envelope.setup)) return null;
  return envelope.setup;
}

export function hasTarotReadingSetupPendingForUser(userId: string): boolean {
  return readTarotReadingSetupForUser(userId) !== null;
}

/** 결제 완료 setup 저장 — 해당 유저 키만 갱신 */
export function writeTarotReadingSetupForUser(
  userId: string,
  setup: TarotSessionSetup,
): void {
  if (typeof window === "undefined") return;
  const envelope: TarotReadingSetupEnvelope = { ownerUserId: userId, setup };
  localStorage.setItem(
    tarotReadingSetupStorageKeyForUser(userId),
    JSON.stringify(envelope),
  );
}

/** wizard persist raw — 해당 유저 키만 */
export function readWizardDraftForUser(userId: string): {
  step: SetupStep;
  formData: TarotSessionSetup;
} | null {
  const raw = readWizardPersistRawForUser(userId);
  if (raw == null) return null;
  const parsed = parseTarotWizardPersistRaw(raw);
  if (parsed == null || parsed.ownerUserId !== userId) return null;
  return { step: parsed.step, formData: parsed.formData };
}

export function hasMeaningfulTarotWizardDraftForUser(userId: string): boolean {
  const draft = readWizardDraftForUser(userId);
  if (draft == null) return false;
  return isWizardProgressBeyondInitial(draft.step, draft.formData);
}

export function getTarotWizardResumeStepForUser(
  userId: string,
): SetupStep | null {
  const draft = readWizardDraftForUser(userId);
  if (draft == null) return null;
  if (!isWizardProgressBeyondInitial(draft.step, draft.formData)) return null;
  return draft.step;
}

/**
 * 로그인 유저 기준 메모리 스토어 동기화
 * — 해당 유저 키만 읽고, 없으면 메모리만 초기화(다른 유저 LS는 유지)
 */
export function applyWizardDraftForUser(userId: string): void {
  const draft = readWizardDraftForUser(userId);
  if (draft != null) {
    useTarotSetupStore.setState({
      ownerUserId: userId,
      step: draft.step,
      formData: draft.formData,
    });
    return;
  }
  useTarotSetupStore.setState({
    ownerUserId: userId,
    step: 1,
    formData: { ...TAROT_WIZARD_INITIAL_FORM },
  });
}

/** 로그아웃 — 메모리만 비움, 유저별 localStorage는 유지 */
export function clearWizardStoreMemoryOnly(): void {
  useTarotSetupStore.setState({
    ownerUserId: null,
    step: 1,
    formData: { ...TAROT_WIZARD_INITIAL_FORM },
  });
}

/** 해당 유저 리딩·마법사 localStorage + 메모리 초기화 */
export function clearTarotReadingLocalDraft(userId?: string): void {
  if (typeof window === "undefined") return;

  const resolvedUserId =
    userId ?? useTarotSetupStore.getState().ownerUserId ?? null;

  useTarotSetupStore.setState({
    ownerUserId: resolvedUserId,
    step: 1,
    formData: { ...TAROT_WIZARD_INITIAL_FORM },
  });

  try {
    if (resolvedUserId != null) {
      localStorage.removeItem(tarotWizardStorageKeyForUser(resolvedUserId));
      localStorage.removeItem(
        tarotReadingSetupStorageKeyForUser(resolvedUserId),
      );
      return;
    }
    localStorage.removeItem(LEGACY_TAROT_READING_SETUP_STORAGE_KEY);
    localStorage.removeItem(LEGACY_TAROT_SETUP_WIZARD_STORAGE_KEY);
  } catch {
    // storage 접근 불가 환경 무시
  }
}

/** 인증 유저 전환 */
export function syncTarotLocalDraftOnAuthChange(
  nextUserId: string | null,
): void {
  if (typeof window === "undefined") return;
  if (nextUserId == null) {
    clearWizardStoreMemoryOnly();
    return;
  }
  if (isTarotGuestBrowseActive()) return;
  applyWizardDraftForUser(nextUserId);
}
