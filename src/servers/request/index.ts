// 请求类的封装
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';



// 拦截器接口类型interceptors, 是要达到use函数接受interceptors的类型，才需要设置的接口类型
interface IAxiosInterceptors<T> {
  requestOnFufilledCeptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  requestOnRejectedCeptor?: (err: any) => any;
  responseOnFufilledCeptor?: (res: T) => T;
  responseOnRejectedCeptor?: (err: any) => any;
}

// 扩展配置config类型, config需要更详细的类型
interface IAxiosRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  // 必须是可选的，因为有些模块不需要设置拦截器，只是某些需要的模块才要设置单个拦截器
  interceptors?: IAxiosInterceptors<T>
}


// 你外界怎么调用呢？
/**
 * 外界调用的流程：
 *  request HYRequest请求类 => servers 创建基本的实例对象 => modules模块进行调用
 * 
 */

class HYRequest {
  private _instance: AxiosInstance;
  constructor(
    private config: IAxiosRequestConfig,
  ) {
    // 1. 每个实例对应 => axios实例
    // this._instance = axios.create({
    //   // baseURL: 'xxx',
    //   // timeout: 1000,
    //   // headers: {}
    // });
    // 2. create参数需要传递配置，但是这些配置不能写死，因为需要用户自己配置
    // 3. 拦截器的分类：全局拦截器、独有的拦截器、发起请求时的拦截器
    this._instance = axios.create(config);

    // 4.首先处理全局的拦截器，全局的拦截器interceptor
    // 5.单独的拦截器，比如说，我想对一些模块中进行请求拦截，如果现在是全局interceptor的话，那么每个请求都会被拦截
    // 但是我现在是某些模块请求需要拦截，这该怎么做呢？

    // 6. 模块里面的请求做单独的拦截，或者做更详细的拦截如何做呢？

    //interceptors 请求拦截器分两个回调函数，其中请求成功的回调，请求失败的回调
    this._instance.interceptors.request.use((config) => {
      // console.log('全局的请求成功的拦截器', config);
      return config;
    }, (err) => {
      console.log('全局的请求失败的拦截器', err);
    });

    this._instance.interceptors.response.use((res) => {
      console.log('全局的响应成功的拦截器', res);
      return res.data;
    }, (err) => {
      console.log('全局的响应失败的拦截器', err);

      // 帆哥说的问题：
      // => 原因
      // 请求失败，虽然走的是这里，但是并没有告知异常被捕获，单个拦截器执行的时候
      // 感知不到全局请求的结果状态，所以request请求默认走的是成功状态，并未执行失败状态，
      // 所以要抛出异常。 全局拦截器 => 单个接口拦截器
      // return err;
      return Promise.reject(err);
    })

    // 设置单个拦截器生效
    this._instance.interceptors.request.use(
      config.interceptors?.requestOnFufilledCeptor,
      config.interceptors?.requestOnRejectedCeptor,
    );
    this._instance.interceptors.response.use(
      config.interceptors?.responseOnFufilledCeptor,
      config.interceptors?.responseOnRejectedCeptor
    );
  }


  request<T = any>(config: IAxiosRequestConfig<T>) {
    // 为什么这里不能直接挂在到实例对象上呢？因为挂载到实例对象上的话，
    // 会影响到其他的实例对象，因为此时是共用一个实例对象的，所以拦截器
    // 会共同存在，不能进行隔离。

    // 手动拦截请求
    if (config?.interceptors?.requestOnFufilledCeptor) {
      config = config.interceptors.requestOnFufilledCeptor(<InternalAxiosRequestConfig>config);
    }

    // 如果响应的话，我们要把数据返回出去，但是返回的是个promise，肯定不行。
    // return this._instance.request(config);
    // 为什么AxiosResponse不合适的原因？res.data的问题，太不方便了, 在全局拦截器中res.data之后
    // res.data的类型其实变化了，变得更具体了，我们怎么能够让外界then方法中知道具体的类型呢？
    // res的类型由promise实例对象的泛型决定
    return new Promise<T>((resolve, reject) => {
      this._instance.request<any, T>(config).then((res) => {
          if (config?.interceptors?.responseOnFufilledCeptor) {
            // 手动拦截响应请求
            res = config.interceptors.responseOnFufilledCeptor(res);
          }
          resolve(res);
      }).catch(err => {
        reject(err);
      })
    });
  }

  get<T = any>(config: IAxiosRequestConfig<T>) {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: IAxiosRequestConfig<T>) {
    return this.request({ ...config, method: 'POST' });
   }
}

export default HYRequest;