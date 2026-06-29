import { preloadImage } from "@/lib/preloadImage";
import {
  LANDING_MAJOR_ARCANA_FACE_PATHS,
  TAROT_CLASSIC_BACK_IMAGE_PATH,
} from "@/types/tarot";

/**
 * 랜딩 히어로 덱 이미지 프리로드 — major 12장 + 뒷면 1장
 * 로그인·가입 완료 후 메인 이동 전 호출해 검은 카드 플래시를 줄입니다.
 */
export async function preloadLandingDeckImages(): Promise<void> {
  await Promise.all([
    ...LANDING_MAJOR_ARCANA_FACE_PATHS.map((src) => preloadImage(src)),
    preloadImage(TAROT_CLASSIC_BACK_IMAGE_PATH),
  ]);
}
