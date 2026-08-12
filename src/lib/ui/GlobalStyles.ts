"use client";

import React from "react";
import { Global, css, useTheme } from "@emotion/react";

/**
 * 글로벌 스타일 정의
 * 전체 애플리케이션에 적용되는 기본 스타일을 설정합니다.
 * ThemeProvider를 통해 theme을 자동으로 주입받습니다.
 */
export const GlobalStyles = () => {
  const theme = useTheme();

  const globalStyles = css`
    /* CSS Reset 및 기본 설정 */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      font-family: ${theme.typography.fontFamily.primary};
      font-size: ${theme.typography.fontSize.base};
      font-weight: ${theme.typography.fontWeight.normal};
      line-height: 1.6;
      color: ${theme.colors.neutral.black};
      background-color: ${theme.colors.neutral.white};
      overflow-x: hidden;
    }

    /* 링크 스타일 */
    a {
      color: inherit;
      text-decoration: none;
      transition: color ${theme.transitions.fast};
    }

    a:hover {
      color: ${theme.colors.primary.blue};
    }

    /* 버튼 기본 스타일 리셋 */
    button {
      font-family: inherit;
      font-size: inherit;
      border: none;
      background: none;
      cursor: pointer;
      padding: 0;
      transition: all ${theme.transitions.normal};
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    /* 입력 필드 기본 스타일 */
    input,
    textarea,
    select {
      font-family: inherit;
      font-size: inherit;
    }

    /* 리스트 스타일 리셋 */
    ul,
    ol {
      list-style: none;
    }

    /* 이미지 최적화 */
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    /* 스크롤바 스타일링 (웹킷 브라우저) */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: ${theme.colors.neutral.grayLight};
    }

    ::-webkit-scrollbar-thumb {
      background: ${theme.colors.neutral.gray};
      border-radius: ${theme.borderRadius.full};
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${theme.colors.neutral.grayDark};
    }

    /* 포커스 아웃라인 스타일 */
    :focus-visible {
      outline: 2px solid ${theme.colors.accent.gold};
      outline-offset: 2px;
    }
  `;

  return React.createElement(Global, { styles: globalStyles });
};
