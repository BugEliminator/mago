/**
 * 보관함 목데이터 — Supabase 연동 전 퍼블리싱용
 */

export type InventoryTab = "skins" | "personas";

export type OwnedSkin = {
  id: string;
  title: string;
  description: string;
  badge: string;
};

export type OwnedPersona = {
  id: string;
  title: string;
  description: string;
  badge: string;
  voiceDesc: string;
};

export const OWNED_SKINS: OwnedSkin[] = [
  {
    id: "skin_classic",
    title: "마고 클래식 덱",
    description:
      "기본 제공되는 우주와 성좌의 비주얼을 담은 마고 정통 오리지널 덱",
    badge: "기본 스킨",
  },
];

export const OWNED_PERSONAS: OwnedPersona[] = [
  {
    id: "persona_mago",
    title: "마고 클래식 페르소나",
    description:
      "우주의 거대한 질서와 운명을 가장 차분하고 중립적이면서도 품격 있게 풀이해 줍니다.",
    badge: "기본 말투",
    voiceDesc: "우아하고 세련된 목소리 톤",
  },
];

export const DEFAULT_EQUIPPED_SKIN_ID = "skin_classic";
export const DEFAULT_EQUIPPED_PERSONA_ID = "persona_mago";
