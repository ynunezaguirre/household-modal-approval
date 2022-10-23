import React, { useEffect, useState } from "react";
import {
  LoadingGlobal,
} from "./styled";
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '../../configs/theme';
import Spinner from "../Spinner";
import { changeServerURL, GetInitalData, InitalData, ServerURLType } from "../../services/api-services";
import AssetModal from "../AssetModal";
import IncomeModal from "../IncomeModal";

type IncomeWidgetProps = {
  email: string;
  incomeHandler: (data: unknown) => void;
  setLoading?: (loading: boolean) => void;
  env?: string;
  noAction?: boolean;
}

const IncomeWidget = (props: IncomeWidgetProps) => {
  const { email, incomeHandler, setLoading, noAction, env } = props;
  const [globalInitial, setGlobalInital] = useState<InitalData | null>(null);
  const [isAssetVisible] = useState(false);

  useEffect(() => {
    if (!!env) {
      changeServerURL(env as ServerURLType);
    }
    GetInitalData().then(response => {
      setGlobalInital(response);
    });
  }, []);

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
        <IncomeModal
          isVisible={isAssetVisible}
          enums={globalInitial.enums}
          email={email}
          callback={() => {}}
          language={globalInitial?.language}
          incomeHandler={incomeHandler}
          setExternalLoading={setLoading}
          noAction={noAction}
          openInPlainMode
        />
      </>
      )}
      
    </ThemeProvider>);
};

export default IncomeWidget;