import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export type DeleteAuthUserResult =
  | { ok: true }
  | { ok: false; code: "ENV_MISSING" | "DELETE_FAILED"; message: string };

/**
 * Supabase auth.users에서 계정 삭제 (service role)
 * — profiles 등 연관 테이블은 DB FK CASCADE 설정에 따름
 */
export async function deleteAuthUser(userId: string): Promise<DeleteAuthUserResult> {
  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase Admin 설정 오류";
    return { ok: false, code: "ENV_MISSING", message };
  }

  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error != null) {
    return {
      ok: false,
      code: "DELETE_FAILED",
      message: `계정 삭제 실패: ${error.message}`,
    };
  }

  return { ok: true };
}
