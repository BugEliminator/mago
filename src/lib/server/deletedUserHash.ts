import { createHmac } from "crypto";
import {
  DELETED_USER_SIGNUP_COOLDOWN_MS,
  normalizeSignupEmail,
} from "@/lib/deletedUserCooldown";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export type SaveDeletedUserHashResult =
  | { ok: true }
  | { ok: false; code: "ENV_MISSING" | "DB_ERROR"; message: string };

export type DeletedUserSignupCooldownResult =
  | { blocked: false }
  | { blocked: true; daysUntilEligible: number };

function getEmailHashSecret(): string {
  const explicit = process.env.DELETED_USERS_HASH_SECRET?.trim();
  if (explicit != null && explicit.length > 0) return explicit;
  const fallback = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (fallback != null && fallback.length > 0) return fallback;
  throw new Error(
    "DELETED_USERS_HASH_SECRET 또는 SUPABASE_SERVICE_ROLE_KEY가 필요합니다.",
  );
}

/** 탈퇴 이메일 HMAC-SHA256 해시 */
export function hashEmailForDeletedUsers(email: string): string {
  const normalized = normalizeSignupEmail(email);
  return createHmac("sha256", getEmailHashSecret())
    .update(normalized)
    .digest("hex");
}

/** 탈퇴 완료 후 deleted_users_hash 적재 */
export async function saveDeletedUserEmailHash(
  email: string,
): Promise<SaveDeletedUserHashResult> {
  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return { ok: false, code: "DB_ERROR", message: "탈퇴 이메일이 없습니다." };
  }

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase Admin 설정 오류";
    return { ok: false, code: "ENV_MISSING", message };
  }

  let emailHash: string;
  try {
    emailHash = hashEmailForDeletedUsers(trimmed);
  } catch (e) {
    const message = e instanceof Error ? e.message : "이메일 해시 설정 오류";
    return { ok: false, code: "ENV_MISSING", message };
  }

  const { error } = await admin.from("deleted_users_hash").insert({
    email_hash: emailHash,
  });

  if (error != null) {
    return {
      ok: false,
      code: "DB_ERROR",
      message: `탈퇴 이메일 해시 저장 실패: ${error.message}`,
    };
  }

  return { ok: true };
}

/** 만료(14일 경과) 해시 row 정리 — 조회 시 부수 처리 */
async function purgeExpiredDeletedUserHashes(): Promise<void> {
  try {
    const admin = createSupabaseAdmin();
    const cutoff = new Date(
      Date.now() - DELETED_USER_SIGNUP_COOLDOWN_MS,
    ).toISOString();
    await admin.from("deleted_users_hash").delete().lt("created_at", cutoff);
  } catch {
    // 정리 실패는 가입 판별에 영향 없음
  }
}

/**
 * 탈퇴 쿨다운 중이면 남은 일수 반환
 * 14일이 지났으면 blocked: false (별도 안내 없이 가입 가능)
 */
export async function checkDeletedUserSignupCooldown(
  email: string,
): Promise<DeletedUserSignupCooldownResult> {
  const trimmed = email.trim();
  if (trimmed.length === 0) return { blocked: false };

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch {
    return { blocked: false };
  }

  await purgeExpiredDeletedUserHashes();

  let emailHash: string;
  try {
    emailHash = hashEmailForDeletedUsers(trimmed);
  } catch {
    return { blocked: false };
  }

  const { data, error } = await admin
    .from("deleted_users_hash")
    .select("created_at")
    .eq("email_hash", emailHash)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error != null || data?.created_at == null) {
    return { blocked: false };
  }

  const createdAtMs = new Date(data.created_at).getTime();
  if (Number.isNaN(createdAtMs)) return { blocked: false };

  const eligibleAtMs = createdAtMs + DELETED_USER_SIGNUP_COOLDOWN_MS;
  const nowMs = Date.now();

  if (nowMs >= eligibleAtMs) {
    return { blocked: false };
  }

  const msLeft = eligibleAtMs - nowMs;
  const daysUntilEligible = Math.ceil(msLeft / (24 * 60 * 60 * 1000));

  return {
    blocked: true,
    daysUntilEligible: Math.max(1, daysUntilEligible),
  };
}

/** 탈퇴 직전 이메일 — auth 우선, 없으면 profiles */
export async function resolveWithdrawUserEmail(input: {
  userId: string;
  authEmail: string | null | undefined;
}): Promise<string | null> {
  const fromAuth = input.authEmail?.trim();
  if (fromAuth != null && fromAuth.length > 0) return fromAuth;

  try {
    const admin = createSupabaseAdmin();
    const { data } = await admin
      .from("profiles")
      .select("email")
      .eq("id", input.userId)
      .maybeSingle();
    const fromProfile = data?.email?.trim();
    return fromProfile != null && fromProfile.length > 0 ? fromProfile : null;
  } catch {
    return null;
  }
}
