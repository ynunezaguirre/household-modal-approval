import styled from 'styled-components';

type ActiveButtonType = {
  disabled?: boolean;
  usemaxwidth?: string;
  background?: string;
  minWidth?: number;
};
export const ActiveButton = styled.button<ActiveButtonType>`
  font-family: ${({ theme }) => theme.fonts.Poppins};
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  padding: 9px 20px;
  border-radius: 25px;
  border: none;
  margin-left: 10px;
  background: ${({ theme, background }) =>
    background || theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  transition: all 0.2s;
  height: auto;
  cursor: pointer;
  :hover,
  :active {
    background: ${({ theme, background }) =>
      background || theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    filter: brightness(1.4);
  }
  ${({ disabled, theme }) =>
    !!disabled &&
    `
    background: ${theme.colors.disabled} !important;
    color: ${theme.colors.textDisabled} !important;
    :hover {
      filter: brightness(1);
      cursor: not-allowed;
    }
  `}
  ${({ minWidth }) =>
    !!minWidth &&
    `
    min-width: ${minWidth}px;
  `}
  ${({ usemaxwidth }) =>
    usemaxwidth === 'true' &&
    `
    width: 100%;
  `}
  svg {
    display: inline-block;
    margin-right: 10px;
    vertical-align: sub;
  }
`;