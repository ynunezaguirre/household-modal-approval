import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import { ActionsButton } from "../InitWidget/styled";
import { SelectContainer, SelectCountry, ButtonContainer, LinkButton, AccountContainer, AccountDescription, AddContainer, CardSelect, RemoveButton, CloseButton } from "./styled";
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
import { GetBelvoInfo, GetBelvoToken } from "../../services/belvo-services";

type Props = {
  enums: { [key: string]: string };
  email: string;
  isVisible: boolean;
  params?: ParamsData; 
  callback: (s: unknown | null) => void;
  language?: string;
}

const countries = {
  USA: 'USA',
  MX: 'MX',
  CO: 'CO',
  BRA: 'BRA',
};

const AssetModal = (props: Props) => {
  const { enums, email, isVisible, callback, language } = props;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [country, setCountry] = useState<string>('');
  const [accountsPreparing, setAccountPreparing] = useState(1);
  const [accounts, setAccounts] = useState<Array<{
    country: string;
    data: PlaidMetadata;
  }>>([]);
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
  
  useEffect(() => {
    if (accounts.length === accountsPreparing && accounts.length > 0) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [accountsPreparing, accounts]);

  useEffect(() => {
    if (belvoToken?.external_id && belvoToken.token) {
      createBelvoWidget();
    }
  }, [belvoToken])
  

  const cleanAndClose = () => {
    setLoading(false);
    setErrorMessage(null);
  };


  const onCloseSuccess = (success: unknown) => {
    setErrorMessage(null);
    callback(success);
    setAccounts([]);
    setAccountPreparing(1);
  };

  const completeAccountData = () => {
    callback(accounts);
    setAccounts([]);
    setAccountPreparing(1);
  };

  const plaidTokenFlow = () => {
    GetPlaidToken(CONSTANTS.TYPE_ASSETS, email.trim(), enums['PLAID_LANGUAGE'] || 'en').then(tokenResponse => {
      if (tokenResponse.token) {
        setPlaidToken({
          token: tokenResponse.token,
          type: CONSTANTS.TYPE_ASSETS,
        });
      } else if (tokenResponse.message) {
        setErrorMessage(tokenResponse.message);
        setLoading(false);
      }
    });
  }

  const countryChange = (e: string ,index: number) => {
    if (e !== '' && !!e) {
      setCountry(e);
      switch (e) {
        case countries.USA:
          setLoading(true);
          plaidTokenFlow();
          break;
        default:
          belvoTokenFlow();
          break;
      }
    }
  };

  const removeAccount = (index: number) => {
    setAccounts(accounts.filter((_acc, i) => index !== i));
    setAccountPreparing(accountsPreparing - 1);
  };

  const onCancelPlaid = (error: null | PlaidLinkError) => {
    if (plaidToken?.token) {
      setLoading(false);
      if (error?.display_message) {
        setErrorMessage(error.display_message);
      }
      setPlaidToken(null);
      setCountry('');
    }
  };

  const handlePlaidResponse = (publicToken: string | null, error: ErrorEvent | null, data?: PlaidMetadata) => {
    if (plaidToken?.token && data) {
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
          setAccounts(accounts.concat([{
            country,
            data,
          }]));
          setCountry('');
        });
      }
    }
  };

  const belvoTokenFlow = () => {
    setLoading(true);
    GetBelvoToken(CONSTANTS.TYPE_ASSETS, email.trim()).then(tokenResponse => {
      if (tokenResponse.token) {
        setBelvoToken({
          token: tokenResponse.token,
          type: CONSTANTS.TYPE_ASSETS,
          external_id: tokenResponse.external_id,
          country_codes: tokenResponse.country_codes,
        });
      } else if (tokenResponse.message) {
        setErrorMessage(tokenResponse.message);
        setCountry('');
        setLoading(false);
      }
    });
  }
  
  const createBelvoWidget = () => {
    if (belvoToken?.external_id && belvoToken.token) {
      const config = {
        external_id: belvoToken.external_id,
        locale: language || 'en',
        institution_types: ['retail', 'business'],
        callback: onBelvoResponse,
        onExit: (data: any) => {},
        onEvent: (data: any) =>  {
          if (data?.eventName === 'PAGE_LOAD' && data?.meta_data?.page.indexOf('abandonSurvey') !== -1) {
            setCountry('');
            if (belvoToken?.token) {
              setLoading(false);
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
      console.log(belvoToken, institution);
      GetBelvoInfo({
        institution,
        link,
        type: belvoToken?.type || '',
        email,
      }).then(response => {
        setLoading(false);
        if (response.message) {
          setErrorMessage(response.message);
        } else {
          setAccounts(accounts.concat([{
            country,
            data: {
              institution: {
                name: institution,
              },
              account: response.accounts || [],
            }
          }]))
        }
        setCountry('');
        setBelvoToken(null);
      });
    }
  };

  return <Modal
    top={20}
    visible={isVisible}
    onCancel={cleanAndClose}
    title={enums['ACTION_CARD_BANK_TITLE']}>
    <>
      <ActionCard
        title=''
        description={enums['ACTION_CARD_BANK_DESCRIPTION']}
        icon={IconBancaria}
        plain />
      {!!errorMessage && <LabelError>{errorMessage}</LabelError>}
      <>
        {accounts.map((account, index: number) => (
          <AccountContainer key={`account-${index}`}>
            <AccountDescription>
              {account.data.institution.name}<br/>
              {account.data.account?.map((acc => (
                <span>{`${acc.name} ****${acc.mask}`}</span>
              )))}
              
              <RemoveButton onClick={() => removeAccount(index)}>{enums['ASSET_REMOVE_ACCOUNT']}</RemoveButton>
            </AccountDescription>
            <ArrowAction src={IconCheck} />
          </AccountContainer>
        ))}
        {accounts.length ===  accountsPreparing && (
          <AddContainer>
            <LinkButton onClick={() => setAccountPreparing(accountsPreparing + 1)}>{enums['ASSET_ADD_ACCOUNT']}</LinkButton>
          </AddContainer>
        )}
        {accounts.length !== accountsPreparing && (
          <CardSelect>
            {!loading && (
              <CloseButton onClick={() => setAccountPreparing(accountsPreparing - 1)}>&#10006;</CloseButton>
            )}
            <SelectContainer>
              <SelectCountry value={country} onChange={(e) => countryChange(e.target.value, 0)} disabled={loading}>
                <option value={""}>{enums['ASSET_SELECT_COUNTRY']}</option>
                <option value={"USA"}>{enums['COUNTRY_LIST_USA']}</option>
                <option value={"MX"}>{enums['COUNTRY_LIST_MX']}</option>
                <option value={"CO"}>{enums['COUNTRY_LIST_CO']}</option>
                <option value={"BRA"}>{enums['COUNTRY_LIST_BR']}</option>
              </SelectCountry>
            </SelectContainer>
          </CardSelect>
        )}
        

        <ButtonContainer>
          {!loading && (
            <LinkButton onClick={() => onCloseSuccess(null)}>{enums['GO_BACK_BUTTON']}</LinkButton>
          )}
          <ActionsButton>
            {loading && <Spinner verticalAlign='bottom' />}
            <Button disabled={!isComplete || loading} label={enums['ASSET_NEXT_BUTTON']} onClick={completeAccountData} />
          </ActionsButton>
        </ButtonContainer>
      </>
      {plaidToken?.token && (
        <PlaidLink
          token={plaidToken.token}
          onCancelPlaid={onCancelPlaid}
          handleResponse={handlePlaidResponse} />
      )}
      <div id="belvo"></div>
    </>
</Modal>
}

export default AssetModal;