import React from "react";
import { ActiveButton } from "./styled";

const Button = (props: Props) => {
  const { label, onClick, disabled } = props;
  return <ActiveButton onClick={onClick} disabled={disabled}>{label}</ActiveButton>
};

type Props = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

export default Button;