/**
 * 需求：API基础配置，根据环境变量模式选择不同的api
 *
 *  例如：
 *      开发环境模式：
 *          baseURL: http://localhost-dev:3000
 *          mockURL: http://localhost-dev-mock:3000
 *          timeout: 3000
 *
 *      生产环境模式
 *          baseURL: http://localhost-prod:3000
 *          mockURL: http://localhost-prod-moc:3000
 *          timeout: 3000
 *
 *      测试环境模式
 *          baseURL: http://localhost-test:3000
 *          mockURL: http://localhost-test-mock:3000
 *          timeout: 4000
 *
 */

import type { TypeEnvConfigApiIndex } from "./type";

const env = import.meta.env.MODE || "production";

// 策略模式
const envConfigApi: TypeEnvConfigApiIndex = {
  development: {
    baseURL: "http://localhost:3000",
    mockURL: "http://localhost-dev-mock:3000",
    timeout: 3000
  },
  production: {
    baseURL: "http://localhost-prod:3000",
    mockURL: "http://localhost-prod-mock:3000",
    timeout: 3000
  },
  test: {
    baseURL: "http://localhost-test:3000",
    mockURL: "http://localhost-test-mock:3000",
    timeout: 5000
  }
};

export default {
  // 当前环境变量模式
  envlopment: env,
  // 是否开启mock数据
  mock: false,
  // 接口地址
  ...envConfigApi[env]
};
