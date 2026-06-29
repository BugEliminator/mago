/**
 * 로컬 타임존 기준 날짜만 다룰 때 사용 (PostgreSQL `date` 문자열과 대응)
 */

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** `Date` → `YYYY-MM-DD` (로컬 달력 기준) */
export function formatDateOnlyLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** `YYYY-MM-DD` → `Date` (자정 로컬). 형식·날짜 유효성 실패 시 `undefined` */
export function parseDateOnlyLocal(s: string): Date | undefined {
  const m = ISO_DATE_RE.exec(s.trim());
  if (!m) {
    return undefined;
  }
  const y = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const d = new Date(y, month - 1, day);
  if (
    d.getFullYear() !== y ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return undefined;
  }
  return d;
}

/** 로컬 자정 기준 오늘(시간 제거 비교용) */
export function startOfTodayLocal(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}
