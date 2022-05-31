import styled from 'styled-components';

export const InputStyled = styled.input`
  background: ${({ theme }) => theme.colors.gray};
  padding: 18px 20px;
  font-family: ${({ theme }) => theme.fonts.Poppins};
  color: ${({ theme }) => theme.colors.black};
  font-weight: 500;
  font-size: 16px;
  line-height: 23px;
  border: none;
  margin: auto;
  margin-bottom: 10px;
  margin-top: 20px;
  width: calc(100% - 40px);
  :focus-visible {
    border: none;
    outline: 0;
  }
`;

export const LabelError = styled.p`
  font-family: ${({ theme }) => theme.fonts.Poppins};
  color: ${({ theme }) => theme.colors.red};
  font-weight: 300;
  font-size: 16px;
  line-height: 23px;
`;