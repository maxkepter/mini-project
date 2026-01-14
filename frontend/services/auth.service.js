import { Urls } from "../const/url.const";
import { LocalStorageKeys } from "../const/local-storage.const";
import { getAxios } from "../plugins/axios";

export async function refreshToken() {
  try {
    const $axios = getAxios();
    if (!$axios) {
      throw new Error("Axios instance not initialized");
    }
    const refreshToken = localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN);
    const response = await $axios.post(Urls.REFRESH_TOKEN, {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function logoutUser() {
  localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN);
  localStorage.removeItem(LocalStorageKeys.REFRESH_TOKEN);
  localStorage.removeItem(LocalStorageKeys.USER_INFO);

  // Redirect to login if in browser
  if (process.browser) {
    window.location.href = "/auth/login";
  }
}

export async function loginUser(credentials) {
  try {
    const $axios = getAxios();
    if (!$axios) {
      throw new Error("Axios instance not initialized");
    }
    console.log(
      "Auth Service - loginUser called with credentials:",
      credentials
    );
    const response = await $axios.post(Urls.LOGIN, credentials);
    const { userId, username, role, accessToken, refreshToken } = response.data;

    localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, accessToken);
    localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(
      LocalStorageKeys.USER_INFO,
      JSON.stringify({ userId, username, role })
    );

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function registerUser(credentials) {
  try {
    const $axios = getAxios();
    if (!$axios) {
      throw new Error("Axios instance not initialized");
    }
    console.log(
      "Auth Service - registerUser called with credentials:",
      credentials
    );
    const response = await $axios.post(Urls.REGISTER, credentials);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

export function changePassword(payload) {
  try {
    const $axios = getAxios();
    return $axios.post(Urls.UPDATE_PASSWORD, payload);
  } catch (error) {
    console.error("Change password failed:", error);
    throw error;
  }
}

export function getUserInfo() {
  const userInfo = localStorage.getItem(LocalStorageKeys.USER_INFO);
  if (userInfo) {
    return JSON.parse(userInfo);
  }
  return null;
}
