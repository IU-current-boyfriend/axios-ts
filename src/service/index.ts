import CURequest from "./request/index";
import config from "./config/index";

export const homeRequest = new CURequest({
  ...config,
  interceptors: {
    requestOnFufilledCeptor(config) {
      console.log("homeRequest模块实例化对象成功拦截器", config);
      return config;
    },
    requestOnRejectedCeptor(err) {
      console.log("homeRequest模块实例化对象失败拦截器", err);
      return Promise.reject(err);
    },
    responseOnFufilledCeptor(res) {
      console.log("homeResponse模块实例化对象成功拦截器", res);
      return res;
    },
    responseOnRejectedCeptor(err) {
      console.log("homeResponse模块化实例化对象失败拦截器", err);
      return Promise.reject(err);
    }
  }
});

export const detailRequest = new CURequest({
  ...config
});
