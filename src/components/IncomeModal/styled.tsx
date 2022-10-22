import styled from 'styled-components';

export const Row = styled.div`
  display: inline-flex;
  width: 100%;
`;

export const Col = styled.div`
  flex: 1
`;

export const ButtonContainer = styled.div`
  margin-top: 30px;
`;

export const LinkButton = styled.button`
  font-family: ${({ theme }) => theme.fonts.Poppins};
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  padding: 9px 20px;
  padding-left: 0px;
  border-radius: 25px;
  border: none;
  margin-left: 0;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.blue};
  float: left;
  cursor: pointer;
`;

export const IncomeContainer = styled.div`
  padding: 19px 24px;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  width: calc(100% - 48px);
  margin-bottom: 12px;
  cursor: inherit;
  border-radius: 5px;
  ${({ theme }) => `
    background: ${theme.colors.white};
    border: 1px solid ${theme.colors.softGray};
    background: ${theme.colors.softGreen};
    border: 1px solid ${theme.colors.green};
    :hover {
      background: ${theme.colors.softGreen};
      border: 1px solid ${theme.colors.green};
    }
  `}
`;

export const IncomeDescription = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.colors.black};
  font-family: ${({ theme }) => theme.fonts.Poppins};
  font-size: 20px;
  line-height: 20px;
  span {
    font-size: 16px;
    display: block;
  }
`;

export const RemoveButton = styled.button`
  display: block;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.red};
  font-family: ${({ theme }) => theme.fonts.Poppins};
  margin-top: 5px;
  background: none;
  border: none;
  padding: 5px 0px;
  cursor: pointer;
`;

export const ActionIncomeContainer = styled.div`
  text-align: center;
  > div {
    text-align: center;
  }
`;