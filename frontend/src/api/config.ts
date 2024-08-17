import axios from "axios";
import setupInterceptors from "./interceptor";
import { APIBASEURL } from "../constant/constant";

const api = axios.create({
  baseURL: APIBASEURL,
});

setupInterceptors(api);

export default api;
