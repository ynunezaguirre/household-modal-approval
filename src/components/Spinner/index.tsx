import React from "react";
import { SpinnerContainer } from "./styled";


const Spinner = ({ verticalAlign }: Props) => {
  return <SpinnerContainer verticalAlign={verticalAlign}>
      <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </SpinnerContainer>
};

type Props = {
  verticalAlign?: string;
}

export default Spinner;