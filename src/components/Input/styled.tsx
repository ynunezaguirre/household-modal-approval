import styled from 'styled-components';


type InputType = {
  sizeInput?: string;
};

export const InputStyled = styled.input<InputType>`
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
  margin-top: 10px;
  width: calc(100% - 40px);
  :focus-visible {
    border: none;
    outline: 0;
  }
  ${({ sizeInput, theme }) => sizeInput === 'small' && `
    padding: 7px 10px;
    font-size: 14px;
    color: ${theme.colors.inputSmall};
    margin-top: 5px;
    margin-bottom: 15px;
  `}
`;

export const LabelInput = styled.span`
  color: ${({ theme }) => theme.colors.black};
  font-family: ${({ theme }) => theme.fonts.Poppins};
  font-size: 14px;
  font-weight: 400;
  span {
    font-family: ${({ theme }) => theme.fonts.Poppins};
    color: ${({ theme }) => theme.colors.red};
    font-weight: 300;
    margin-left: 10px;
  }
`;

export const LabelError = styled.p`
  font-family: ${({ theme }) => theme.fonts.Poppins};
  color: ${({ theme }) => theme.colors.red};
  font-weight: 300;
  font-size: 16px;
  line-height: 23px;
`;

export const SelectStyled = styled.select<InputType>`
  display: block;
  background: ${({ theme }) => theme.colors.gray};
  padding: 7px 10px;
  font-family: ${({ theme }) => theme.fonts.Poppins};
  color: ${({ theme }) => theme.colors.inputSmall};
  font-weight: 500;
  font-size: 14px;
  line-height: 23px;
  border: none;
  margin-top: 5px;
  margin-bottom: 15px;
  width: calc(100% - 20px);
  :focus-visible {
    border: none;
    outline: 0;
  }
`;