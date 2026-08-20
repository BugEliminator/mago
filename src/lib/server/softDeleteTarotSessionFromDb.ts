import { createSupabaseAdmin } from "@/lib/supabase/supabaseAdmin";
import type {
  SoftDeleteTarotSessionInput,
  SoftDeleteTarotSessionResult,
} from "@/types/tarotSessionDb";

/**
 * tarot_sessions 소프트 삭제 — 소유자만 deleted_at을 현재 시각으로 기록
 * 이미 삭제됐거나 없으면 NOT_FOUND (공개 조회와 동일하게 구분하지 않음)
 */
export async function softDeleteTarotSessionFromDb(
  input: SoftDeleteTarotSessionInput,
): Promise<SoftDeleteTarotSessionResult> {
  const { readingId, userId } = input;

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase Admin 설정 오류";
    return { ok: false, code: "ENV_MISSING", message };
  }

  const { data, error } = await admin
    .from("tarot_sessions")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", readingId)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error != null) {
    return {
      ok: false,
      code: "UPDATE_FAILED",
      message: `리딩 삭제 실패: ${error.message}`,
    };
  }

  if (data == null) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "리딩 세션을 찾을 수 없습니다.",
    };
  }

  return { ok: true };
}
