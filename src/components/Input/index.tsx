import React from 'react';
import { InputStyled, LabelError } from "./styled";


const Input = (props: Props) => {
  const { placeholder, disabled, onChangeText, error } = props;
  return <>
    <InputStyled placeholder={placeholder} disabled={disabled} onChange={(e) => {
      e.preventDefault();
      onChangeText(e.target.value);
    }} />
    {!!error && <LabelError>{error}</LabelError>}
  </>
};

type Props = {
  placeholder: string;
  disabled?: boolean;
  error?: null | string;
  onChangeText: (s: string) => void;
};

export default Input;