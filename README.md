# MAGO - AI 기반 타로 서비스

타로와 현대 AI 기술이 만나 탄생한 신비로운 타로 서비스입니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Backend/DB**: Supabase (Auth, Database)
- **Styling**: @emotion/styled, @emotion/react
- **Animation**: Framer Motion
- **Package Manager**: npm (또는 yarn)

## 프로젝트 구조

```
mago/
├── src/
│   ├── app/              # Next.js App Router 페이지
│   ├── components/       # React 컴포넌트
│   │   ├── common/       # 공용 UI 컴포넌트
│   │   ├── tarot/        # 타로 카드 관련 컴포넌트
│   │   ├── layout/       # 레이아웃 컴포넌트 (Header, Footer)
│   │   └── providers/    # Context Provider 컴포넌트
│   ├── hooks/            # 커스텀 훅
│   ├── lib/              # 유틸리티 및 설정
│   │   ├── registry.tsx  # Emotion SSR 레지스트리
│   │   ├── theme.ts      # 테마 정의 (오방색 기반)
│   │   ├── GlobalStyles.ts # 글로벌 스타일
│   │   └── supabaseClient.ts # Supabase 클라이언트
│   └── types/            # TypeScript 타입 정의
├── .env.local            # 환경 변수 (gitignore에 포함됨)
└── package.json
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 Supabase 설정을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 디자인 컨셉

- **브랜딩**: 한국 전통미와 현대적 미니멀리즘의 조화
- **컬러 팔레트**: 오방색(五方色)의 현대적 재해석
  - 동(靑): 깊은 남색 - 신비로움, 지혜
  - 서(白): 흰색, 은색 - 순수, 평화
  - 남(赤): 주홍색 - 열정, 활력
  - 북(黑): 검정 - 깊이, 신비
  - 중(黃): 금색 - 영광, 축복

## 개발 가이드

### 스타일링

- Emotion의 `@emotion/styled`를 사용합니다
- Framer Motion과 함께 사용할 때는 `styled(motion.button)` 형태로 직접 감싸기
- 테마는 `useTheme()` hook으로 접근
- 스타일 컴포넌트는 `.style.ts` 파일에 분리하거나 파일 내부에 정의

### Git 워크플로우

- `main`: 프로덕션 브랜치
- `feature/*`: 기능 개발 브랜치
- `refactor/*`: 리팩토링 브랜치
- `style/*`: 스타일링 관련 브랜치

자세한 내용은 `.cursorrules` 파일을 참고하세요.

## 라이선스

Private
