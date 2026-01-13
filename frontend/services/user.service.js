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
    const response = await $axios.get(Urls.ADMIN_USERS);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all users:", error);
    throw error;
  }
}

export async function getUserProfileById(userId) {
  try {
    const $axios = getAxios();
    const response = await $axios.get(
      `${Urls.ADMIN_GET_PROFILE_BY_ID}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile by ID:", error);
    throw error;
  }
}

export async function updateUserRole(userId, newRole) {
  try {
    const $axios = getAxios();
    const response = await $axios.patch(`${Urls.ADMIN_USERS}/${userId}/role`, {
      role: newRole,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update user role"
    );
  }
}

export async function deactivateUser(userId) {
  try {
    const $axios = getAxios();
    const response = await $axios.delete(`${Urls.ADMIN_USERS}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to deactivate user:", error);
    throw error;
  }
}

export async function activeUser(userId) {
  try {
    const $axios = getAxios();
    const response = await $axios.patch(
      `${Urls.ADMIN_USERS}/${userId}/activate`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to activate user:", error);
    throw error;
  }
}
