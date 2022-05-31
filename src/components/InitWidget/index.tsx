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
import IconBancaria from '../../assets/info-bancaria.jpg';
import IconIngresos from '../../assets/info-ingresos.jpg';
import './style.css';
import Button from "../Button";
import Modal from "../Modal";
import ActionCard from "../ActionCard";
import { GetPlaidToken, GetPlaidInfo, ProcessForm } from "../../services/plaid-services";
import { CONSTANTS } from "../../configs/constants";
import PlaidLink from "../PlaidLink";
import Input from "../Input";
import { validateEmail } from "../../utils";
import Spinner from "../Spinner";
export interface Props {
  label: string;
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  const [plaidToken, setPlaidToken] = useState<null | {
    token: string;
    type: string;
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
    if (!!bankData && !!incomeData) {
      setFormComplete(true);
    }
  }, [bankData, incomeData]);

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
    if (!isValidEmail || email.trim() ==='') {
      return;
    }
    startLoading(type, true);
    setErrorMessage(null);
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
  }

  const requestContact = () => {

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
          <LabelMessage>Obtén una hipoteca en minutos para esta propiedad</LabelMessage>
          <Button label="Aplicar ya! ->" onClick={startFlow} />
        </MessageContainer>
      </InitWidgetContainer>
      <Modal
        visible={isModalVisible}
        onCancel={cleanAndClose}
        title={creditResponse?.credit?.hasCredit ?
          'Perfecto! estamos evaluando tu crédito. Pronto nos contactaremos.' :
          'Valida tu información y obtén esta propiedad'}>
          <>
            {!!errorMessage && <AlertMessage>{errorMessage}</AlertMessage>}
            {formLoading && (
              <LoaderContainer>
                <Spinner />
                <LabelLoading>
                  Estamos procesando y validando tu información.<br/>
                  No cierres esta ventana.
                </LabelLoading>
              </LoaderContainer>
            )}
            {!formLoading && !creditResponse?.credit?.hasCredit && (
              <>
                <Input
                  disabled={loadingBank || loadingIncome || !!bankData || !!incomeData}
                  placeholder="mail@mail.com"
                  onChangeText={onChangeText}
                  error={isValidEmail ? null : 'The email is invalid'} />
                <ActionCardsContainer>
                  <ActionCard
                    title="Validar información bancaria"
                    description="Verificaremos tu disponibilidad para la cuota inicial del inmueble en 1 minuto"
                    icon={IconBancaria} 
                    success={!!bankData}
                    loading={loadingBank}
                    onPress={() => generatePlaidToken(CONSTANTS.PLAID_TYPE_ASSETS)}/>
                  <ActionCard
                    title="Validar mis ingresos"
                    description="Verificaremos tu capacidad de pago en 1 minuto"
                    loading={loadingIncome}
                    success={!!incomeData}
                    onPress={() => generatePlaidToken(CONSTANTS.PLAID_TYPE_INCOME)}
                    icon={IconIngresos} />
                </ActionCardsContainer>
                <ActionsButton>
                  <Button disabled={!formComplete} label="Procesar información" onClick={processForm} />
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
                  <Button label="Cerrar" onClick={cleanAndClose} />
                </ActionsButton>
              </>
            )}
            
            {plaidToken?.token && (
              <PlaidLink
                token={plaidToken.token}
                handleResponse={handlePlaidResponse} />
            )}
          </>
      </Modal>
    </ThemeProvider>);
};

export default InitWidget;