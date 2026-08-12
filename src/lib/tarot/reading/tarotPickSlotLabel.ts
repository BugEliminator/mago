/**
 * 0-based 슬롯 인덱스 → 한국어 서수 (설정 뽑기 장수는 최대 7)
 * 모달·토스트 등 카드 순번 표기에 공통 사용
 */
export function tarotPickSlotLabelKr(slotIndex: number): string {
  const labels = [
    "첫 번째",
    "두 번째",
    "세 번째",
    "네 번째",
    "다섯 번째",
    "여섯 번째",
    "일곱 번째",
  ];
  return labels[slotIndex] ?? `${slotIndex + 1}번째`;
}
