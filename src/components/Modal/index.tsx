import React from 'react';
import { BackgroundMask, ModalBackground, ModalBox, ModalBoxContent, ModalTabIndex, TitleModal } from './styled';

const Modal = (props: Props) => {
  const { children, visible, title, onCancel, top} = props;
  return (
    <>
      {visible && (
        <ModalBackground>
          <BackgroundMask onClick={onCancel} />
          <ModalBox top={top}>
            <ModalTabIndex />
            <ModalBoxContent>
              <TitleModal>{title}</TitleModal>
              {children}
            </ModalBoxContent>
            <ModalTabIndex />
          </ModalBox>
        </ModalBackground>
      )}
    </>
  );
};

type Props = {
  children: React.ReactNode;
  visible?: boolean;
  title: string;
  onCancel: () => void;
  top?: number;
};

export default Modal;