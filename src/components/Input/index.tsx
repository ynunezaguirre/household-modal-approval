import React, { useState } from 'react';
import { InputStyled, LabelError, LabelInput, SelectStyled } from "./styled";


const Input = (props: Props) => {
  const [inputValue, setInputValue] = useState('');
  const { placeholder, disabled, onChangeText, error, size, label, type, items, maxLength, value } = props;
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
        value={value || inputValue}
        onChange={(e) => {
          e.preventDefault();
          setInputValue(e.target.value);
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
          setInputValue(e.target.value);
          onChangeText(e.target.value);
        }}
        value={value || inputValue}
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
  }>;
  value?: string;
};

export default Input;