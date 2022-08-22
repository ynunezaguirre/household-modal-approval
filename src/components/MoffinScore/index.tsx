import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import { ActionsButton, CopyText } from "../InitWidget/styled";
import { Col, Row, ButtonContainer, BackButton, OTPContainer, CopyTextAuth } from "./styled";
import { ParamsData } from "../../services/api-services";
import Spinner from "../Spinner";
import { createProfile, FormType, generateOtp, validateOtp } from "../../services/moffin-services";
import { LabelError } from "../Input/styled";
import GoogleAutoComplete from "../GoogleAutoComplete";

type Props = {
  enums: { [key: string]: string };
  email: string;
  isVisible: boolean;
  params?: ParamsData; 
  callback: (s: boolean) => void;
}

const initForm = {
  firstName: undefined,
  firstLastName: undefined,
  secondLastName: undefined,
  basicRFC: undefined,
  address: undefined,
  city: undefined,
  state: undefined,
  zipCode: undefined,
  exteriorNumber: undefined,
  neighborhood: undefined,
};

const STEPS = {
  OTP: 'OTP',
  FORM: 'FORM',
  AUTHORIZATION: 'AUTHORIZATION'
};

const OTP_LENGTH = 6;

const MoffinScore = (props: Props) => {
  const { enums, email, isVisible, params, callback } = props;
  const [otp, setOtp] = useState('');
  const [formComplete, setFormComplete] = useState(false);
  const [step, setStep] = useState(STEPS.FORM);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState<null | FormType>(initForm);
  const [otpToken, setOtpToken] = useState<null | string>(null);

  const requestAuthorization = () => {
    if (email && isVisible) {
      setLoading(true);
      generateOtp(email).then(res => {
        const { data } = res as {
          data: {
            token: string;
          }
        }
        setOtpToken(data.token);
        setLoading(false);
        setStep(STEPS.AUTHORIZATION);
      }).catch(error => {
        setErrorMessage(error.message);
        setLoading(false);
      });
    }
  };
  
  

  useEffect(() => {
    if (form){
      const valid = Object.keys(form).reduce((isValid: boolean, key: string) => {
        const keyType = key as keyof FormType;
        const checkEmpty = !form[keyType] || form[keyType]?.error || !form[keyType]?.value || form[keyType]?.value?.trim() === '';
        return isValid && !checkEmpty;
      }, true);
      setFormComplete(valid);
    }
  }, [form])
  

  const cleanAndClose = () => {
    setOtp('');
    setLoading(false);
    setStep(STEPS.OTP);
    setErrorMessage(null);
    setOtpToken(null);
  };

  const callValidateOtp = () => {
    setLoading(true);
    setErrorMessage(null);
    validateOtp({
      email,
      otp,
      func: 'EXTERNAL',
      token: otpToken as string,
    }).then(res => {
      if (res.data?.success) {
        processForm();
      } else {
        setLoading(false);
        setErrorMessage('Invalid Code');
      }
    }).catch(err => {
      setErrorMessage(err.message);
      setLoading(false);
    });
  };


  const processForm = () => {
    if (form) {
      setErrorMessage(null);
      createProfile(form, email).then((response) => {
        if (!!response.message) {
          setLoading(false);
          setErrorMessage(response.message);
        } else {
          onCloseSuccess(true);
        }
      });
    }
  };

  const onCloseSuccess = (success: boolean) => {
    setFormComplete(false);
    setErrorMessage(null);
    setForm(initForm);
    callback(success);
  }
  

  const onchangeField = (name: string, val: string, hasError?: boolean) => {
    setForm({
      ...form,
      [name]: {
        value: val,
        error: hasError,
      }
    });
  };

  const addressCallback = (p: {
    postalCode?: string;
    state?: string;
    city?: string;
    neighborhood?: string;
    fullAddress?: string;
  }) => {
    console.log('p', p);
    setForm({
      ...form,
      city: { value: p.city || '', error: false },
      zipCode: { value: p.postalCode || '', error: false },
      state: { value: p.state || '', error: false },
      neighborhood: { value: p.neighborhood || '', error: false },
      address: { value: p.fullAddress || '', error: false },
    });
  };

  return <Modal
  top={20}
  visible={isVisible}
  onCancel={cleanAndClose}
  title={enums['MOFFIN_MODAL_TITLE']}>
    <>
      {!!errorMessage && <LabelError>{errorMessage}</LabelError>}
      {step === STEPS.OTP && (
        <>
          <CopyText>{enums['MOFFIN_OTP_COPY']}</CopyText>
          <OTPContainer>
            <Input
              maxLength={OTP_LENGTH}
              label={enums['MOFFIN_OTP_LABEL']}
              placeholder={enums['MOFFIN_OTP_LABEL']}
              onChangeText={setOtp}
              error={form?.state?.error ?  enums['MOFFIN_FIELD_REQUIRED'] : null} />
          </OTPContainer>
          <ButtonContainer>
            <BackButton onClick={() => onCloseSuccess(false)}>{enums['GO_BACK_BUTTON']}</BackButton>
            <ActionsButton>
              {loading && <Spinner verticalAlign='bottom' />}
              <Button disabled={otp.length !== OTP_LENGTH || loading} label={enums['MOFFIN_BUTTON_CONTINUE']} onClick={callValidateOtp} />
            </ActionsButton>
          </ButtonContainer>
        </>
      )}
      {step === STEPS.FORM && (
        <>
        <CopyText>{enums['MOFFIN_COPY']}</CopyText>
        <Input
          label={enums['MOFFIN_FIELD_NAME']}
          size="small"
          placeholder={enums['MOFFIN_FIELD_NAME']}
          onChangeText={(text) => onchangeField('firstName', text)}
          error={form?.firstName?.error ?  enums['MOFFIN_FIELD_REQUIRED'] : null} />

        <Row>
          <Col>
            <Input
              size="small"
              label={enums['MOFFIN_FIELD_LASTNAME_1']}
              placeholder={enums['MOFFIN_FIELD_LASTNAME_1']}
              onChangeText={(text) => onchangeField('firstLastName', text)}
              error={form?.firstLastName?.error ?  enums['MOFFIN_FIELD_REQUIRED'] : null} />
          </Col>
          <Col>
            <Input
              size="small"
              label={enums['MOFFIN_FIELD_LASTNAME_2']}
              placeholder={enums['MOFFIN_FIELD_LASTNAME_2']}
              onChangeText={(text) => onchangeField('secondLastName', text)}
              error={form?.secondLastName?.error ?  enums['MOFFIN_FIELD_REQUIRED'] : null} />
          </Col>
        </Row>

        <Input
          size="small"
          label={enums['MOFFIN_FIELD_RFC']}
          placeholder={enums['MOFFIN_FIELD_RFC']}
          onChangeText={(text) => {
            onchangeField('basicRFC', text, text?.length !== 9 && text?.length !== 10);
          }}
          error={form?.basicRFC?.error ?  enums['MOFFIN_FIELD_REQUIRED'] : null} />

        {!!enums && enums['GOOGLE_PLACE_API'] && (
          <GoogleAutoComplete label={enums['MOFFIN_FIELD_ADDRESS']} placeholder={enums['MOFFIN_FIELD_ADDRESS']} googleKey={enums['GOOGLE_PLACE_API']} callback={addressCallback} />
        )}
        <Row>
          <Col>
            <Input
              size="small"
              label={enums['MOFFIN_FIELD_CITY']}
              placeholder={enums['MOFFIN_FIELD_CITY']}
              onChangeText={(text) => onchangeField('city', text)}
              value={form?.city?.value}
              error={form?.city?.error ?  enums['MOFFIN_FIELD_REQUIRED'] : null} />
          </Col>
          {!!params?.states && (
            <Col>
              <Input
                type="select"
                items={params.states.map(state => {
                  return {
                    label: state.label,
                    value: state.code,
                  }
                })}
                size="small"
                label={enums['MOFFIN_FIELD_STATE']}
                value={form?.state?.value}
                placeholder={enums['MOFFIN_FIELD_STATE']}
                onChangeText={(text) => onchangeField('state', text)}
                error={form?.state?.error ?  enums['MOFFIN_FIELD_REQUIRED'] : null} />
            </Col>
          )}
        </Row>

        <Row>
          <Col>
            <Input
              size="small"
              label={enums['MOFFIN_FIELD_ZCODE']}
              placeholder={enums['MOFFIN_FIELD_ZCODE']}
              value={form?.zipCode?.value}
              onChangeText={(text) => onchangeField('zipCode', text)}
              error={form?.zipCode?.error ?  enums['MOFFIN_FIELD_REQUIRED'] : null} />
          </Col>
          <Col>
            <Input
              size="small"
              label={enums['MOFFIN_FIELD_EXT_NUMBER']}
              placeholder={enums['MOFFIN_FIELD_EXT_NUMBER']}
              onChangeText={(text) => onchangeField('exteriorNumber', text)}
              error={form?.exteriorNumber?.error ?  enums['MOFFIN_FIELD_REQUIRED'] : null} />
          </Col>
        </Row>

        <Input
          size="small"
          label={enums['MOFFIN_FIELD_NGH']}
          placeholder={enums['MOFFIN_FIELD_NGH']}
          value={form?.neighborhood?.value}
          onChangeText={(text) => onchangeField('neighborhood', text)}
          error={form?.neighborhood?.error ?  enums['MOFFIN_FIELD_REQUIRED'] : null} />

        <ButtonContainer>
          <BackButton onClick={() => onCloseSuccess(false)}>Go back</BackButton>
          <ActionsButton>
            {loading && <Spinner verticalAlign='bottom' />}
            <Button disabled={!formComplete || loading} label={enums['MOFFIN_BUTTON_CONTINUE']} onClick={() => {
              requestAuthorization();
            }} />
          </ActionsButton>
        </ButtonContainer>
      </>
      )}
      {step === STEPS.AUTHORIZATION && (
        <>
          <CopyTextAuth>{enums['MOFFIN_AUTHORIZATION_COPY']}</CopyTextAuth>
          <OTPContainer>
            <Input
              maxLength={OTP_LENGTH}
              label={enums['MOFFIN_OTP_LABEL']}
              placeholder={enums['MOFFIN_OTP_LABEL']}
              onChangeText={setOtp}
              error={form?.state?.error ?  enums['MOFFIN_FIELD_REQUIRED'] : null} />
          </OTPContainer>
          <ButtonContainer>
            <BackButton onClick={() => setStep(STEPS.FORM)}>{enums['GO_BACK_BUTTON']}</BackButton>
            <ActionsButton>
              {loading && <Spinner verticalAlign='bottom' />}
              <Button disabled={otp.length !== OTP_LENGTH || !formComplete || loading} label={enums['MOFFIN_MODAL_BUTTON']} onClick={callValidateOtp} />
            </ActionsButton>
          </ButtonContainer>
        </>
      )}
    </>
</Modal>
}

export default MoffinScore;