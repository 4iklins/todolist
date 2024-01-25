import { ResponseType } from '../todolistApi';
import { instance } from '../instance';
import { IsAuthorizeType, LoginParamsType } from './authApi.types';

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
  captcha() {
    return instance.get<{ url: string }>('/security/get-captcha-url');
  },
};
