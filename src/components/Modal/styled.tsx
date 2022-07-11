import styled from 'styled-components';

export const BackgroundMask = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
`;

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  outline: 0;
  -webkit-overflow-scrolling: touch;
  z-index: 1000;
`;

type ModalBoxType = {
  top?: number;
}
export const ModalBox = styled.div<ModalBoxType>`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-variant: tabular-nums;
  pointer-events: none;
  position: relative;
  top: ${({ top }) => top || 100}px;
  width: auto;
  max-width: calc(632px - 32px);
  margin: 0 auto;
  padding-bottom: 24px;
`;

export const ModalTabIndex = styled.div`
  width: 0px;
  height: 0px;
  overflow: hidden;
  outline: none;
`;

export const ModalBoxContent = styled.div`
  position: relative;
  background-color: #fff;
  background-clip: padding-box;
  border: 0;
  border-radius: 2px;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
  pointer-events: auto;
  z-index: 1000;
  padding: 26px 34px;
`;

export const TitleModal = styled.p`
  color: ${({ theme }) => theme.colors.black};
  font-family: ${({ theme }) => theme.fonts.Poppins};
  font-size: 26px;
  font-weight: 500;
  margin: 0;
  max-width: 330px;
`;