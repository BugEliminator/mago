"use client";

import React, { useMemo } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

/**
 * Emotion을 Next.js App Router에서 SSR 이슈 없이 사용하기 위한 레지스트리 컴포넌트
 * 서버 사이드에서 생성된 스타일을 클라이언트로 전달하여 hydration 불일치를 방지합니다.
 */
export default function EmotionRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // 서버 사이드에서만 캐시를 생성합니다
  const cache = useMemo(() => {
    const cache = createCache({ key: "css" });
    cache.compat = true;
    return cache;
  }, []);

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(" "),
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
