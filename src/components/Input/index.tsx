import React from 'react';
import { InputStyled, LabelError, LabelInput, SelectStyled } from "./styled";


const Input = (props: Props) => {
  const { placeholder, disabled, onChangeText, error, size, label, type, items, maxLength } = props;
  return <>
    {!!label && (
      <LabelInput>
        {label}
        {!!error && <span>{error}</span>}
      </LabelInput>
    )}
    {(!type || type === 'input' ) && (
      <InputStyled 
        maxLength={maxLength}
        placeholder={placeholder} 
        disabled={disabled} 
        sizeInput={size}
        onChange={(e) => {
          e.preventDefault();
          onChangeText(e.target.value);
        }}
      />
    )}
    {(type === 'select' ) && (
      <SelectStyled
        placeholder={placeholder} 
        disabled={disabled} 
        onChange={(e) => {
          e.preventDefault();
          onChangeText(e.target.value);
        }}
      >
        <option value=""></option>
        {items?.map(item => <option value={item.value}>{item.label}</option>)}
      </SelectStyled>
    )}
    {!!error && !label && <LabelError>{error}</LabelError>}
  </>
};

type Props = {
  placeholder: string;
  disabled?: boolean;
  error?: null | string;
  onChangeText: (s: string) => void;
  size?: string;
  label?: string;
  type?: string;
  maxLength?: number;
  items?: Array<{
    label: string;
    value: string;
  }>
};

export default Input;