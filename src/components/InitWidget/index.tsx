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
  TableCredit,
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

declare global {
  interface Window { belvoSDK: any; }
}
export interface Props {
  label: string;
  incomeRequest?: boolean;
  latam?: boolean;
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

const InitWidget = (props: Props) => {
  const { incomeRequest, latam } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
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
  const [loadingIncome, setLoadingIncome] = useState(false);
  const [email, setEmail] = useState('');
  const [isValidEmail, setValidEmail] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [publicToken, setPublicToken] = useState<string | null>();
  const [creditResponse, setCreditResponse] = useState<null | CreditResponse>(null);

  useEffect(() => {
    if (!!bankData && (!!incomeData || !incomeRequest)) {
      setFormComplete(true);
    }
  }, [bankData, incomeData]);

  useEffect(() => {
    if (latam) {
      const node = document.createElement('script');
      node.src = 'https://cdn.belvo.io/belvo-widget-1-stable.js';
      node.type = 'text/javascript';
      node.async = true;
      document.body.appendChild(node);
    }
  }, [latam]);

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

  const generatePlaidToken = (type: string) => {
    const invalidMail = (!isValidEmail || email.trim() === '');
    if (invalidMail || loadingIncome || loadingBank) {
      if (invalidMail) {
        setErrorMessage('The email is required');
      }
      return;
    }
    startLoading(type, true);
    setErrorMessage(null);
    if (latam) {
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
        locale: 'en',
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

  const startLoading = (type: string, loading: boolean, data: unknown = null) => {
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
    setLoadingIncome(false);
    setEmail('');
    setValidEmail(true);
    setFormLoading(false);
    setPublicToken(null);
    setCreditResponse(null);
    setIsModalVisible(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <InitWidgetContainer>
        <ImageIcon>
          <CircleBack />
          <img src={IconImage} alt="iconbutton"/>
        </ImageIcon>
        <MessageContainer>
          <LabelMessage>Get prequalified for a mortgage in minutes</LabelMessage>
          <Button label="Start" onClick={startFlow} />
        </MessageContainer>
      </InitWidgetContainer>
      <Modal
        visible={isModalVisible}
        onCancel={cleanAndClose}
        title={creditResponse?.credit?.hasCredit ?
          'Congrats! Our system is analyzing your credit. You will receive the answer by email.' :
          'Validate your information'}>
          <>
            {!!errorMessage && <AlertMessage>{errorMessage}</AlertMessage>}
            {formLoading && (
              <LoaderContainer>
                <Spinner />
                <LabelLoading>
                 We are validating your information
                </LabelLoading>
              </LoaderContainer>
            )}
            {!formLoading && !creditResponse?.credit?.hasCredit && (
              <>
                <Input
                  disabled={loadingBank || loadingIncome || !!bankData || !!incomeData}
                  placeholder="Email"
                  onChangeText={onChangeText}
                  error={isValidEmail ? null : 'The email is invalid'} />
                <ActionCardsContainer>
                  <ActionCard
                    title="Bank Account Data"
                    description="We verify your proof of funds for down payment and underwrite you using the 6 last months of your bank statement."
                    icon={IconBancaria} 
                    success={!!bankData}
                    loading={loadingBank}
                    onPress={() => generatePlaidToken(CONSTANTS.PLAID_TYPE_ASSETS)}/>
                  {incomeRequest && (
                    <ActionCard
                    title="Income Verification"
                    description="We verify your income to analyze your capacity of repayment"
                    loading={loadingIncome}
                    success={!!incomeData}
                    onPress={() => generatePlaidToken(CONSTANTS.PLAID_TYPE_INCOME)}
                    icon={IconIngresos} />
                  )}
                </ActionCardsContainer>
                <ActionsButton>
                  <Button disabled={!formComplete} label="Get prequalified" onClick={processForm} />
                </ActionsButton>
              </>
            )}

            {!formLoading && creditResponse?.credit?.hasCredit && (
              <>
                {/* <TableCredit cellSpacing={0}>
                  <tr className="header">
                    <td className="param">Credito<br/>Preaprobado</td>
                    <td className="creditValue">{creditResponse.credit.amount}</td>
                  </tr>
                  <tr>
                    <td className="param">Plazo</td>
                    <td className="value">{creditResponse.credit.period}</td>
                  </tr>
                  <tr>
                    <td className="param">Tasa</td>
                    <td className="value">{creditResponse.credit.rate}</td>
                  </tr>
                  <tr>
                    <td className="param">Entrada</td>
                    <td className="value">{creditResponse.credit.initial}</td>
                  </tr>
                </TableCredit> */}
                <ActionsButton>
                  <Button label="Cool" onClick={cleanAndClose} />
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
    </ThemeProvider>);
};

InitWidget.defaultProps = {
  incomeRequest: true,
  latam: false,
};

export default InitWidget;