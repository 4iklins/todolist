import { ResponseType } from './todolist-api';
import { instance } from './instance';

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
};
export type IsAuthorizeType = {
  id: number;
  email: string;
  login: string;
};

export const authApi = {
  login(params: LoginParamsType) {
    return instance.post<ResponseType<{ userId: number }>>('/auth/login', params);
  },
  me() {
    return instance.get<ResponseType<IsAuthorizeType>>('/auth/me');
  },
  logout() {
    return instance.delete<ResponseType>('/auth/login');
  },
};
