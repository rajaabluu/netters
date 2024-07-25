import axios from "axios";
import setupInterceptors from "./interceptor";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

setupInterceptors(api);

export default api;
