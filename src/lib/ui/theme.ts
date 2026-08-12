// 쓰지 않을겁니다. 나중에 보완해서 design.md만들계획임

export const theme = {
  colors: {
    // 오방색 기반 컬러 팔레트
    primary: {
      // 동방 - 깊은 남색 (신비로움, 지혜)
      blue: "#1a237e",
      blueLight: "#283593",
      blueDark: "#0d47a1",
    },
    secondary: {
      // 남방 - 주홍색 (열정, 활력)
      red: "#c62828",
      redLight: "#e53935",
      redDark: "#b71c1c",
    },
    accent: {
      // 중앙 - 금색 (영광, 축복)
      gold: "#f9a825",
      goldLight: "#fbc02d",
      goldDark: "#f57f17",
    },
    neutral: {
      // 서방 - 흰색, 은색 (순수, 평화)
      white: "#ffffff",
      silver: "#e8eaf6",
      gray: "#9e9e9e",
      grayLight: "#f5f5f5",
      grayDark: "#616161",
      // 북방 - 검정 (깊이, 신비)
      black: "#212121",
      blackLight: "#424242",
      blackDark: "#000000",
    },
    // 상태 컬러
    success: "#4caf50",
    warning: "#ff9800",
    error: "#f44336",
    info: "#2196f3",
  },
  // 타이포그래피
  typography: {
    fontFamily: {
      // 한글과 영문 모두 잘 보이는 폰트 조합
      primary:
        "'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: "'Noto Serif KR', serif", // 타이틀용
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  // 간격 (spacing)
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },
  // 그림자
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    // 신비로운 느낌의 그림자 (금색 계열)
    mystical: "0 10px 30px -5px rgba(249, 168, 37, 0.3)",
  },
  // 반경
  borderRadius: {
    sm: "0.25rem", // 4px
    md: "0.5rem", // 8px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    full: "9999px",
  },
  // 전환 효과
  transitions: {
    fast: "150ms ease-in-out",
    normal: "300ms ease-in-out",
    slow: "500ms ease-in-out",
  },
  // 브레이크포인트 (반응형)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// TypeScript를 위한 테마 타입 정의
export type Theme = typeof theme;
