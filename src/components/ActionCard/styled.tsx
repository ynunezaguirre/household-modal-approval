import styled from 'styled-components';

type ActionCardType = {
  success?: boolean;
}
export const ActionCardContainer = styled.div<ActionCardType>`
  border: 1px solid ${({ theme }) => theme.colors.softGray};
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.white};
  padding: 19px 24px;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  width: calc(100% - 48px);
  margin-bottom: 12px;
  :hover {
    background: ${({ theme, success }) => !!success ? theme.colors.softGreen : theme.colors.lightBlue};
    border: 1px solid ${({ theme, success }) => !!success ? theme.colors.green : theme.colors.blue};
  }
  cursor: pointer;
  ${({ success, theme }) => !!success && `
    background: ${theme.colors.softGreen};
    border: 1px solid ${theme.colors.green};
    cursor: inherit;
  `}
`;

export const ImageIcon = styled.img`
  width: 72px;
`;

export const ContentDescription = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.colors.black};
  font-family: ${({ theme }) => theme.fonts.Poppins};
`;

export const TitleActionCard = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`;

export const DescriptionActionCard = styled.p`
  font-size: 14px;
  font-weight: 300;
  margin: 0;
`;

export const ArrowAction = styled.img`
  width: 19px;
`;