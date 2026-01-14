import { LocalStorageKeys } from "../const/local-storage.const";
import { Urls } from "../const/url.const";
import { logoutUser } from "../services/auth.service";

let isRefreshing = false;
let failedQueue = [];
let $axios = null;

// Export function to set axios instance for services
export function setAxios(axios) {
  $axios = axios;
}

// Export function to get axios instance for services
export function getAxios() {
  if (!$axios) {
    throw new Error("Axios instance not initialized");
  }
  return $axios;
}

function processQueue(error, token = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
}

function handleLogout() {
  logoutUser();
}

export default function ({ $axios: axiosInstance, redirect }) {
  // Set axios instance for services
  setAxios(axiosInstance);

  // Request interceptor to add auth token
  axiosInstance.onRequest((config) => {
    const accessToken = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN);
    if (accessToken) {
      config.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Response interceptor to handle 401 and refresh token
  axiosInstance.onError(async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      // Return if the request has already been retried
      if (originalRequest._retry) {
        handleLogout();
        return Promise.reject(error);
      }

      // Logout if the request was to refresh the token endpoint
      if (originalRequest.url?.includes(Urls.REFRESH_TOKEN)) {
        handleLogout();
        return Promise.reject(error);
      }

      // Queue requests while refreshing token
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.common["Authorization"] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const storedRefreshToken = localStorage.getItem(
        LocalStorageKeys.REFRESH_TOKEN
      );

      if (!storedRefreshToken) {
        handleLogout();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await axiosInstance.post(Urls.REFRESH_TOKEN, {
          refreshToken: storedRefreshToken,
        });
        const data = response.data;
        const { accessToken, refreshToken: newRefreshToken } = data;

        localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, accessToken);
        localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, newRefreshToken);

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  });
}
