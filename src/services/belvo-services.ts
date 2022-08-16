import { callService } from "./api-services";


export const GetBelvoToken = async (type: string, email: string): Promise<{
  message?: string;
  token?: string;
  country_codes?: string[];
  external_id?: string;
}> => {
  try {
    const response: {
      linkToken: string;
      country_codes: string[];
      external_id: string;
    } = await callService({
      service: `external/belvo_token?type=${type}&email=${email}`,
    },
    'get');
    if (!response?.linkToken) {
      throw Error("Error generating token");
    }
    return {
      token: response.linkToken,
      country_codes: response.country_codes,
      external_id: response.external_id,
    };
  } catch (err: any) {
    return {
      message: err.message,
    };
  }
};

export const GetBelvoInfo = async (params: {
  institution: string;
  link: string;
  type: string;
  email: string;
}): Promise<{
  accounts?: Array<{
    mask: string;
    name: string;
  }>;
  data?: unknown;
  type?: string;
  message?: string;
}> => {
  try {
    const response: {
      data: unknown;
      type: string;
    } = await callService({
      service: 'external/belvo_info',
      body: params,
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

export const ProcessForm = async (publicToken: string, email: string | null = null): Promise<{
  credit?: unknown;
  message?: string;
}> => {
  try {
    const response: {
      credit: unknown;
      type: string;
    } = await callService({
      service: 'external/process_approval',
      body: {
        email, 
        publicToken,
      }
    },
    'post');
    if (!response?.credit) {
      throw Error("Error getting the plaid info");
    }
    return response;
  } catch (err: any) {
    return {
      message: err.message,
    };
  }
};