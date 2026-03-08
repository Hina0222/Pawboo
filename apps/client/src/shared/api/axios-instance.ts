import axios, { AxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
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
      const errorMessage = error.message || '네트워크 요청에 실패했습니다';
      throw new Error(errorMessage);
    }
    throw new Error('알 수 없는 오류가 발생했습니다');
  }
};
