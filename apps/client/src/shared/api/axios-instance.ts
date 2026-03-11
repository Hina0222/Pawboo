import axios, { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/shared/store/auth-store';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes('/auth/refresh')) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= axiosInstance
        .post<{ accessToken: string }>('/auth/refresh')
        .then(({ data }) => {
          useAuthStore.getState().setAccessToken(data.accessToken);
          return data.accessToken;
        })
        .finally(() => {
          refreshPromise = null;
        });

      const accessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(originalRequest);
    } catch {
      useAuthStore.getState().clearAuth();
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

    return response.data as Data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || error.message || '네트워크 요청에 실패했습니다';
      throw new Error(errorMessage);
    }
    throw new Error('알 수 없는 오류가 발생했습니다');
  }
};
