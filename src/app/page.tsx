import LandingHero from "@/components/home/LandingHero";
import HomeHowToSection from "@/components/home/HomeHowToSection";
import HomeDifferenceSection from "@/components/home/HomeDifferenceSection";
import HomeFaqSection from "@/components/home/HomeFaqSection";
import DevSessionLogger from "@/components/dev/DevSessionLogger";
import ProfileExtraPromptModal from "@/components/home/ProfileExtraPromptModal";

/**
 * 메인 홈 — 히어로·사용법·차별점·FAQ 섹션을 조립한다.
 */
export default function HomePage() {
  return (
    <>
      <DevSessionLogger />
      <main>
        <LandingHero />
        <HomeHowToSection />
        <HomeDifferenceSection />
        <HomeFaqSection />
      </main>
      <ProfileExtraPromptModal />
    </>
  );
}
