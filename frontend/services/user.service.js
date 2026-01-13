import { Urls } from "~/const/url.const";
import { getAxios } from "~/plugins/axios";
export async function getUserProfile() {
  const $axios = getAxios();
  try {
    const response = await $axios.get(Urls.USER_GET_PROFILE);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
}

export async function getAllUser() {
  try {
    const $axios = getAxios();
    const response = await $axios.get(Urls.ADMIN_GET_ALL_USERS);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all users:", error);
    throw error;
  }
}

export async function getUserProfileById(userId) {
  try {
    const $axios = getAxios();
    const response = await $axios.get(`${Urls.ADMIN_GET_PROFILE_BY_ID}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile by ID:", error);
    throw error;
  }
}
