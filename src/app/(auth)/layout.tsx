import { NO_INDEX_METADATA } from "@/lib/seo/noIndexMetadata";

export const metadata = NO_INDEX_METADATA;

/**
 * 인증 라우트 레이아웃 — 로그인·회원가입·비밀번호 페이지를 검색에서 제외한다.
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
