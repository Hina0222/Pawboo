import { httpMethod } from './axios-instance';
import type { AxiosRequestConfig } from 'axios';

export const apiClient = {
  get: <Data>(url: string, options?: AxiosRequestConfig): Promise<Data> =>
    httpMethod<Data>({ url, method: 'GET' }, options),

  post: <Data>(url: string, body?: object, options?: AxiosRequestConfig): Promise<Data> =>
    httpMethod<Data>({ url, method: 'POST', data: body }, options),

  put: <Data>(url: string, body?: object, options?: AxiosRequestConfig): Promise<Data> =>
    httpMethod<Data>({ url, method: 'PUT', data: body }, options),

  patch: <Data>(url: string, body?: object, options?: AxiosRequestConfig): Promise<Data> =>
    httpMethod<Data>({ url, method: 'PATCH', data: body }, options),

  delete: <Data>(url: string, options?: AxiosRequestConfig): Promise<Data> =>
    httpMethod<Data>({ url, method: 'DELETE' }, options),
};
