"use client";

import styled from "@emotion/styled";

/** 크롤러용 본문 — 화면에서는 숨긴다 */
export const SeoArticle = styled.article`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
