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
import { GetPlaidToken, GetPlaidInfo, ProcessForm } from "../../services/plaid-services";
import { CONSTANTS } from "../../configs/constants";
import PlaidLink from "../PlaidLink";
import Input from "../Input";
import { validateEmail } from "../../utils";
import Spinner from "../Spinner";
import { PlaidLinkError } from "react-plaid-link";
import { GetBelvoInfo, GetBelvoToken } from "../../services/belvo-services";
import { GetInitalData, InitalData } from "../../services/api-services";
import MoffinScore from "../MoffinScore";

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
  const [formComplete, setFormComplete] = useState(false);
  const [plaidToken, setPlaidToken] = useState<null | {
    token: string;
    type: string;
  }>(null);
  const [belvoToken, setBelvoToken] = useState<null | {
    token: string;
    type: string;
    external_id?: string;
    country_codes?: string[];
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
    if (publicToken) {
      setErrorMessage(null);
      setFormLoading(true);
      ProcessForm(publicToken, email).then((response) => {
        setFormLoading(false);
        if (response.message) {
          return setErrorMessage(response.message);
        }
        setCreditResponse(response as CreditResponse);
      });
    }
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
    if (type === CONSTANTS.PLAID_TYPE_SCORE) {
      setIsMoffinVisible(true);
    } else if (globalInitial?.latam) {
      belvoTokenFlow(type);
    } else {
      plaidTokenFlow(type);
    }
  }
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

  const belvoTokenFlow = (type: string) => {
    GetBelvoToken(type, email.trim()).then(tokenResponse => {
      if (tokenResponse.token) {
        setBelvoToken({
          token: tokenResponse.token,
          type,
          external_id: tokenResponse.external_id,
          country_codes: tokenResponse.country_codes,
        });

      } else if (tokenResponse.message) {
        setErrorMessage(tokenResponse.message);
        setLoadingBank(false);
      }
    });
  }

  useEffect(() => {
    if (belvoToken?.external_id && belvoToken.token) {
      createBelvoWidget();
    }
  }, [belvoToken])
  

  const createBelvoWidget = () => {
    if (belvoToken?.external_id && belvoToken.token) {
      const config = {
        external_id: belvoToken.external_id,
        locale: globalInitial?.language || 'en',
        institution_types: ['retail', 'business'],
        callback: onBelvoResponse,
        onExit: (data: any) => {},
        onEvent: (data: any) =>  {
          if (data?.eventName === 'PAGE_LOAD' && data?.meta_data?.page.indexOf('abandonSurvey') !== -1) {
            if (belvoToken?.token) {
              startLoading(belvoToken.type, false);
              setBelvoToken(null);
            }
          }
        },
      }
      window.belvoSDK.createWidget(belvoToken.token, config).build();
    }
  };

  const onBelvoResponse = (link: string, institution: any) => {
    if (belvoToken?.token) {
      GetBelvoInfo({
        institution,
        link,
        type: belvoToken?.type || '',
        email,
      }).then(response => {
        startLoading(belvoToken.type, false, response.data);
        if (response.message) {
          setErrorMessage(response.message);
        } else {
          setPublicToken('BELVO')
        }
        setBelvoToken(null);
      });
    }
  };

  const startLoading = (type: string, loading: boolean, data: any = null) => {
    switch(type) {
      case CONSTANTS.PLAID_TYPE_ASSETS:
        setLoadingBank(loading);
        if (data) {
          setBankData(data);
        }
        break;
      case CONSTANTS.PLAID_TYPE_INCOME:
        setLoadingIncome(loading);
        if (data) {
          setIncomeData(data);
        }
        break;
      case CONSTANTS.PLAID_TYPE_SCORE:
        setLoadingMoffin(loading);
        if (data?.success) {
          setMoffinData(data);
          setPublicToken('MOFFIN');
        }
        break;
    }
  };

  const handlePlaidResponse = (publicToken: string | null, error: ErrorEvent | null) => {
    if (plaidToken?.token) {
      if (error) {
        startLoading(plaidToken.type, false);
        return setErrorMessage(error.message);
      }
      if (publicToken) {
        if (plaidToken.type === CONSTANTS.PLAID_TYPE_ASSETS) {
          setPublicToken(publicToken);
        }
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

  const moffinProccess = (success: boolean) => {
    setIsMoffinVisible(false);
    setTimeout(() => {
      startLoading(CONSTANTS.PLAID_TYPE_SCORE, false, { success });
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
                      onPress={() => generateToken(CONSTANTS.PLAID_TYPE_ASSETS)}/>
                    {globalInitial.income && (
                      <ActionCard
                      title={globalInitial.enums['ACTION_CARD_INCOME_TITLE']}
                      description={globalInitial.enums['ACTION_CARD_INCOME_DESCRIPTION']}
                      loading={loadingIncome}
                      success={!!incomeData}
                      onPress={() => generateToken(CONSTANTS.PLAID_TYPE_INCOME)}
                      icon={IconIngresos} />
                    )}
                    {globalInitial.credit_score === CREDIT_SCORE_SERVICES.MOFFIN && (
                      <ActionCard
                      title={globalInitial.enums['ACTION_CARD_SCORE_TITLE']}
                      description={globalInitial.enums['ACTION_CARD_SCORE_DESCRIPTION']}
                      loading={loadingMoffin}
                      success={!!moffinData}
                      onPress={() => generateToken(CONSTANTS.PLAID_TYPE_SCORE)}
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
              <div id="belvo"></div>
            </>
        </Modal>
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