import type { ProfileExtraFields } from "@/types";

/** 로컬스토리지 — 계정별 "추가 정보 모달 다시 보지 않기" */
const NEVER_AGAIN_PREFIX = "mago.profileExtra.neverAgain:" as const;

/** 다시 보지 않기 플래그 저장 키 */
export function profileExtraNeverAgainKey(userId: string): string {
  return `${NEVER_AGAIN_PREFIX}${userId}`;
}

/** 다시 보지 않기 여부 */
export function readProfileExtraNeverAgain(userId: string): boolean {
  try {
    return localStorage.getItem(profileExtraNeverAgainKey(userId)) === "1";
  } catch {
    return false;
  }
}

/** 다시 보지 않기 저장 */
export function writeProfileExtraNeverAgain(userId: string): void {
  localStorage.setItem(profileExtraNeverAgainKey(userId), "1");
}

/**
 * 성별·생년월일·출생 시각 중 하나라도 있으면 추가 정보 유도 모달을 띄우지 않음
 * (일부만 저장한 경우·마이페이지에서 입력한 경우 포함)
 */
export function profileHasAnyExtraInfo(
  row: Pick<ProfileExtraFields, "gender" | "birth_date" | "born_time"> | null
): boolean {
  if (!row) {
    return false;
  }
  const genderTrimmed = row.gender?.trim();
  if (genderTrimmed !== undefined && genderTrimmed.length > 0) {
    return true;
  }
  if (row.birth_date != null && row.birth_date.length > 0) {
    return true;
  }
  if (row.born_time != null && row.born_time.length > 0) {
    return true;
  }
  return false;
}
