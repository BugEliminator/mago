"use client";

import { Flame, FileText, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PlayingCardsFanIcon from "./PlayingCardsFanIcon";
import {
  DifferenceCard,
  DifferenceCardBody,
  DifferenceCardTitle,
  DifferenceCardTop,
  DifferenceGrid,
  DifferenceHeader,
  DifferenceHeading,
  DifferenceIconWrap,
  DifferenceInner,
  DifferenceLead,
  DifferenceRoot,
} from "./HomeDifference.style";

type HomeDifferenceItem = {
  title: string;
  body: string;
  icon: LucideIcon;
};

const DIFFERENCE_ITEMS: readonly HomeDifferenceItem[] = [
  {
    title: "마고는 타로만 봅니다",
    body: "사주·궁합·광고가 섞인 운세 모음이 아닙니다. MAGO는 타로 리딩 한 가지에 화면을 맞춥니다. 질문부터 해석까지 그 흐름만 남깁니다.",
    icon: Flame,
  },
  {
    title: "78장의 정방향·역방향 카드들",
    body: "메이저 22장만 쓰는 앱이 많습니다. MAGO는 마이너까지 78장 전체를 쓰고, 섞을 때 카드가 뒤집히면 의미도 달라집니다. 마고는 그 방향까지 읽고 해석합니다.",
    icon: Layers,
  },
  {
    title: "직접 섞고 고릅니다",
    body: "미리 정해 둔 답을 누르는 방식이 아닙니다. 원하는 만큼 덱을 섞으면 순서와 방향이 그때 정해집니다. 펼쳐진 카드 중에서 끌리는 카드를 직접 고릅니다.",
    icon: PlayingCardsFanIcon,
  },
  {
    title: "질문 맥락을 읽습니다",
    body: "카드마다 고정 문구를 이어 붙이지 않습니다. 뽑은카드와 직접 적은 고민을 함께 보고 해석합니다. 같은 카드라도 질문의 결이 다르면 리딩도 달라집니다.",
    icon: FileText,
  },
];

/**
 * 홈 차별점 섹션 — 사용법 아래 2×2 카드로 MAGO 리딩이 다른 이유를 보여 준다
 */
export default function HomeDifferenceSection() {
  return (
    <DifferenceRoot aria-labelledby="home-difference-title">
      <DifferenceInner>
        <DifferenceHeader>
          <DifferenceHeading id="home-difference-title">
            마고의 리딩이 특별한 이유
          </DifferenceHeading>
          <DifferenceLead>
            흔한 타로 서비스나 정해진 템플릿 문장이 아닙니다. 손끝으로 직접 섞는
            78장의 카드와 적어낸 깊은 고민의 맥락을 읽어 오직 당신만을 위한
            섬세하고 입체적인 리딩을 완성합니다.
          </DifferenceLead>
        </DifferenceHeader>
        <DifferenceGrid>
          {DIFFERENCE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <DifferenceCard key={item.title}>
                <DifferenceCardTop>
                  <DifferenceIconWrap>
                    <Icon strokeWidth={1.5} aria-hidden />
                  </DifferenceIconWrap>
                  <DifferenceCardTitle>{item.title}</DifferenceCardTitle>
                </DifferenceCardTop>
                <DifferenceCardBody>{item.body}</DifferenceCardBody>
              </DifferenceCard>
            );
          })}
        </DifferenceGrid>
      </DifferenceInner>
    </DifferenceRoot>
  );
}
