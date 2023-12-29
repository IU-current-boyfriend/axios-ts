import { homeRequest } from "@/service";

interface IHomeData {
  data: any[];
  error_code: number;
  error_msg: string;
}

homeRequest
  .request<IHomeData>({
    url: "/get_demo",
    mock: true,
    method: "GET",
    interceptors: {
      requestOnFufilledCeptor(config) {
        console.log("接口/get_demo请求成功拦截器", config);
        return config;
      },
      requestOnRejectedCeptor(err) {
        console.log("接口/get_demo请求失败拦截器", err);
      },
      responseOnFufilledCeptor(res) {
        console.log("接口/get_demo响应成功拦截器", res);
        return res;
      },
      responseOnRejectedCeptor(err) {
        console.log("接口/get_demo响应失败拦截器", err);
      }
    }
  })
  .then((res) => {
    // 为什么是unknown类型呢？
    console.log("res: =>", res.data, res.error_code, res.error_msg);
  })
  .catch((err) => {
    console.log("err: =>", err);
  });
