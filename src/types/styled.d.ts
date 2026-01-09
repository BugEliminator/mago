import "@emotion/react";
import { Theme as CustomTheme } from "@/lib/theme";

/**
 * Emotion의 테마 타입 확장
 * 이 파일을 통해 emotion에서 theme prop을 타입 안전하게 사용할 수 있습니다.
 */
declare module "@emotion/react" {
  export interface Theme extends CustomTheme {}
}
