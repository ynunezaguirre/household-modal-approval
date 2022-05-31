import styled from 'styled-components';

export const InitWidgetContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 19px 0 rgba(29, 21, 21, 0.12);
  max-width: 410px;
  display: inline-flex;
  overflow: hidden;
`;

export const MessageContainer = styled.div`
  flex: 1;
  padding: 20px 30px 18px 10px;
  button {
    margin-top: 12px;
  }
`;

export const LabelMessage = styled.p`
  color: ${({ theme }) => theme.colors.black};
  font-family: ${({ theme }) => theme.fonts.Poppins};
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`;

export const ImageIcon = styled.div`
  flex: 1;
  max-width: 120px;
  text-align: center;
  padding-top: 20px;
  position: relative;
  img {
    width: 100%;
    max-width: 70px;
    margin: auto;
    position: relative;
    z-index: 2;
  }
`;

export const CircleBack = styled.div`
  background: ${({ theme }) => theme.colors.green};
  position: absolute;
  width: 150%;
  height: 130%;
  z-index: 1;
  right: 0;
  bottom: 16px;
  border-radius: 50%;
`;

export const ActionCardsContainer = styled.div`
  margin: 20px auto;
`;

export const ActionsButton = styled.div`
  text-align: right;
  button {
    font-size: 16px;
    padding: 14px 25px;
  }
`;

export const AlertMessage = styled.div`
  color: red;
  margin: 10px auto;
  font-family: ${({ theme }) => theme.fonts.Poppins};
  font-size: 16px;
  font-weight: 400;
`;

export const LoaderContainer = styled.div`
  text-align: center;
  margin: 80px auto;
`;

export const LabelLoading = styled.div`
  color: ${({ theme }) => theme.colors.black};
  font-family: ${({ theme }) => theme.fonts.Poppins};
  font-size: 14px;
  font-weight: 300;
  text-align: center;
  margin-top: 12px;
`;

export const TableCredit = styled.table`
  margin-top: 25px;
  margin-bottom: 50px;
  width: 100%;
  color: ${({ theme }) => theme.colors.black};
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.Poppins};
  font-weight: 400;
  border: none;
  td {
    padding: 8px 30px;
  }
  .creditValue {
    font-weight: 600;
    font-size: 22px;
  }
  .value {
    font-weight: 500;
  }
  .header {
    background: ${({ theme }) => theme.colors.gray};
    td {
      padding: 15px 30px;
    }
  }
  .param {
    text-align: right;
  }
`;