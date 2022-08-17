import React, { useEffect, useState } from "react";
import {
  InitWidgetContainer,
  LabelMessage,
  ImageIcon,
  MessageContainer,
  CircleBack,
  ActionCardsContainer,
  ActionsButton,
  AlertMessage,
  LabelLoading,
  LoaderContainer,
  CopyText,
  LoadingGlobal,
} from "./styled";
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '../../configs/theme';
import IconImage from '../../assets/initbutton.png';
import IconBancaria from '../../assets/info-bancaria.png';
import IconIngresos from '../../assets/info-ingresos.png';
// import './style.css';
import Button from "../Button";
import Modal from "../Modal";
import ActionCard from "../ActionCard";
import { GetPlaidInfo, GetPlaidToken, ProcessForm } from "../../services/plaid-services";
import { CONSTANTS } from "../../configs/constants";
import PlaidLink from "../PlaidLink";
import Input from "../Input";
import { validateEmail } from "../../utils";
import Spinner from "../Spinner";
import { PlaidLinkError } from "react-plaid-link";
import { GetInitalData, InitalData } from "../../services/api-services";
import MoffinScore from "../MoffinScore";
import AssetModal from "../AssetModal";

declare global {
  interface Window { belvoSDK: any; }
}
interface CreditResponse {
  credit?: {
    amount: string;
    period: string;
    rate: string;
    initial: string;
    hasCredit: boolean,
  };
  message?: string;
};

const CREDIT_SCORE_SERVICES = {
  MOFFIN: 'MOFFIN',
};

const InitWidget = () => {
  const [globalInitial, setGlobalInital] = useState<InitalData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMoffinVisible, setIsMoffinVisible] = useState(false);
  const [isAssetVisible, setIsAssetVisible] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  const [plaidToken, setPlaidToken] = useState<null | {
    token: string;
    type: string;
  }>(null);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [loadingBank, setLoadingBank] = useState(false);
  const [bankData, setBankData] = useState<null | unknown>(null);
  const [incomeData, setIncomeData] = useState<null | unknown>(null);
  const [moffinData, setMoffinData] = useState<null | unknown>(null);
  const [loadingIncome, setLoadingIncome] = useState(false);
  const [loadingMoffin, setLoadingMoffin] = useState(false);
  const [email, setEmail] = useState('');
  const [isValidEmail, setValidEmail] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [publicToken, setPublicToken] = useState<string | null>();
  const [creditResponse, setCreditResponse] = useState<null | CreditResponse>(null);

  useEffect(() => {
    GetInitalData().then(response => {
      setGlobalInital(response);
    });
  }, []);
  

  useEffect(() => {
    const checkCards =
      (!!incomeData || !globalInitial?.income) &&
      (!!moffinData || !globalInitial?.credit_score);

    if (!!bankData && checkCards) {
      setFormComplete(true);
    }
  }, [bankData, incomeData, moffinData]);

  useEffect(() => {
    if (globalInitial?.latam) {
      const node = document.createElement('script');
      node.src = 'https://cdn.belvo.io/belvo-widget-1-stable.js';
      node.type = 'text/javascript';
      node.async = true;
      document.body.appendChild(node);
    }
  }, [globalInitial]);

  const startFlow = () => {
    setIsModalVisible(true);
  };
  const processForm = () => {
    // if (publicToken) {
      setErrorMessage(null);
      setFormLoading(true);
      ProcessForm('', email).then((response) => {
        setFormLoading(false);
        if (response.message) {
          return setErrorMessage(response.message);
        }
        setCreditResponse(response as CreditResponse);
        setPublicToken(null);
      });
    // }
  };

  const generateToken = (type: string) => {
    const invalidMail = (!isValidEmail || email.trim() === '');
    if (invalidMail || loadingIncome || loadingBank) {
      if (invalidMail) {
        setErrorMessage('The email is required');
      }
      return;
    }
    startLoading(type, true);
    setErrorMessage(null);
    switch (type) {
      case CONSTANTS.TYPE_ASSETS:
        setIsAssetVisible(true);
        break;
      case CONSTANTS.TYPE_SCORE:
        setIsMoffinVisible(true);
        break;
      case CONSTANTS.TYPE_INCOME:
        plaidTokenFlow(CONSTANTS.TYPE_INCOME);
        break;
    }
  }

  const startLoading = (type: string, loading: boolean, data: any = null) => {
    switch(type) {
      case CONSTANTS.TYPE_ASSETS:
        setLoadingBank(loading);
        if (data) {
          setBankData(data);
        }
        break;
      case CONSTANTS.TYPE_INCOME:
        setLoadingIncome(loading);
        if (data) {
          setIncomeData(data);
        }
        break;
      case CONSTANTS.TYPE_SCORE:
        setLoadingMoffin(loading);
        if (data?.success) {
          setMoffinData(data);
          setPublicToken('MOFFIN');
        }
        break;
    }
  };

  const plaidTokenFlow = (type: string) => {
    GetPlaidToken(type, email.trim()).then(tokenResponse => {
      if (tokenResponse.token) {
        setPlaidToken({
          token: tokenResponse.token,
          type,
        });
      } else if (tokenResponse.message) {
        setErrorMessage(tokenResponse.message);
        setLoadingBank(false);
      }
    });
  }

  const handlePlaidResponse = (publicToken: string | null, error: ErrorEvent | null) => {
    if (plaidToken?.token) {
      if (error) {
        startLoading(plaidToken.type, false);
        return setErrorMessage(error.message);
      }
      if (publicToken) {
        setPublicToken(publicToken);
        GetPlaidInfo(publicToken, plaidToken.type, email).then(response => {
          startLoading(plaidToken.type, false, response.data);
          if (response.message) {
            setErrorMessage(response.message);
          }
          setPlaidToken(null);
        });
      }
    }
  };

  const onChangeText = (text: string) => {
    if (text.trim() === '') {
      setValidEmail(true);
    } else {
      setValidEmail(validateEmail(text));
    }
    setEmail(text);
    setErrorMessage(null);
  }

  const onCancelPlaid = (error: null | PlaidLinkError) => {
    if (plaidToken?.token) {
      startLoading(plaidToken.type, false);
      if (error?.display_message) {
        setErrorMessage(error.display_message);
      }
      setPlaidToken(null);
    }
  };

  const cleanAndClose = () => {
    setFormComplete(false);
    setPlaidToken(null);
    setErrorMessage(null);
    setLoadingBank(false);
    setBankData(null);
    setIncomeData(null);
    setMoffinData(null);
    setLoadingIncome(false);
    setEmail('');
    setValidEmail(true);
    setFormLoading(false);
    setPublicToken(null);
    setCreditResponse(null);
    setIsModalVisible(false);
  };

  const assetProcess = (data: null | unknown) => {
    setIsAssetVisible(false);
    setTimeout(() => {
      startLoading(CONSTANTS.TYPE_ASSETS, false, data);
    }, 100);
  }

  const moffinProccess = (success: boolean) => {
    setIsMoffinVisible(false);
    setTimeout(() => {
      startLoading(CONSTANTS.TYPE_SCORE, false, { success });
    }, 500);
  }

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
        <InitWidgetContainer>
        <ImageIcon>
          <CircleBack />
          <img src={IconImage} alt="iconbutton"/>
        </ImageIcon>
        <MessageContainer>
          <LabelMessage>{globalInitial.enums['CARD_WIDGET_LABEL']}</LabelMessage>
          <Button label={globalInitial.enums['CARD_WIDGET_BUTTON']} onClick={startFlow} />
        </MessageContainer>
        </InitWidgetContainer>
        <Modal
          visible={isModalVisible}
          onCancel={cleanAndClose}
          title={creditResponse?.credit?.hasCredit ?
            globalInitial.enums['MODAL_TITLE_FINISH'] :
            globalInitial.enums['MODAL_TITLE_INIT']}>
            <>
              {!!errorMessage && <AlertMessage>{errorMessage}</AlertMessage>}
              {formLoading && (
                <LoaderContainer>
                  <Spinner />
                  <LabelLoading>
                  {globalInitial.enums['MODAL_LOADING_MESSAGE']}
                  </LabelLoading>
                </LoaderContainer>
              )}
              {!formLoading && !creditResponse?.credit?.hasCredit && (
                <>
                  <Input
                    disabled={loadingBank || loadingIncome || !!bankData || !!incomeData}
                    placeholder={globalInitial.enums['MODAL_EMAIL_INPUT']}
                    onChangeText={onChangeText}
                    error={isValidEmail ? null : globalInitial.enums['MODAL_EMAIL_INPUT_ERROR']} />
                  <CopyText>{globalInitial.enums['MODAL_COPY']}</CopyText>
                  <ActionCardsContainer>
                    <ActionCard
                      title={globalInitial.enums['ACTION_CARD_BANK_TITLE']}
                      description={globalInitial.enums['ACTION_CARD_BANK_DESCRIPTION']}
                      icon={IconBancaria} 
                      success={!!bankData}
                      loading={loadingBank}
                      onPress={() => generateToken(CONSTANTS.TYPE_ASSETS)}/>
                    {globalInitial.income && (
                      <ActionCard
                      title={globalInitial.enums['ACTION_CARD_INCOME_TITLE']}
                      description={globalInitial.enums['ACTION_CARD_INCOME_DESCRIPTION']}
                      loading={loadingIncome}
                      success={!!incomeData}
                      onPress={() => generateToken(CONSTANTS.TYPE_INCOME)}
                      icon={IconIngresos} />
                    )}
                    {globalInitial.credit_score === CREDIT_SCORE_SERVICES.MOFFIN && (
                      <ActionCard
                      title={globalInitial.enums['ACTION_CARD_SCORE_TITLE']}
                      description={globalInitial.enums['ACTION_CARD_SCORE_DESCRIPTION']}
                      loading={loadingMoffin}
                      success={!!moffinData}
                      onPress={() => generateToken(CONSTANTS.TYPE_SCORE)}
                      icon={IconIngresos} />
                    )}
                  </ActionCardsContainer>
                  <ActionsButton>
                    <Button disabled={!formComplete} label={globalInitial.enums['MODAL_BUTTON_PREQUALIFIED']} onClick={processForm} />
                  </ActionsButton>
                </>
              )}

              {!formLoading && creditResponse?.credit?.hasCredit && (
                <>
                  <ActionsButton>
                    <Button label={globalInitial.enums['MODAL_BUTTON_FINISH']} onClick={cleanAndClose} />
                  </ActionsButton>
                </>
              )}
              
              {plaidToken?.token && (
                <PlaidLink
                  token={plaidToken.token}
                  onCancelPlaid={onCancelPlaid}
                  handleResponse={handlePlaidResponse} />
              )}
            </>
        </Modal>
        <AssetModal
          isVisible={isAssetVisible}
          enums={globalInitial.enums}
          email={email}
          callback={assetProcess}
          language={globalInitial?.language}
        />
        <MoffinScore
          isVisible={isMoffinVisible}
          enums={globalInitial.enums}
          email={email}
          params={globalInitial.params} 
          callback={moffinProccess}
        />
      </>
      )}
      
    </ThemeProvider>);
};

export default InitWidget;