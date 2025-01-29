import axios from "axios";
import { getAuthToken } from "../services/authService";
import { QueryClient } from "@tanstack/react-query";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 1000,
  headers: {
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

axiosInstance.interceptors.request.use((value) => {
  if (getAuthToken()) {
    value.headers.Authorization = `Bearer ${getAuthToken()}`;
  }
  return value;
});

const queryClient = new QueryClient();

export { axiosInstance, queryClient };
