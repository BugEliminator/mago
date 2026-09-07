/** GA4 측정 ID — .env.local의 NEXT_PUBLIC_GA_MEASUREMENT_ID */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

/** 프로덕션 환경이고 측정 ID가 있을 때만 GA 활성화 */
export function isAnalyticsEnabled(): boolean {
  return (
    process.env.NODE_ENV === "production" && GA_MEASUREMENT_ID.length > 0
  );
}
