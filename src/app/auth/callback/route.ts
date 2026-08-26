import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import {
  resolveSocialNickname,
  userHasKakaoIdentity,
  type SocialIdentity,
} from "@/lib/auth/socialNickname";
import { parseOAuthCallbackNext } from "@/lib/auth/oauthCallbackNext";
import { mapSocialLinkErrorMessage } from "@/lib/auth/mapSocialLinkError";
import { completeSignupProfile } from "@/lib/server/completeSignupProfile";
import { resolveKakaoLoginByExistingEmail } from "@/lib/server/linkKakaoIdentityToExistingProfile";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

/**
 * OAuth·이메일 인증 콜백 — PKCE code를 쿠키의 verifier로 교환한 뒤 리다이렉트.
 * 클라이언트 page에서 교환하면 verifier를 못 찾는 경우가 있어 Route Handler로 처리한다.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const baseUrl = resolveAuthCallbackBaseUrl(request, requestUrl.origin);
  const nextPath = parseOAuthCallbackNext(requestUrl.searchParams.get("next"));
  const errorRedirectBase =
    nextPath != null ? `${baseUrl}${nextPath}` : `${baseUrl}/login`;

  const oauthErrorRaw = [
    requestUrl.searchParams.get("error_code"),
    requestUrl.searchParams.get("error_description"),
    requestUrl.searchParams.get("error"),
  ]
    .filter((value): value is string => value != null && value.trim().length > 0)
    .join(" ");

  if (code == null || code.length === 0) {
    if (nextPath != null) {
      if (oauthErrorRaw.length > 0) {
        return NextResponse.redirect(
          `${baseUrl}${nextPath}?error=${encodeURIComponent(mapSocialLinkErrorMessage(oauthErrorRaw))}`,
        );
      }
      return NextResponse.redirect(`${baseUrl}${nextPath}`);
    }
    return NextResponse.redirect(`${baseUrl}/login`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (supabaseUrl == null || anonKey == null) {
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent("Supabase 설정이 없습니다.")}`,
    );
  }

  const pendingCookies: CookieToSet[] = [];

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookieOptions: {
      path: "/",
      sameSite: "lax",
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((cookie) => {
          pendingCookies.push(cookie);
        });
      },
    },
  });

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError != null) {
    return redirectWithCookies(
      `${errorRedirectBase}?error=${encodeURIComponent(mapSocialLinkErrorMessage(exchangeError.message))}`,
      pendingCookies,
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError != null) {
    return redirectWithCookies(
      `${errorRedirectBase}?error=${encodeURIComponent(userError.message)}`,
      pendingCookies,
    );
  }

  if (user == null) {
    return redirectWithCookies(`${baseUrl}/login`, pendingCookies);
  }

  /** 카카오 로그인 — 같은 메일이면 기존 MAGO에 붙이고, 없으면 새 회원(프로필 메일 비움) */
  if (userHasKakaoIdentity(user.identities)) {
    const kakaoNext = await resolveKakaoLoginByExistingEmail({
      user,
      sessionClient: supabase,
    });

    if (kakaoNext.status === "error") {
      return redirectWithCookies(
        `${errorRedirectBase}?error=${encodeURIComponent(mapSocialLinkErrorMessage(kakaoNext.message))}`,
        pendingCookies,
      );
    }

    if (kakaoNext.status === "no_match") {
      const signup = await completeSignupProfile({
        userId: user.id,
        email: null,
        nickname: resolveSocialNickname({
          userMetadata: toMetadataRecord(user.user_metadata),
          identities: toNicknameIdentities(user),
        }),
        createIfMissing: true,
      });
      if (!signup.ok) {
        return redirectWithCookies(
          `${errorRedirectBase}?error=${encodeURIComponent(signup.message)}`,
          pendingCookies,
        );
      }
    }
  }

  if (nextPath != null && userHasKakaoIdentity(user.identities)) {
    return redirectWithCookies(
      `${baseUrl}${nextPath}?linked=kakao`,
      pendingCookies,
    );
  }

  if (nextPath != null) {
    return redirectWithCookies(`${baseUrl}${nextPath}`, pendingCookies);
  }

  return redirectWithCookies(`${baseUrl}/`, pendingCookies);
}

/** 로컬은 origin, 배포는 프록시 호스트를 우선 */
function resolveAuthCallbackBaseUrl(
  request: NextRequest,
  origin: string,
): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (process.env.NODE_ENV === "development") {
    return origin;
  }
  if (forwardedHost != null && forwardedHost.length > 0) {
    return `https://${forwardedHost}`;
  }
  return origin;
}

function toMetadataRecord(value: unknown): Record<string, unknown> {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  const record: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    record[key] = entry;
  }
  return record;
}

function toNicknameIdentities(user: User): SocialIdentity[] {
  if (user.identities == null) return [];
  return user.identities.map((identity) => ({
    provider: identity.provider,
    identity_data: toMetadataRecord(identity.identity_data),
  }));
}

/** 세션·verifier 쿠키를 302 응답에 붙인다 */
function redirectWithCookies(
  url: string,
  cookiesToSet: readonly CookieToSet[],
): NextResponse {
  const response = NextResponse.redirect(url);
  cookiesToSet.forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  });
  return response;
}
