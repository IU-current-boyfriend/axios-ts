import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export interface IAxiosRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  envlopment?: string;
  mockURL?: string;
  mock?: boolean;
  interceptors?: {
    // config参数最新类型InternalAxiosRequestConfig需要注意一下
    requestOnFufilledCeptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
    requestOnRejectedCeptor?: (err: any) => any;
    responseOnFufilledCeptor?: (res: T) => T;
    responseOnRejectedCeptor?: (err: any) => any;
  };
}
