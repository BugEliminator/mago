/** 마이페이지 소셜 연동 제공자 — 구글·애플은 나중에 같은 줄에 추가 */
export type SocialLinkProviderId = "kakao" | "google" | "apple";

export type SocialLinkProvider = {
  id: SocialLinkProviderId;
  actionLabel: string;
  linkedLabel: string;
};

/** 1차에 노출하는 연동 버튼 */
export const PROFILE_SOCIAL_LINK_PROVIDERS: readonly SocialLinkProvider[] = [
  {
    id: "kakao",
    actionLabel: "카카오 연동하기",
    linkedLabel: "카카오 연동 완료",
  },
];
