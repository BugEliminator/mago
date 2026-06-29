import styled from "@emotion/styled";
import { motion } from "framer-motion";

/** 검정 풀스크린 — motion()으로 감싸 페이드 시 전체 제거 */
export const FullscreenRuneLoadingBackdrop = styled.div<{ $zIndex: number }>`
  position: fixed;
  inset: 0;
  z-index: ${({ $zIndex }) => $zIndex};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000103;
`;

export const FullscreenRuneLoadingBackdropMotion = motion(
  FullscreenRuneLoadingBackdrop,
);

/** 로띠·문구 세로 정렬 */
export const LoadingStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/**
 * 로띠 영역 — 테마 금색에 가깝게 보정 + 은은한 금색 글로우
 * (인코딩 값은 theme.colors.accent.gold #f9a825 근사)
 */
export const LottieWrap = styled.div`
  width: min(18rem, 78vw);
  height: min(18rem, 78vw);
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 18px ${({ theme }) => theme.colors.accent.gold});
`;

/** 벡터를 MAGO 악센트 금색 톤으로 맞춥니다. */
export const LottieTint = styled.div`
  width: 100%;
  height: 100%;
  filter: brightness(0) saturate(100%) invert(72%) sepia(51%) saturate(1749%)
    hue-rotate(359deg) brightness(101%) contrast(96%);
`;

export const Caption = styled.p`
  margin: 0;
  margin-top: 2rem;
  padding: 0 1.5rem;
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.accent.gold};
  text-align: center;
  line-height: 1.65;
`;
