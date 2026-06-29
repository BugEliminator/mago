import type { ReactNode } from "react";
import { Mail } from "lucide-react";
import { BannerEmail, BannerEmailIcon, BannerEmailText } from "./ProfilePageClient.style";

type BannerEmailLineProps = {
  email: string;
  emptyLabel?: string;
};

/** @ 앞 줄바꿈 가능 지점 — 공간이 충분하면 1줄, 부족할 때만 @ 앞에서 넘김 */
function renderEmailText(email: string): ReactNode {
  const atIndex = email.indexOf("@");
  if (atIndex <= 0) return email;

  return (
    <>
      {email.slice(0, atIndex)}
      <wbr />
      {email.slice(atIndex)}
    </>
  );
}

/**
 * 프로필 배너 이메일 — Orb 옆 표시
 * 마이페이지 허브·프로필 설정 공통
 */
export default function BannerEmailLine({
  email,
  emptyLabel = "이메일 없음",
}: BannerEmailLineProps) {
  const value = email.trim();

  return (
    <BannerEmail>
      <BannerEmailIcon aria-hidden>
        <Mail size={13} color="#3949ab99" />
      </BannerEmailIcon>
      <BannerEmailText>
        {value ? renderEmailText(value) : emptyLabel}
      </BannerEmailText>
    </BannerEmail>
  );
}
