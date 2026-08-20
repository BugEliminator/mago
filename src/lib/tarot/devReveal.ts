/** 로컬 dev 전용 — 리딩 덱 앞면 공개 쿼리 키 */
export const TAROT_DEV_REVEAL_QUERY = "reveal";

/** 프로덕션 빌드에서는 앞면 공개를 허용하지 않습니다. */
export function isTarotDevRevealAllowed(): boolean {
  return process.env.NODE_ENV === "development";
}

/** searchParam 값이 로컬 앞면 공개 요청인지 판별합니다. */
export function isTarotDevRevealQuery(
  value: string | string[] | undefined | null,
): boolean {
  const raw = Array.isArray(value) ? value[0] : value;
  return isTarotDevRevealAllowed() && raw === "1";
}

/**
 * 경로에 `reveal=1`을 붙입니다.
 * 허용되지 않거나 reveal이 false면 원본 경로를 그대로 반환합니다.
 */
export function withTarotDevReveal(path: string, reveal: boolean): string {
  if (!reveal || !isTarotDevRevealAllowed()) return path;

  const hashIndex = path.indexOf("#");
  const withoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const separator = withoutHash.includes("?") ? "&" : "?";
  return `${withoutHash}${separator}${TAROT_DEV_REVEAL_QUERY}=1${hash}`;
}
