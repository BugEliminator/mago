import TarotSetupPage from "@/components/tarot/setup/page";
import type { SetupStep } from "@/components/tarot/setup/SetupStepHeader";

type TarotSetupRoutePageProps = {
  searchParams?: Promise<{
    step?: string;
    browse?: string;
  }>;
};

function parseInitialStep(step?: string): SetupStep {
  const parsed = Number(step);
  return parsed === 1 || parsed === 2 || parsed === 3 ? parsed : 1;
}

/**
 * 타로 설정 라우트 — 실제 인터랙션은 클라이언트 컴포넌트에 위임합니다.
 */
export default async function TarotSetupRoutePage({
  searchParams,
}: TarotSetupRoutePageProps) {
  const params = await searchParams;
  return (
    <TarotSetupPage
      initialStep={parseInitialStep(params?.step)}
      initialBrowse={params?.browse === "1"}
    />
  );
}
