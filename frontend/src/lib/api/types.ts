import type { InternalAxiosRequestConfig } from 'axios';
export interface AuthenticatedRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _accountId?: string;
}
