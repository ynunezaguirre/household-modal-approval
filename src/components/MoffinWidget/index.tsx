import React, { useEffect, useState } from "react";
import {
  LoadingGlobal,
} from "./styled";
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '../../configs/theme';
import Spinner from "../Spinner";
import { changeServerURL, GetInitalData, InitalData, ServerURLType } from "../../services/api-services";
import MoffinScore from "../MoffinScore";

declare global {
  interface Window { belvoSDK: any; }
}

type MoffinWidgetProps = {
  email: string;
  type?: string;
  inputData?: {
    firstname?: string;
    lastname?: string;
  }
  env?: string;
  callbackHandler: (success: boolean) => void;
}

const MoffinWidget = (props: MoffinWidgetProps) => {
  const { email, callbackHandler, type, inputData, env } = props;
  const [globalInitial, setGlobalInital] = useState<InitalData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!!env) {
      changeServerURL(env as ServerURLType);
    }
    GetInitalData().then(response => {
      setGlobalInital(response);
    });
  }, []);

  useEffect(() => {
    if (globalInitial?.enums) {
      setIsVisible(true);
    }
  }, [globalInitial]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {!globalInitial && (
        <LoadingGlobal>
          <Spinner />
        </LoadingGlobal>
      )}
      {!!globalInitial && globalInitial.message && (
        <LoadingGlobal>
        {globalInitial.message}
        </LoadingGlobal>
      )}
      {!!globalInitial && !!globalInitial.enums && (
      <>
        <MoffinScore
          isVisible={isVisible}
          enums={globalInitial.enums}
          email={email}
          params={globalInitial.params} 
          callback={callbackHandler}
          reqType={type}
          inputData={inputData}
        />
      </>
      )}
      
    </ThemeProvider>);
};

export default MoffinWidget;