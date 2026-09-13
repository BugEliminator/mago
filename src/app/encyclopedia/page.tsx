import type { Metadata } from "next";
import EncyclopediaPage from "@/components/encyclopedia/EncyclopediaPage";

export const metadata: Metadata = {
  title: "타로 백과사전 | MAGO",
  description:
    "메이저·완드·컵·소드·펜타클 78장 타로 카드의 의미와 정·역방향 해석을 살펴보세요.",
};

/**
 * 타로 백과사전 라우트 — UI는 클라이언트 컴포넌트에 위임합니다.
 */
export default function EncyclopediaRoutePage() {
  return <EncyclopediaPage />;
}
