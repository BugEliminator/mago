"use client";

import { useState } from "react";
import { toast } from "sonner";
import KakaoTalkMark from "@/components/auth/KakaoTalkMark";
import { mapSocialLinkErrorMessage } from "@/lib/auth/mapSocialLinkError";
import { supabase } from "@/lib/supabase/supabaseClient";
import { PROFILE_SOCIAL_LINK_PROVIDERS } from "@/types/socialLink";
import { KakaoLinkButton, SocialLinkRow } from "./ProfilePageClient.style";

type ProfileSocialLinksProps = {
  kakaoLinked: boolean;
};

/**
 * 프로필 제목 옆 소셜 연동 — 카카오 1차, 구글·애플은 providers 배열에 추가
 */
export default function ProfileSocialLinks({
  kakaoLinked,
}: ProfileSocialLinksProps) {
  const [isKakaoLinking, setIsKakaoLinking] = useState(false);

  const handleKakaoLink = async () => {
    if (kakaoLinked || isKakaoLinking) return;
    setIsKakaoLinking(true);

    /** 로그인 중인 계정에 카카오 identity만 추가 — signInWithOAuth 금지 */
    const { error } = await supabase.auth.linkIdentity({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/mypage/profile")}`,
        scopes: "profile_nickname",
      },
    });

    if (error != null) {
      setIsKakaoLinking(false);
      toast.error(mapSocialLinkErrorMessage(error.message));
    }
  };

  return (
    <SocialLinkRow>
      {PROFILE_SOCIAL_LINK_PROVIDERS.map((provider) => {
        if (provider.id !== "kakao") return null;
        const linked = kakaoLinked;
        return (
          <KakaoLinkButton
            key={provider.id}
            type="button"
            $linked={linked}
            disabled={linked || isKakaoLinking}
            onClick={() => {
              void handleKakaoLink();
            }}
          >
            <KakaoTalkMark />
            {linked
              ? provider.linkedLabel
              : isKakaoLinking
                ? "연결 중…"
                : provider.actionLabel}
          </KakaoLinkButton>
        );
      })}
    </SocialLinkRow>
  );
}
