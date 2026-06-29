/** 타로 마법사 persist 키 접두사 — 실제 키는 `:{userId}` 접미 */
export const TAROT_WIZARD_STORAGE_KEY_PREFIX = "mago-tarot-setup-wizard" as const;

/** 결제 완료 setup 키 접두사 */
export const TAROT_READING_SETUP_KEY_PREFIX = "tarotSetup" as const;

/** @deprecated 레거시 단일 키 — 마이그레이션용 */
export const LEGACY_TAROT_SETUP_WIZARD_STORAGE_KEY =
  TAROT_WIZARD_STORAGE_KEY_PREFIX;

/** @deprecated 레거시 단일 키 — 마이그레이션용 */
export const LEGACY_TAROT_READING_SETUP_STORAGE_KEY =
  TAROT_READING_SETUP_KEY_PREFIX;

/** 유저별 마법사 드래프트 localStorage 키 */
export function tarotWizardStorageKeyForUser(userId: string): string {
  return `${TAROT_WIZARD_STORAGE_KEY_PREFIX}:${userId}`;
}

/** 유저별 결제 완료 setup localStorage 키 */
export function tarotReadingSetupStorageKeyForUser(userId: string): string {
  return `${TAROT_READING_SETUP_KEY_PREFIX}:${userId}`;
}
