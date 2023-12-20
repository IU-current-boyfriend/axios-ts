import {
  hyRequestHome,
} from "../..";


// hyRequestHome.request({
//   url: '/get_demo',
// }).then(res => {
//   // 目前已经跑通了接口
//   console.log('home: =>', res);
// });

/**
 *     error_code: 0,
    error_msg: 'ok',
    data: []
 */
interface IDetailData {
  error_code: number;
  error_msg: string;
  data: any[]
}


hyRequestHome.request<IDetailData>({
  url: '/post_demo2',
  method: 'POST',
  // 这个地方想要有拦截器，能够拦截请求
  interceptors: {
    requestOnFufilledCeptor(config) {
      // console.log('hyRequestHome请求成功的拦截器 =>', config);
      return config;
    },
    requestOnRejectedCeptor(err) {
      console.log('hyRequestHome请求失败的拦截器 =>', err);
    },
    responseOnFufilledCeptor(config) {
      console.log('hyRequest响应成功的拦截器: =>', config);
      return config;
    },
    responseOnRejectedCeptor(err) {
      console.log('hyRequest响应失败的拦截器: =>', err);
    },
  },
}).then((res) => {
  console.log('home2:=>', res.error_code, res.error_msg, res.data);
}).catch(err => {
  console.log('error: =>', err);
}) 
