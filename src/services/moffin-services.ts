import { callService } from "./api-services";

export type FormType = {
  firstName?: {
    value?: string;
    error?: boolean;
  };
  firstLastName?: {
    value?: string;
    error?: boolean;
  }
  secondLastName?: {
    value?: string;
    error?: boolean;
  }
  basicRFC?: {
    value?: string;
    error?: boolean;
  }
  address?: {
    value?: string;
    error?: boolean;
  }
  city?: {
    value?: string;
    error?: boolean;
  }
  state?: {
    value?: string;
    error?: boolean;
  }
  zipCode?: {
    value?: string;
    error?: boolean;
  }
  exteriorNumber?: {
    value?: string;
    error?: boolean;
  }
  neighborhood?: {
    value?: string;
    error?: boolean;
  }
};

export const createProfile = async (form: FormType, email: string, reqType?: string): Promise<{
  data?: unknown;
  message?: string;
}> => {
  try {
    const profile = Object.keys(form).reduce((bodyReq: any, key: string) => {
      const keyType = key as keyof FormType;
      return {
        ...bodyReq,
        [key]: form[keyType]?.value,
      };
    }, {});
    const response: {
      data?: unknown;
      message?: string;
    } = await callService({
      service: 'external/moffin/create_profile',
      body: { profile, email, serviceRequest: reqType },
    },
    'post');
    if (!response?.data) {
      throw Error("Error getting the plaid info");
    }
    return response;
  } catch (err: any) {
    return {
      message: err.message,
    };
  }
};

export const generateOtp = async (email: string): Promise<{
  data?: unknown;
  message?: string;
}> => {
  try {
    const response: {
      data?: unknown;
      message?: string;
    } = await callService({
      service: 'external/otp/generate',
      body: { email },
    },
    'post');
    if (!response?.data) {
      throw Error("Error getting the otp info");
    }
    return response;
  } catch (err: any) {
    return {
      message: err.message,
    };
  }
};

export const validateOtp = async (otpRequest: {
  email: string;
  func: string;
  otp: string;
  token: string;
}): Promise<{
  data?: {
    success: boolean;
  };
  message?: string;
}> => {
  try {
    const response: {
      data?: {
        success: boolean;
      };
      message?: string;
    } = await callService({
      service: 'external/otp/validate',
      body: otpRequest,
    },
    'post');
    if (!response?.data) {
      throw Error("Error getting the otp info");
    }
    return response;
  } catch (err: any) {
    return {
      message: err.message,
    };
  }
};