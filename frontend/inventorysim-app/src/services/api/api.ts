//Create axios instance
import axios, { AxiosError } from "axios";  

// Errors
export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "NOT_FOUND"
  | "SERVER_ERROR"
  | "UNKNOWN";


  export class ApiError extends Error {
  code: ApiErrorCode;
  status?: number;

  constructor(message: string, code: ApiErrorCode, status?: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}


// Base URL of your Spring Boot backend
const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor just normalizes errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = !error.response
      ? new ApiError("Cannot connect to backend, please try again later.", "NETWORK_ERROR")
      : error.response.status === 404
      ? new ApiError("Endpoint not found", "NOT_FOUND", error.response.status)
      : error.response.status >= 500
      ? new ApiError("Server error", "SERVER_ERROR", error.response.status)
      : new ApiError("Unexpected API error", "UNKNOWN", error.response.status);

    // No toast here, just throw normalized error
    return Promise.reject(apiError);
  }
);

export default api;