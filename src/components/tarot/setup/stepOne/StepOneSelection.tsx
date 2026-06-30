import { useRef } from "react";
import type { CardSpread } from "@/types/tarot";
import AncientCoin from "./AncientCoin";
import {
  SetupStepHeaderCopy,
  SetupStepHeaderNav,
} from "../SetupStepHeader";
import { StepHeaderDescriptionPhrase } from "../SetupStepHeader.style";
import {
  BackButton,
  ConfirmButton,
  SetupActionRow,
  SetupStepFooter,
  SetupStepScrollArea,
} from "../page.style";
import { useMobileTouchScroll } from "@/hooks/useMobileTouchScroll";
import {
  CoinLayer,
  CoinOptionButton,
  CoinOptionContent,
  CoinOptionDetail,
  CoinOptionDetailSlot,
  CoinOptionLabel,
  CoinOptionList,
  CoinOptionTitle,
  CoinOptionTopRow,
  CoinStackRoot,
  CoinVisualArea,
  RecommendBadge,
  StepOneRoot,
} from "./StepOneSelection.style";

type CoinOption = {
  id: CardSpread;
  label: string;
  title: string;
  detail: string;
  /** 옵션 우상단 뱃지 문구 — 없으면 미표시 */
  badge?: string;
};

type StepOneSelectionProps = {
  selectedCardCount: CardSpread | null;
  onSelect: (cardCount: CardSpread) => void;
  onConfirm: () => void;
  onBack: () => void;
  onCloseHome: () => void;
  disabled: boolean;
};

const COIN_OPTIONS: readonly CoinOption[] = [
  {
    id: 3,
    label: "3장 선택",
    title: "빠르고 명쾌한 해답",
    detail:
      "내 상황의 핵심 흐름과 앞으로 다가올 핵심 힌트만 빠르게 확인합니다.",
    // badge: "원포인트",
  },
  {
    id: 5,
    label: "5장 선택",
    title: "해답을 찾는 맞춤 분석",
    detail:
      "고민의 인과관계를 입체적으로 추적해 구체적인 시기와 해답을 도출합니다.",
    // badge: "MAGO의 추천",
  },
  {
    id: 7,
    label: "7장 선택",
    title: "최고 정밀도 종합 솔루션",
    detail:
      "과거와 미래속의 문제 해결을 위한 마고의 통찰까지 담은 리딩입니다.",
    // badge: "7장 뱃지",
  },
];

function CoinStack({ count, active }: { count: number; active: boolean }) {
  return (
    <CoinStackRoot>
      {Array.from({ length: count }, (_, index) => (
        <CoinLayer
          key={index}
          initial={{ y: -52, opacity: 0, rotateX: 65, rotateZ: 0 }}
          animate={
            active
              ? {
                  y: -index * 8,
                  opacity: 1,
                  rotateX: 65,
                  rotateZ: index % 2 === 0 ? 4 : -4,
                  z: index * 5,
                }
              : {
                  y: 0,
                  opacity: 0.18,
                  rotateX: 65,
                  rotateZ: 0,
                  scale: 0.9,
                }
          }
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
            delay: active ? index * 0.06 : 0,
          }}
        >
          <AncientCoin />
        </CoinLayer>
      ))}
    </CoinStackRoot>
  );
}

/** Step 1 — 리딩에 사용할 카드 장수를 선택합니다. */
export default function StepOneSelection({
  selectedCardCount,
  onSelect,
  onConfirm,
  onBack,
  onCloseHome,
  disabled,
}: StepOneSelectionProps) {
  const hasSelection = selectedCardCount !== null;
  const scrollRef = useRef<HTMLDivElement>(null);

  /* iOS 3D 컨텍스트 안에서 터치 스크롤이 막히는 버그 우회 */
  useMobileTouchScroll(scrollRef);

  return (
    <StepOneRoot>
      <SetupStepHeaderNav
        currentStep={1}
        onCloseHome={onCloseHome}
        disabled={disabled}
      />

      <SetupStepHeaderCopy
        eyebrow="Card Selection"
        title="운명의 깊이를 정해주세요"
        description={
          <>
            카드 1장당 엽전 10냥이{" "}
            <StepHeaderDescriptionPhrase>소모됩니다.</StepHeaderDescriptionPhrase>
          </>
        }
      />

      <SetupStepScrollArea ref={scrollRef}>
        <CoinOptionList>
          {COIN_OPTIONS.map((option) => {
            const active = selectedCardCount === option.id;
            return (
              <CoinOptionButton
                key={option.id}
                type="button"
                $active={active}
                onClick={() => onSelect(option.id)}
                whileTap={{ scale: 0.985 }}
              >
                {option.badge != null && (
                  <RecommendBadge>{option.badge}</RecommendBadge>
                )}
                <CoinVisualArea>
                  <CoinStack count={active ? option.id : 1} active={active} />
                </CoinVisualArea>
                <CoinOptionContent>
                  <CoinOptionTopRow>
                    <CoinOptionLabel $active={active}>
                      {option.label}
                    </CoinOptionLabel>
                  </CoinOptionTopRow>
                  <CoinOptionTitle $active={active}>
                    {option.title}
                  </CoinOptionTitle>
                  <CoinOptionDetailSlot>
                    <CoinOptionDetail $visible={active} aria-hidden={!active}>
                      {option.detail}
                    </CoinOptionDetail>
                  </CoinOptionDetailSlot>
                </CoinOptionContent>
              </CoinOptionButton>
            );
          })}
        </CoinOptionList>
      </SetupStepScrollArea>

      <SetupStepFooter>
        <SetupActionRow>
          <BackButton
            type="button"
            disabled={disabled}
            onClick={onBack}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            이전으로
          </BackButton>
          <ConfirmButton
            type="button"
            disabled={!hasSelection || disabled}
            onClick={onConfirm}
            whileHover={hasSelection && !disabled ? { scale: 1.02 } : {}}
            whileTap={hasSelection && !disabled ? { scale: 0.98 } : {}}
          >
            다음으로
          </ConfirmButton>
        </SetupActionRow>
      </SetupStepFooter>
    </StepOneRoot>
  );
}
