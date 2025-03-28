import axios from "axios";
import store from "../app/store";
import { showLoader,hideLoader } from "../app/loaderSlice";// Base URL for all API calls
const BASE_URL = "https://dailysalesapi.skylynxclass.in/api/";
//const BASE_URL = "https://localhost:44396/api/";
// Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

// Add JWT Token Authorization Interceptor
// Request Interceptor
apiClient.interceptors.request.use((config) => {
  store.dispatch(showLoader()); // Show Loader before each API request
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    store.dispatch(hideLoader()); // Hide Loader after successful API response
    return response;
  },
  (error) => {
    store.dispatch(hideLoader()); // Hide Loader if an error occurs
    return Promise.reject(error);
  }
);

// Common API Methods
const apiService = {
  get: (url, params = {}, authRequired = true) =>
    apiClient.get(url, {
      params,
      headers: authRequired
        ? { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
        : {},
    }),

  post: (url, data = {}, authRequired = true) =>
    apiClient.post(url, data, {
      headers: authRequired
        ? { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
        : {},
    }),

  put: (url, data = {}, authRequired = true) =>
    apiClient.put(url, data, {
      headers: authRequired
        ? { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
        : {},
    }),

  delete: (url, authRequired = true) =>
    apiClient.delete(url, {
      headers: authRequired
        ? { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
        : {},
    }),

  postFormData: (url, formData, authRequired = true) =>
    apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(authRequired
          ? { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
          : {}),
      },
    }),
};

export default apiService;
