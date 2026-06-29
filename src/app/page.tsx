import LandingHero from "@/components/landing/LandingHero";
import DevSessionLogger from "@/components/dev/DevSessionLogger";
import ProfileExtraPromptModal from "@/components/home/ProfileExtraPromptModal";

/**
 * 메인 랜딩 페이지
 * — 클라이언트 인터랙션은 `LandingHero`에 위임
 */
export default function HomePage() {
  return (
    <>
      <DevSessionLogger />
      <LandingHero />
      <ProfileExtraPromptModal />
    </>
  );
}
