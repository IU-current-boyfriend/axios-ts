import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type { IAxiosRequestConfig } from "./type";

/**
 * 两个问题：
 * 1. 在模块中返回的promise.then(res)，参数res如何具体类型?
 * 2. 在全局响应拦截器中使用res.data，为什么会抛出错误，原因是res类型变化了，如何解决？
 *
 */

const ENV_PRODUCTION = "production";
const GET_METHOD = "GET";
export default class CURequest {
  // axios实例对象
  private _instance: AxiosInstance;
  // axios请求配置
  private _requestConfig: IAxiosRequestConfig;
  constructor(config: IAxiosRequestConfig) {
    // 用户配置项
    this._requestConfig = config;
    // axios实例化对象
    this._instance = axios.create(this._requestConfig);
    // 全局请求的拦截器
    this._instance.interceptors.request.use(
      (config) => {
        console.log("全局请求成功拦截器", config);
        return config;
      },
      (err) => {
        console.log("全局请求失败拦截器", err);
        return Promise.reject(err);
      }
    );
    // 全局响应的拦截器
    this._instance.interceptors.response.use(
      (res) => {
        console.log("全局响应成功拦截器", res);
        return res.data;
      },
      (err) => {
        console.log("全局响应失败拦截器", err);
        return Promise.reject(err);
      }
    );
    // 模块实例对象请求拦截器
    this._instance.interceptors.request.use(
      this._requestConfig?.interceptors?.requestOnFufilledCeptor,
      this._requestConfig?.interceptors?.requestOnRejectedCeptor
    );
    // 模块实例对象响应拦截器
    this._instance.interceptors.response.use(
      this._requestConfig?.interceptors?.responseOnFufilledCeptor,
      this._requestConfig?.interceptors?.requestOnRejectedCeptor
    );
  }

  request<T = any>(config: IAxiosRequestConfig<T>) {
    // 单个接口的请求拦截器
    if (config?.interceptors?.requestOnFufilledCeptor) {
      config = config.interceptors.requestOnFufilledCeptor(<InternalAxiosRequestConfig>config);
    }

    // 处理配置项
    const options = this._createAxiosOptions<T>(config);

    // 发送请求逻辑
    return new Promise<T>((resolve, reject) => {
      this._instance
        .request<any, T>(options)
        .then((res) => {
          if (config?.interceptors?.responseOnFufilledCeptor) {
            res = config.interceptors.responseOnFufilledCeptor(res);
          }
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private _createAxiosOptions<T>(config: IAxiosRequestConfig<T>): IAxiosRequestConfig<T> {
    const env = this._requestConfig.envlopment;
    let isMock = config.mock;
    const method = config.method || "get";

    if (method?.toLocaleUpperCase() === GET_METHOD) {
      // get方法携带参数需要设置为params，post方法携带参数需要设置data
      config.params = config.data;
    }

    if (typeof isMock !== "undefined") {
      // 根据用户配置决定是否使用mock接口
      isMock = config.mock;
    }
    // 生产模式必须是正式接口
    if (env === ENV_PRODUCTION) {
      this._instance.defaults.baseURL = this._requestConfig.baseURL;
    } else {
      this._instance.defaults.baseURL = isMock ? this._requestConfig.mockURL : this._requestConfig.baseURL;
    }
    return config;
  }

  get<T>(config: IAxiosRequestConfig<T>) {
    this.request<T>({ ...config, method: 'get' });
  }

  post<T>(config: IAxiosRequestConfig<T>) {
    this.request<T>({ ...config, method: 'post' });
  }
}
