import axios, { AxiosRequestConfig } from 'axios';
import { getQueryClient } from '@/shared/api/get-query-client';
import { userQueryKeys } from '@/entities/user/model/user.query-key';

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
  const queryClient = getQueryClient();
  queryClient.removeQueries({ queryKey: userQueryKeys.me() });
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

    if (originalRequest.url?.includes('/auth/refresh')) {
      handleAuthFailure();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= axiosInstance
        .post('/auth/refresh')
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
  try {
    const response = await axiosInstance({
      ...config,
      ...options,
    });

    return response.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || '네트워크 요청에 실패했습니다';
      throw new Error(errorMessage);
    }
    throw new Error('알 수 없는 오류가 발생했습니다');
  }
};
