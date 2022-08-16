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

export const BackButton = styled.button`
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

export const OTPContainer = styled.div`
  margin: 20px 0px;
  input {
    text-transform: uppercase;
  }
`;