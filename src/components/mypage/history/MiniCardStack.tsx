"use client";

import { MiniCardStackRoot, MiniCardItem } from "./MiniCardStack.style";

type Props = { count: number };

/**
 * 히스토리 카드용 미니 타로 카드팩 — TarotCardBackShell 비주얼을 소형화해 겹쳐 표시
 */
export default function MiniCardStack({ count }: Props) {
  const offsetMultiplier = count <= 3 ? 6 : count <= 5 ? 5 : 4;

  return (
    <MiniCardStackRoot $count={count}>
      {Array.from({ length: count }, (_, i) => {
        const rotateDeg = (i - (count - 1) / 2) * (count <= 3 ? 8 : 5);
        return (
          <MiniCardItem
            key={i}
            $index={i}
            $rotateDeg={rotateDeg}
            $leftPx={i * offsetMultiplier}
          />
        );
      })}
    </MiniCardStackRoot>
  );
}
