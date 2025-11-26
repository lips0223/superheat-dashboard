import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API 响应统一格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 请求配置
const config: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.superheat.xyz',
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
};

// 创建 axios 实例
const axiosInstance: AxiosInstance = axios.create(config);

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    if (typeof window !== 'undefined') {
      const userStorage = localStorage.getItem('superheat-user-storage');
      if (userStorage) {
        try {
          const { state } = JSON.parse(userStorage);
          const token = state?.user?.token;
          
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Parse user storage error:', error);
        }
      }
    }

    // 打印请求日志（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url, config.data);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;

    // 打印响应日志（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('📥 Response:', response.config.url, data);
    }

    // 统一处理响应
    if (data.success || data.code === 200 || data.code === 0) {
      return response;
    }

    // 业务错误处理
    const errorMessage = data.message || 'Request failed';
    console.error('❌ Business Error:', errorMessage);
    
    return Promise.reject(new Error(errorMessage));
  },
  (error: AxiosError<ApiResponse>) => {
    // HTTP 错误处理
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 未授权，清除用户信息并跳转登录
          if (typeof window !== 'undefined') {
            localStorage.removeItem('superheat-user-storage');
            window.location.href = '/login';
          }
          console.error('❌ 401 Unauthorized');
          break;

        case 403:
          console.error('❌ 403 Forbidden');
          break;

        case 404:
          console.error('❌ 404 Not Found');
          break;

        case 500:
          console.error('❌ 500 Internal Server Error');
          break;

        default:
          console.error(`❌ HTTP Error ${status}:`, data?.message || error.message);
      }

      return Promise.reject(data || error);
    }

    // 网络错误
    if (error.request) {
      console.error('❌ Network Error:', error.message);
      return Promise.reject(new Error('Network error, please check your connection'));
    }

    // 其他错误
    console.error('❌ Error:', error.message);
    return Promise.reject(error);
  }
);

// 封装通用请求方法
class Request {
  /**
   * GET 请求
   */
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return axiosInstance.get(url, { params, ...config }).then((res) => res.data);
  }

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return axiosInstance.post(url, data, config).then((res) => res.data);
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return axiosInstance.put(url, data, config).then((res) => res.data);
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return axiosInstance.delete(url, { params, ...config }).then((res) => res.data);
  }

  /**
   * PATCH 请求
   */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return axiosInstance.patch(url, data, config).then((res) => res.data);
  }

  /**
   * 上传文件
   */
  upload<T = any>(url: string, file: File | FormData, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    return axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    }).then((res) => res.data);
  }
}

// 导出实例
export const request = new Request();

// 导出 axios 实例（用于特殊场景）
export { axiosInstance };

export default request;
