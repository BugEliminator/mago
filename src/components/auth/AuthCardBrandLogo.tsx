import Image from "next/image";
import { CardBrandLogoWrap } from "@/components/auth/AuthScreen.style";

/** 인증 카드 상단 MAGO 워드마크 */
export default function AuthCardBrandLogo() {
  return (
    <CardBrandLogoWrap>
      <Image
        src="/logo.png"
        alt="MAGO"
        width={132}
        height={44}
        priority
        draggable={false}
      />
    </CardBrandLogoWrap>
  );
}
