/**
 * MAGO Precision Spread Config
 * 각 카테고리 파일에서 데이터를 가져와 장수별로 조립합니다.
 *
 * 수정이 필요할 때:
 *   - 포지션 텍스트(label / desc): 해당 카테고리 파일(예: love.ts)
 *   - 새 카테고리 추가: 카테고리 파일 생성 후 이 파일 "3 / 5 / 7" 세 곳에 키 추가
 */
import { LOVE_SPREAD_CONFIG } from "./love";
import { MONEY_SPREAD_CONFIG } from "./money";
import { CAREER_SPREAD_CONFIG } from "./career";
import { STUDY_SPREAD_CONFIG } from "./study";
import { HEALTH_SPREAD_CONFIG } from "./health";
import { FAMILY_SPREAD_CONFIG } from "./family";
import { TRAVEL_SPREAD_CONFIG } from "./travel";
import { DREAM_SPREAD_CONFIG } from "./dream";
import { CUSTOM_SPREAD_CONFIG } from "./custom";

export const TAROT_MASTER_CONFIG = {
  // --- 3장: '운명의 흐름' 스프레드 ---
  "3": {
    love: LOVE_SPREAD_CONFIG.spread3,
    money: MONEY_SPREAD_CONFIG.spread3,
    career: CAREER_SPREAD_CONFIG.spread3,
    study: STUDY_SPREAD_CONFIG.spread3,
    health: HEALTH_SPREAD_CONFIG.spread3,
    family: FAMILY_SPREAD_CONFIG.spread3,
    travel: TRAVEL_SPREAD_CONFIG.spread3,
    dream: DREAM_SPREAD_CONFIG.spread3,
    custom: CUSTOM_SPREAD_CONFIG.spread3,
  },

  // --- 5장: '깊은 통찰' 스프레드 ---
  "5": {
    love: LOVE_SPREAD_CONFIG.spread5,
    money: MONEY_SPREAD_CONFIG.spread5,
    career: CAREER_SPREAD_CONFIG.spread5,
    study: STUDY_SPREAD_CONFIG.spread5,
    health: HEALTH_SPREAD_CONFIG.spread5,
    family: FAMILY_SPREAD_CONFIG.spread5,
    travel: TRAVEL_SPREAD_CONFIG.spread5,
    dream: DREAM_SPREAD_CONFIG.spread5,
    custom: CUSTOM_SPREAD_CONFIG.spread5,
  },

  // --- 7장: '운명의 별' 스프레드 ---
  "7": {
    love: LOVE_SPREAD_CONFIG.spread7,
    money: MONEY_SPREAD_CONFIG.spread7,
    career: CAREER_SPREAD_CONFIG.spread7,
    study: STUDY_SPREAD_CONFIG.spread7,
    health: HEALTH_SPREAD_CONFIG.spread7,
    family: FAMILY_SPREAD_CONFIG.spread7,
    travel: TRAVEL_SPREAD_CONFIG.spread7,
    dream: DREAM_SPREAD_CONFIG.spread7,
    custom: CUSTOM_SPREAD_CONFIG.spread7,
  },
} as const;
