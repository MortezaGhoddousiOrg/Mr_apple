import axios from "axios";

// export const publicApi = axios.create({
//   baseURL: "http://localhost:4000",
//   withCredentials: false,
//   timeout: 10000,
// });

export const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_access_token="))
      ?.split("=")[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;