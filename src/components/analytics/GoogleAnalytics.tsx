"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { GA_MEASUREMENT_ID, isAnalyticsEnabled } from "@/lib/analytics/ga";

/**
 * Google Analytics 4 연동 컴포넌트
 * 프로덕션 환경에서만 스크립트를 로드합니다.
 */
export default function GoogleAnalytics() {
  if (!isAnalyticsEnabled()) {
    return null;
  }

  return <NextGoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
