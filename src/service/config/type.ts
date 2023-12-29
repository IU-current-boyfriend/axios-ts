interface IEnvConfigApiValue {
  baseURL: string;
  mockURL: string;
  timeout: number;
}

export type TypeEnvConfigApiIndex = {
  [key in string]: IEnvConfigApiValue;
};
