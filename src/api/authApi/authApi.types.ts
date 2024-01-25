export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha: null | string;
};
export type IsAuthorizeType = {
  id: number;
  email: string;
  login: string;
};
