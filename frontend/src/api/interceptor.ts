import { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const setupInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      config.withCredentials = true;
      return config;
    },
    (err) => Promise.reject(err)
  );
};

export default setupInterceptors;
