import HYRequest from "./request";
import { BASE_URL, TIME_OUT } from "./config";

export const hyRequestHome = new HYRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT
});

export const hyRequestDetail = new HYRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  /**
   * 比如说，我想在detail这么模块下设置请求、响应拦截器，
   * 那只能通过传入配置的方式进行处理。但是现在config的类型
   * 我们可以通过源码看到，并不存在interceptor配置，所以你
   * 传入interceptor的话，类型检验肯定是错误的。
   * 
   * 我靠，那怎么弄呢？
   *  实际上我们可以想到TS接口继承的能力，我们可以自己设置一个接口
   *  然后扩展类型
   * 
   */
  interceptors: {
    requestOnFufilledCeptor(config) {
      console.log('detail模块请求成功的拦截器', config);
      return config;
    },
    requestOnRejectedCeptor(err) {
      console.log('detail模块请求失败的拦截器', err);
    },
    responseOnFufilledCeptor(res) {
      console.log('detail模块响应成功的拦截器', res);
      return res;
    },
    responseOnRejectedCeptor(err) {
      console.log('detail模块响应失败的拦截器', err);

    },
  }
});
