import type { SetupStep } from "@/components/tarot/setup/SetupStepHeader";
import type { TarotSessionSetup } from "@/types/tarot";
import {
  TAROT_SETUP_WIZARD_STORAGE_KEY,
  TAROT_WIZARD_INITIAL_FORM,
} from "@/stores/tarotSetupStore";

type PersistShape = {
  state?: {
    ownerUserId?: unknown;
    step?: unknown;
    formData?: unknown;
  };
  version?: unknown;
};

function isSetupStep(n: unknown): n is SetupStep {
  return n === 1 || n === 2 || n === 3;
}

/** 스텝 3 상황+질문 합산 글자 수 — setup·리딩 setup 토큰 검증과 동일 */
export const TAROT_SETUP_STEP3_MIN_TOTAL_CHARS = 30;
export const TAROT_SETUP_STEP3_MAX_TOTAL_CHARS = 300;

export function isFormDataShape(fd: unknown): fd is TarotSessionSetup {
  if (!fd || typeof fd !== "object") return false;
  const o = fd as Record<string, unknown>;
  return (
    ("category" in o && (o.category === null || typeof o.category === "string")) &&
    ("cardCount" in o &&
      (o.cardCount === null ||
        o.cardCount === 3 ||
        o.cardCount === 5 ||
        o.cardCount === 7)) &&
    typeof o.detailTag === "string" &&
    typeof o.situation === "string" &&
    typeof o.question === "string"
  );
}

/** localStorage persist JSON → owner·step·formData 파싱 */
export function parseTarotWizardPersistRaw(
  raw: string,
): { ownerUserId: string | null; step: SetupStep; formData: TarotSessionSetup } | null {
  try {
    const parsed = JSON.parse(raw) as PersistShape;
    const step = parsed.state?.step;
    const formData = parsed.state?.formData;
    const ownerRaw = parsed.state?.ownerUserId;
    if (!isSetupStep(step) || !isFormDataShape(formData)) return null;
    const ownerUserId =
      typeof ownerRaw === "string" && ownerRaw.length > 0 ? ownerRaw : null;
    return { ownerUserId, step, formData };
  } catch {
    return null;
  }
}

/** 초기 진행 상태(스텝1·기본 카드 수만)와 비교해 실제 작성 흔적이 있는지 판별 */
export function isWizardProgressBeyondInitial(
  step: SetupStep,
  formData: TarotSessionSetup,
): boolean {
  const init = TAROT_WIZARD_INITIAL_FORM;
  if (step > 1) return true;
  if (formData.category !== init.category) return true;
  if (formData.cardCount !== init.cardCount) return true;
  if (formData.detailTag.trim() !== init.detailTag) return true;
  if (formData.situation.trim() !== init.situation) return true;
  if (formData.question.trim() !== init.question) return true;
  return false;
}

/** @deprecated userId 스코프 함수 사용 — hasMeaningfulTarotWizardDraftForUser */
export function hasMeaningfulTarotWizardDraft(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(TAROT_SETUP_WIZARD_STORAGE_KEY);
    if (!raw) return false;
    const parsed = parseTarotWizardPersistRaw(raw);
    if (!parsed || parsed.ownerUserId == null) return false;
    return isWizardProgressBeyondInitial(parsed.step, parsed.formData);
  } catch {
    return false;
  }
}

/** localStorage `tarotSetup` JSON → 완료된 세션 설정인지 판별 */
export function isCompleteTarotSessionSetup(fd: TarotSessionSetup): boolean {
  if (fd.cardCount !== 3 && fd.cardCount !== 5 && fd.cardCount !== 7) {
    return false;
  }
  if (fd.category === null) return false;
  if (fd.detailTag.trim().length === 0) return false;
  const step3Total = fd.situation.length + fd.question.length;
  return (
    step3Total >= TAROT_SETUP_STEP3_MIN_TOTAL_CHARS &&
    step3Total <= TAROT_SETUP_STEP3_MAX_TOTAL_CHARS
  );
}

/** @deprecated envelope 파서 사용 */
export function parseTarotSessionSetupRaw(raw: string): TarotSessionSetup | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isFormDataShape(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** @deprecated userId 스코프 함수 사용 */
export function getTarotWizardResumeStep(): SetupStep | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TAROT_SETUP_WIZARD_STORAGE_KEY);
    if (!raw) return null;
    const parsed = parseTarotWizardPersistRaw(raw);
    if (!parsed || parsed.ownerUserId == null) return null;
    if (!isWizardProgressBeyondInitial(parsed.step, parsed.formData)) return null;
    return parsed.step;
  } catch {
    return null;
  }
}
