import { callService } from "./api-services";

export interface PlaidMetadata {
  account: Array<{
    mask: string;
    name: string;
  }>,
  institution: {
    name: string;
  }
}


export const GetPlaidToken = async (type: string, email: string): Promise<{
  message?: string;
  token?: string;
}> => {
  try {
    const response: {
      linkToken: string;
    } = await callService({
      service: `external/plaid_token?type=${type}&email=${email}`,
    },
    'get');
    if (!response?.linkToken) {
      throw Error("Error generating plaid token");
    }
    return {
      token: response.linkToken,
    };
  } catch (err: any) {
    return {
      message: err.message,
    };
  }
};

export const GetPlaidInfo = async (publicToken: string, type: string, email: string | null = null): Promise<{
  data?: unknown;
  type?: string;
  message?: string;
}> => {
  try {
    const response: {
      data: unknown;
      type: string;
    } = await callService({
      service: 'external/plaid_info',
      body: {
        email, 
        publicToken,
        type,
      }
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

export const ProcessForm = async (formatEmail: string, email: string | null = null): Promise<{
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
        formatEmail,
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