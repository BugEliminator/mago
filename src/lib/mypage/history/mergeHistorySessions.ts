import type { HistoryListItem } from "@/components/mypage/history/historyTypes";

/** API 추가 로드 — id 기준 중복 제거 후 append */
export function mergeHistorySessions(
  existing: HistoryListItem[],
  incoming: HistoryListItem[],
): HistoryListItem[] {
  if (incoming.length === 0) return existing;

  const seen = new Set(existing.map((item) => item.id));
  const merged = [...existing];

  for (const item of incoming) {
    if (seen.has(item.id)) continue;
    merged.push(item);
    seen.add(item.id);
  }

  return merged;
}
