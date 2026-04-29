import styled from "@emotion/styled";

/** 라벨 + 컨트롤 세로 묶음 */
export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4375rem;
`;

/** 필드 라벨 */
export const FieldLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #a8b0c4;
`;

/** 인풋 래퍼 — 비밀번호 토글 등 우측 컨트롤과 함께 쓸 때 */
export const InputWrapper = styled.div`
  position: relative;
`;

/** 인증 화면 공통 텍스트 인풋 */
export const AuthTextInput = styled.input<{ $hasToggle?: boolean }>`
  width: 100%;
  padding: 0.875rem
    ${({ $hasToggle }) => ($hasToggle ? "3rem" : "1rem")}
    0.875rem 1rem;
  background: #252d42;
  border: 1px solid #3e475e;
  border-radius: 0.75rem;
  color: #f0f2f7;
  font-size: 1rem;
  outline: none;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease,
    background 200ms ease;

  &::placeholder {
    color: #6c7388;
  }

  &:focus {
    border-color: #d4a017;
    box-shadow: 0 0 0 3px #2a2318;
    background: #2d354a;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 100px #1c2238 inset;
    -webkit-text-fill-color: #f0f2f7;
    caret-color: #f0f2f7;
  }
`;

/** 비밀번호 표시/숨김 토글 */
export const EyeToggle = styled.button`
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  color: #7d8699;
  border-radius: 0.375rem;
  transition: color 150ms ease;

  &:hover {
    color: #b4bccf;
  }
`;
