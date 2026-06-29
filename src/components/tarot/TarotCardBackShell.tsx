"use client";

import Image from "next/image";
import { TAROT_CLASSIC_BACK_IMAGE_PATH } from "@/types/tarot";
import {
  ImageLayer,
  Inner,
  Sheen,
  ShellRoot,
} from "./TarotCardBackShell.style";

export type TarotCardBackShellProps = {
  /** 접근성용 대체 텍스트 */
  alt: string;
  /** 한눈에 보기처럼 셀 너비를 채울 때 true */
  fluid?: boolean;
  /** 호버 링 등 외부에서 타깃할 클래스(예: ResultCardOverview) */
  className?: string;
  /** next/image sizes */
  sizes?: string;
  /**
   * 비(fluid 아닐 때) 최대 가로 — 미지정 시 덱과 동일 폭
   * (`TAROT_CARD_BACK_SHELL_WIDTH_DETAIL` 등)
   */
  frameMaxWidth?: string;
};

/**
 * 리딩 덱과 동일한 뒷면 비주얼 — 금테·이미지·쉔
 */
export default function TarotCardBackShell({
  alt,
  fluid = false,
  className,
  sizes = "170px",
  frameMaxWidth,
}: TarotCardBackShellProps) {
  return (
    <ShellRoot
      $fluid={fluid}
      $frameMaxWidth={frameMaxWidth}
      className={className}
    >
      <Inner>
        <ImageLayer>
          <Image
            src={TAROT_CLASSIC_BACK_IMAGE_PATH}
            alt={alt}
            fill
            sizes={sizes}
            draggable={false}
          />
        </ImageLayer>
        <Sheen aria-hidden />
      </Inner>
    </ShellRoot>
  );
}
