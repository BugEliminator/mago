import styled from "@emotion/styled";

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(180deg, #1a0f08 0%, #0a0604 100%);
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #f9a825;
  margin-bottom: 3rem;
  font-family: "Noto Serif KR", serif;
`;

export const ResultContainer = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Placeholder = styled.div`
  padding: 3rem;
  background: rgba(244, 232, 208, 0.1);
  border: 2px dashed rgba(249, 168, 37, 0.3);
  border-radius: 1rem;
  color: rgba(244, 232, 208, 0.7);
  text-align: center;
  font-size: 1rem;
  line-height: 1.8;
`;
