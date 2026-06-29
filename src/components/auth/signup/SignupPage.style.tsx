import styled from "@emotion/styled";
import { AuthTextInput } from "@/components/common/input/Input.style";

/** 이메일 인증 코드 6칸 가로 배치 */
export const OtpRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
`;

/** 한 칸짜리 OTP 인풋 */
export const OtpCell = styled(AuthTextInput)`
  width: 2.75rem;
  min-width: 2.75rem;
  max-width: 2.75rem;
  flex-shrink: 0;
  padding-left: 0;
  padding-right: 0;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 600;
`;

/** 단계 전환·보조 액션 가로 배치 */
export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: -0.25rem;
`;

/** 텍스트 스타일 보조 버튼 (뒤로, 재발송 등) */
export const TextButton = styled.button`
  font-size: 0.8125rem;
  font-weight: 500;
  color: #e8b84a;
  transition: color 150ms ease;

  &:hover:not(:disabled) {
    color: #f5d078;
  }

  &:disabled {
    color: #6b7388;
    cursor: not-allowed;
  }
`;

/** 안내 보조 문구 */
export const CodeHint = styled.p`
  margin: -0.5rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #6b7388;
  text-align: center;
`;

/** 단계 2 — 스팸·프로모션함 확인 안내 */
export const SpamFolderHint = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #6b7388;
  text-align: center;
`;

/** Supabase auth 에러 메시지 */
export const ErrorBanner = styled.p`
  margin: 0;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  line-height: 1.45;
  text-align: center;
  color: #f5f6fa;
  background: #c62828;
  border-radius: 0.75rem;
`;

/** 재발송 등 안내 메시지 */
export const InfoBanner = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  text-align: center;
  color: #8b93a8;
`;

/** 2단계 OTP 남은 시간 안내 (카운트다운) */
export const TimerHint = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #8b93a8;
  text-align: center;
`;
