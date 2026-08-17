import axios, { AxiosRequestConfig } from 'axios';
import { getQueryClient } from '@/shared/api/get-query-client';
import { ApiError } from '@/shared/api/api-error';
import { apiLog } from '../../../alog.config';

declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async config => {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    const accessToken = (await cookies()).get('access_token')?.value;
    if (accessToken) {
      config.headers.Cookie = `access_token=${accessToken}`;
    }
  }
  return config;
});

function handleAuthFailure() {
  getQueryClient().clear();
  if (typeof window !== 'undefined') {
    window.location.href = '/api/auth/clear';
  }
}

let refreshPromise: Promise<void> | null = null;

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // _retry 덕에 refresh 자신의 401은 위 가드에서 reject — 인터셉터 재귀가 없다
      refreshPromise ??= axiosInstance
        .post('/auth/refresh', null, { _retry: true })
        .then(() => {})
        .finally(() => {
          refreshPromise = null;
        });

      await refreshPromise;
      return axiosInstance(originalRequest);
    } catch {
      handleAuthFailure();
      return Promise.reject(error);
    }
  }
);

export const httpMethod = async <Data>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<Data> => {
  const method = (config.method ?? 'GET').toUpperCase();
  apiLog.log(`${method} ${config.url}`, config.params ?? config.data);

  try {
    const response = await axiosInstance({
      ...config,
      ...options,
    });

    const data = response.data?.data;
    apiLog.success(`${method} ${config.url}`, data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error?.message || error.message || '네트워크 요청에 실패했습니다';
      apiLog.error(`${method} ${config.url}`, { status: error.response?.status, message });
      throw new ApiError(error.response?.status, message);
    }
    throw new ApiError(undefined, '알 수 없는 오류가 발생했습니다');
  }
};
