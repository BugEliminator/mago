/**
 * 프로젝트 전역 타입 정의
 */

// 테마 타입 (lib/theme.ts에서 re-export)
export type { Theme } from "@/lib/theme";

// 타로 관련 타입 (types/tarot.ts에서 re-export)
export * from "./tarot";

// 사용자 타입 (향후 확장 가능)
export interface User {
  id: string;
  email?: string;
  name?: string;
  createdAt: string;
}

// 타로 카드 타입 (향후 확장 가능)
export interface TarotCard {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  meaning?: string;
  reversed?: boolean;
}

// 타로 리딩 결과 타입 (향후 확장 가능)
export interface TarotReading {
  id: string;
  userId: string;
  cards: TarotCard[];
  question?: string;
  interpretation?: string;
  createdAt: string;
}
