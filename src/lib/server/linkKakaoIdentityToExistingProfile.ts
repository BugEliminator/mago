import type { SupabaseClient, User } from "@supabase/supabase-js";
import { resolveKakaoEmail } from "@/lib/auth/socialNickname";
import { createSupabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export type KakaoEmailLinkResult =
  | { status: "already_member" }
  | { status: "linked" }
  | { status: "no_match" }
  | { status: "error"; message: string };

type ProfileEmailRow = {
  id: string;
  email: string | null;
};

/** ILIKE 정확 일치용 — %, _ 이스케이프 */
function escapeIlikeExact(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

function toIdentityData(value: unknown): Record<string, unknown> | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const record: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    record[key] = entry;
  }
  return record;
}

function toSocialIdentities(
  identities: User["identities"],
): Array<{
  provider: string;
  identity_data: Record<string, unknown> | null;
}> {
  if (identities == null) return [];
  return identities.map((identity) => ({
    provider: identity.provider,
    identity_data: toIdentityData(identity.identity_data),
  }));
}

function parseProfileEmailRows(value: unknown): ProfileEmailRow[] {
  if (!Array.isArray(value)) return [];
  const rows: ProfileEmailRow[] = [];
  for (const item of value) {
    if (item == null || typeof item !== "object") continue;
    if (!("id" in item) || typeof item.id !== "string") continue;
    const emailValue = "email" in item ? item.email : null;
    const email =
      typeof emailValue === "string" || emailValue == null ? emailValue : null;
    rows.push({ id: item.id, email });
  }
  return rows;
}

/**
 * 카카오 첫 로그인 — 같은 이메일의 기존 MAGO 회원이 있으면 identity를 붙이고
 * 세션을 그 회원으로 바꾼다. 없으면 신규 가입으로 넘긴다.
 */
export async function resolveKakaoLoginByExistingEmail(input: {
  user: User;
  sessionClient: SupabaseClient;
}): Promise<KakaoEmailLinkResult> {
  let admin: SupabaseClient;
  try {
    admin = createSupabaseAdmin();
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Supabase Admin 설정 오류";
    return { status: "error", message };
  }

  const { data: ownProfile, error: ownProfileError } = await admin
    .from("profiles")
    .select("id")
    .eq("id", input.user.id)
    .maybeSingle();

  if (ownProfileError != null) {
    return { status: "error", message: ownProfileError.message };
  }
  if (ownProfile != null) {
    return { status: "already_member" };
  }

  const kakaoEmail = resolveKakaoEmail({
    userEmail: input.user.email,
    userMetadata: toIdentityData(input.user.user_metadata),
    identities: toSocialIdentities(input.user.identities),
  });

  if (kakaoEmail == null) {
    return { status: "no_match" };
  }

  const { data: matches, error: matchError } = await admin
    .from("profiles")
    .select("id, email")
    .ilike("email", escapeIlikeExact(kakaoEmail))
    .neq("id", input.user.id)
    .limit(2);

  if (matchError != null) {
    return { status: "error", message: matchError.message };
  }

  const matchRows = parseProfileEmailRows(matches);
  if (matchRows.length === 0) {
    return { status: "no_match" };
  }
  if (matchRows.length > 1) {
    return {
      status: "error",
      message: "같은 이메일의 계정이 여러 개입니다. 이메일로 로그인해 주세요.",
    };
  }

  const targetUserId = matchRows[0].id;
  const { error: rpcError } = await admin.rpc("link_kakao_identity_to_user", {
    source_user_id: input.user.id,
    target_user_id: targetUserId,
  });

  if (rpcError != null) {
    return {
      status: "error",
      message: mapLinkRpcError(rpcError.message),
    };
  }

  const switched = await switchSessionToUser({
    admin,
    sessionClient: input.sessionClient,
    targetUserId,
    fallbackEmail: matchRows[0].email,
  });
  if (!switched.ok) {
    return { status: "error", message: switched.message };
  }

  return { status: "linked" };
}

function mapLinkRpcError(message: string): string {
  if (/could not find the function/i.test(message) || /42883/.test(message)) {
    return "카카오 계정 연결 함수가 아직 설치되지 않았습니다.";
  }
  if (/already has a kakao identity/i.test(message)) {
    return "이미 다른 카카오가 연결된 계정입니다.";
  }
  return message;
}

/** 합친 뒤 브라우저 세션을 기존 이메일 회원으로 교체 */
async function switchSessionToUser(input: {
  admin: SupabaseClient;
  sessionClient: SupabaseClient;
  targetUserId: string;
  fallbackEmail: string | null;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const {
    data: targetUserData,
    error: targetUserError,
  } = await input.admin.auth.admin.getUserById(input.targetUserId);

  if (targetUserError != null || targetUserData.user == null) {
    return {
      ok: false,
      message: targetUserError?.message ?? "기존 계정을 찾지 못했습니다.",
    };
  }

  const targetEmail =
    targetUserData.user.email?.trim() || input.fallbackEmail?.trim() || "";
  if (targetEmail.length === 0) {
    return { ok: false, message: "기존 계정에 이메일이 없습니다." };
  }

  const { data: linkData, error: linkError } =
    await input.admin.auth.admin.generateLink({
      type: "magiclink",
      email: targetEmail,
    });

  if (linkError != null || linkData.properties == null) {
    return {
      ok: false,
      message: linkError?.message ?? "기존 계정 세션을 만들지 못했습니다.",
    };
  }

  const hashedToken = linkData.properties.hashed_token;
  const emailOtp = linkData.properties.email_otp;

  const tokenHashResult = await input.sessionClient.auth.verifyOtp({
    token_hash: hashedToken,
    type: "magiclink",
  });

  if (tokenHashResult.error == null) {
    return { ok: true };
  }

  const otpResult = await input.sessionClient.auth.verifyOtp({
    email: targetEmail,
    token: emailOtp,
    type: "magiclink",
  });

  if (otpResult.error != null) {
    const emailTypeResult = await input.sessionClient.auth.verifyOtp({
      email: targetEmail,
      token: emailOtp,
      type: "email",
    });
    if (emailTypeResult.error != null) {
      return { ok: false, message: tokenHashResult.error.message };
    }
  }

  return { ok: true };
}
