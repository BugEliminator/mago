import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabaseClient";

/** 공식 수신 이메일 */
export const ADMIN_EMAIL = "incertum.studio@gmail.com";

/** 카카오톡 1:1 오픈채팅 URL */
export const KAKAO_OPENCHAT_URL = "https://open.kakao.com/o/sxIy8Uyi";

/** 카카오 오픈채팅 새 탭 열기 */
export function openKakaoInquiry(): void {
  window.open(KAKAO_OPENCHAT_URL, "_blank", "noopener,noreferrer");
}

/** 기본 메일 앱으로 문의 이메일 초안 열기 */
export async function openEmailInquiry(): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const senderEmail = session?.user?.email?.trim() ?? "";

  const subject = encodeURIComponent("[마고] 서비스 이용 문의");
  const body = encodeURIComponent(
    `안녕하세요, AI 타로 MAGO 고객지원팀입니다.\n` +
      `겪으신 불편을 신속하게 해결해 드리기 위해 아래 양식을 작성해 주세요.\n\n` +
      `----------------------------------------\n` +
      `1. 문의 유형 (해당하는 곳에 [V] 표시를 남겨주세요)\n` +
      `   [  ] 타로 리딩 결과 오류 / 유실\n` +
      `   [  ] 복채(코인) 결제 및 충전 관련\n` +
      `   [  ] 계정 및 로그인\n` +
      `   [  ] 기타 서비스 이용 및 제안\n\n` +
      `2. 가입 계정 (이메일): ${senderEmail || "(미가입 상태)"}\n\n` +
      `3. 상세 문의 내용:\n` +
      `   (오류가 발생한 상황이나 질문 내용 및 버그 이미지를 자유롭게 적어주세요.)\n` +
      `   \n\n\n` +
      `----------------------------------------`,
  );

  window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
  toast.success("기본 메일 앱 연결을 시도합니다.");
}
