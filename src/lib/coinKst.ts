const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 현재 시각 기준 KST 달력 날짜 "YYYY-MM-DD" */
export function getKstDateString(date: Date = new Date()): string {
  const kst = new Date(date.getTime() + KST_OFFSET_MS);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kst.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** KST 해당일 00:00 ~ 익일 00:00 (UTC ISO 문자열) — coin_histories 일별 조회용 */
export function getKstDayBoundsUtc(date: Date = new Date()): {
  startIso: string;
  endIso: string;
} {
  const kstDate = getKstDateString(date);
  const start = new Date(`${kstDate}T00:00:00+09:00`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

/** 이용 내역 표시용 — KST "YYYY.MM.DD HH:MM" */
export function formatCoinHistoryDateLabel(iso: string): string {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? "";

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");

  return `${year}.${month}.${day} ${hour}:${minute}`;
}
