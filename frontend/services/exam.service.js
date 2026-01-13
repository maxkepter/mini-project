import { getAxios } from "~/plugins/axios";
import { Urls } from "~/const/url.const";
export async function getExamById(examId) {
  try {
    const $axios = getAxios();
    const response = await $axios.get(`${Urls.USER_EXAMS}/${examId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch exam by ID:", error);
    throw error;
  }
}
export async function createExam(exam) {
  try {
    const $axios = getAxios();
    const response = await $axios.post(Urls.ADMIN_EXAMS, exam);
    return response.data;
  } catch (error) {
    console.error("Failed to create exam:", error);
    throw error;
  }
}

export async function getExam(searchQuery) {
  try {
    const $axios = getAxios();
    const response = await $axios.get(Urls.USER_EXAMS, {
      params: { name: searchQuery },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch exams:", error);
    throw error;
  }
}

export async function deleteExam(examId) {
  try {
    const $axios = getAxios();
    await $axios.delete(`${Urls.ADMIN_EXAMS}/${examId}`);
  } catch (error) {
    console.error("Failed to delete exam:", error);
    throw error;
  }
}

export async function updateExam(examId, exam) {
  try {
    const $axios = getAxios();
    const response = await $axios.put(`${Urls.ADMIN_EXAMS}/${examId}`, exam);
    return response.data;
  } catch (error) {
    console.error("Failed to update exam:", error);
    throw error;
  }
}
