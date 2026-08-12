export type AttendanceStatusResult =
  | { ok: true; hasCheckedInToday: boolean }
  | { ok: false; error: string };

/** 클라이언트 → GET /api/coins/attendance — 오늘 출석 여부 조회 */
export async function fetchAttendanceStatusFromClient(
  accessToken: string,
): Promise<AttendanceStatusResult> {
  try {
    const res = await fetch("/api/coins/attendance", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const json: unknown = await res.json();

    if (
      typeof json !== "object" ||
      json === null ||
      !("ok" in json) ||
      typeof (json as Record<string, unknown>).ok !== "boolean"
    ) {
      return { ok: false, error: "출석 상태 응답이 올바르지 않습니다." };
    }

    const data = json as Record<string, unknown>;

    if (!data.ok) {
      return {
        ok: false,
        error: typeof data.error === "string" ? data.error : "출석 상태 조회 실패",
      };
    }

    return {
      ok: true,
      hasCheckedInToday:
        typeof data.hasCheckedInToday === "boolean"
          ? data.hasCheckedInToday
          : false,
    };
  } catch {
    return { ok: false, error: "출석 상태 조회 중 오류가 발생했습니다." };
  }
}
