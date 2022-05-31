import React from "react";
import { SpinnerContainer } from "./styled";


const Spinner = () => {
  return <SpinnerContainer>
      <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </SpinnerContainer>
};

export default Spinner;