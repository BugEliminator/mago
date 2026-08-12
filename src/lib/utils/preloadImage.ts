/**
 * 브라우저 이미지 캐시에 올려 두기 위한 프리로드입니다.
 * 실패해도 UI 게이트를 막지 않습니다.
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}
