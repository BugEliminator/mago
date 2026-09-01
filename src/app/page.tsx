import LandingHero from "@/components/home/LandingHero";
import DevSessionLogger from "@/components/dev/DevSessionLogger";
import ProfileExtraPromptModal from "@/components/home/ProfileExtraPromptModal";

/**
 * 메인 홈 — 히어로를 조립한다. 페이지 `<main>`은 여기서 둔다.
 */
export default function HomePage() {
  return (
    <>
      <DevSessionLogger />
      <main>
        <LandingHero />
      </main>
      <ProfileExtraPromptModal />
    </>
  );
}
