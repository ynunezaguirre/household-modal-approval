import React, { useEffect, useState } from "react";
import {
  LoadingGlobal,
} from "./styled";
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '../../configs/theme';
// import './style.css';
import Spinner from "../Spinner";
import { GetInitalData, InitalData } from "../../services/api-services";
import AssetModal, { AccountsData } from "../AssetModal";

declare global {
  interface Window { belvoSDK: any; }
}

type AssetsWidgetProps = {
  email: string;
  assetsHandler: (data: AccountsData[]) => void;
}

const AssetsWidget = (props: AssetsWidgetProps) => {
  const { email, assetsHandler } = props;
  const [globalInitial, setGlobalInital] = useState<InitalData | null>(null);
  const [isAssetVisible, setIsAssetVisible] = useState(false);

  useEffect(() => {
    GetInitalData().then(response => {
      setGlobalInital(response);
    });
  }, []);

  useEffect(() => {
    if (globalInitial?.latam) {
      const node = document.createElement('script');
      node.src = 'https://cdn.belvo.io/belvo-widget-1-stable.js';
      node.type = 'text/javascript';
      node.async = true;
      document.body.appendChild(node);
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
        <AssetModal
          isVisible={isAssetVisible}
          enums={globalInitial.enums}
          email={email}
          callback={() => {}}
          language={globalInitial?.language}
          accountsHandler={assetsHandler}
          openInPlainMode
        />
      </>
      )}
      
    </ThemeProvider>);
};

export default AssetsWidget;