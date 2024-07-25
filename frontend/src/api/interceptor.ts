import { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const setupInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      let access_token = localStorage.getItem("token");
      if (!!access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }

      return config;
    },
    (err) => Promise.reject(err)
  );
};

export default setupInterceptors;
