import type { Metadata } from "next";

/** 검색 결과에 올리면 안 되는 페이지용 메타 */
export const NO_INDEX_METADATA = {
  robots: { index: false, follow: false },
} as const satisfies Metadata;
