import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import { ButtonContainer, LinkButton, IncomeContainer, IncomeDescription, RemoveButton, ActionIncomeContainer } from "./styled";
import { ParamsData } from "../../services/api-services";
import { GetPlaidToken, GetPlaidInfo, PlaidMetadata } from "../../services/plaid-services";
import Spinner from "../Spinner";
import { LabelError } from "../Input/styled";
import ActionCard from "../ActionCard";
import IconBancaria from '../../assets/info-bancaria.png';
import IconCheck from '../../assets/icon-check-list.svg';
import { CONSTANTS } from "../../configs/constants";
import PlaidLink from "../PlaidLink";
import { PlaidLinkError } from "react-plaid-link";
import { ArrowAction } from "../ActionCard/styled";
import { ActiveButton } from "../Button/styled";
import { ActionsButton } from "../InitWidget/styled";

type Props = {
  enums: { [key: string]: string };
  email: string;
  isVisible: boolean;
  params?: ParamsData; 
  callback: (s: unknown | null) => void;
  language?: string;
  openInPlainMode?: boolean;
  incomeHandler?: (income: unknown) => void;
  setExternalLoading?: (loading: boolean) => void;
}

export interface AccountsData {
  country: string;
  data: PlaidMetadata;
}

const IncomeModal = (props: Props) => {
  const { enums, email, isVisible, callback, language, openInPlainMode, incomeHandler, setExternalLoading } = props;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [incomeData, setIncomeData] = useState<null | PlaidMetadata>({
    institution: {
      name: "Amz a to z",
    },
    account: [],
  });
  const [plaidToken, setPlaidToken] = useState<null | {
    token: string;
    type: string;
  }>(null);
  
  useEffect(() => {
    if (incomeData) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
    if (!!openInPlainMode && !!incomeHandler) {
      incomeHandler(incomeData);
    }
  }, [incomeData]);

  useEffect(() => {
    if (!!setExternalLoading) {
      setExternalLoading(loading);
    }
  }, [loading]);
  
  const cleanAndClose = () => {
    setLoading(false);
    setErrorMessage(null);
  };

  const onCloseSuccess = (success: unknown) => {
    setErrorMessage(null);
    callback(success);
    setIncomeData(null);
  };

  const completeIncomeData = () => {
    callback(incomeData);
    setIncomeData(null);
  };

  const plaidTokenFlow = () => {
    setLoading(true);
    GetPlaidToken(CONSTANTS.TYPE_INCOME, email.trim(), enums['PLAID_LANGUAGE'] || 'en').then(tokenResponse => {
      if (tokenResponse.token) {
        setPlaidToken({
          token: tokenResponse.token,
          type: CONSTANTS.TYPE_INCOME,
        });
      } else if (tokenResponse.message) {
        setErrorMessage(tokenResponse.message);
        setLoading(false);
      }
    });
  }

  const removeIncome = () => {
    setIncomeData(null);
  };

  const onCancelPlaid = (error: null | PlaidLinkError) => {
    if (plaidToken?.token) {
      setLoading(false);
      if (error?.display_message) {
        setErrorMessage(error.display_message);
      }
      setPlaidToken(null);
    }
  };

  const handlePlaidResponse = (publicToken: string | null, error: ErrorEvent | null, data?: PlaidMetadata) => {
    if (plaidToken?.token) {
      if (error) {
        setLoading(false);
        return setErrorMessage(error.message);
      }
      if (publicToken) {
        GetPlaidInfo(publicToken, plaidToken.type, email).then(response => {
          setLoading(false);
          if (response.message) {
            setErrorMessage(response.message);
          }
          setPlaidToken(null);
          if (data) {
            setIncomeData(data);
          }
        });
      }
    }
  };

  const renderContent = () => {
    return <>
      <ActionCard
        title=""
        description={enums['ACTION_CARD_BANK_DESCRIPTION']}
        icon={IconBancaria}
        plain />
      {!!errorMessage && <LabelError>{errorMessage}</LabelError>}
      <>
        {incomeData?.institution && (
          <IncomeContainer>
            <IncomeDescription>
              <span>{enums['ASSET_REMOVE_ACCOUNT']}</span>
              {incomeData.institution.name}
              <RemoveButton onClick={() => removeIncome()}>{enums['ASSET_REMOVE_ACCOUNT']}</RemoveButton>
            </IncomeDescription>
            <ArrowAction src={IconCheck} />
          </IncomeContainer>
        )}

        {!incomeData && (
          <ActionIncomeContainer>
            <ActionsButton>
              {loading && <Spinner verticalAlign='bottom' />}
              <Button disabled={loading} label={enums['ACTION_CARD_INCOME_TITLE']} onClick={plaidTokenFlow} />
            </ActionsButton>
          </ActionIncomeContainer>
        )}

        {!openInPlainMode && (
          <ButtonContainer>
          {!loading && (
            <LinkButton onClick={() => onCloseSuccess(null)}>{enums['GO_BACK_BUTTON']}</LinkButton>
          )}
          <ActionsButton>
            {loading && <Spinner verticalAlign='bottom' />}
            <Button disabled={!isComplete || loading} label={enums['ASSET_NEXT_BUTTON']} onClick={completeIncomeData} />
          </ActionsButton>
        </ButtonContainer>
        )}
      </>
      {plaidToken?.token && (
        <PlaidLink
          token={plaidToken.token}
          onCancelPlaid={onCancelPlaid}
          handleResponse={handlePlaidResponse} />
      )}
    </>;
  };

  return !openInPlainMode ?
    <Modal
      top={20}
      visible={isVisible}
      onCancel={cleanAndClose}
      title={enums['ACTION_CARD_BANK_TITLE']}>
    {renderContent()}
    </Modal> :
    renderContent();
}

export default IncomeModal;