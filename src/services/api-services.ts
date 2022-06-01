import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';

interface Props {
  headers?: object;
  body?: object | null;
  service: string;
}

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/v1',
});

axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const apiError = error.response ? (error.response as any).data?.message : null;
    if (apiError) {
      return Promise.reject(new Error(apiError));
    }
    return Promise.reject(error);
  },
);

export const setDefaultToken = (token: string) => {
  axiosInstance.defaults.headers.common['x-hh-appr'] = token;
};

export const callService = (
  { headers, body, service }: Props,
  method: Method = 'post',
): Promise<any> => {
  let reqHeader = {};
  if (headers) {
    reqHeader = Object.assign(reqHeader, headers);
  }
  let request: AxiosRequestConfig = {
    headers: reqHeader,
    method,
    url: service,
    withCredentials: true,
  };
  if (method === 'post') {
    request.data = body;
  }
  return axiosInstance(request).then((response: any) => response.data);
};
