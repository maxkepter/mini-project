import { getAxios } from "@/plugins/axios";
import { Urls } from "@/const/url.const.js";
export async function takeExam(payload) {
  try {
    const $axios = getAxios();
    const response = await $axios.post(Urls.STUDENT_EXAM_TAKE_EXAM, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to take exam:", error);
    throw error;
  }
}
export async function getStudentExamById(studentExamId) {
  try {
    const $axios = getAxios();
    const response = await $axios.get(`${Urls.STUDENT_EXAMS}/${studentExamId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get student exam by ID:", error);
    throw error;
  }
}
export async function getStudentExamByExamId(examId) {
  try {
    const $axios = getAxios();
    const response = await $axios.get(`${Urls.ADMIN_STUDENT_EXAMS}/${examId}`);
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to get student exam by exam ID:", error);
    throw error;
  }
}

export async function getExamHistory() {
  try {
    const $axios = getAxios();
    const response = await $axios.get(Urls.STUDENT_EXAMS_HISTORY);
    return response.data;
  } catch (error) {
    console.error("Failed to get exam history:", error);
    throw error;
  }
}

export async function saveOption(payload) {
  try {
    const $axios = getAxios();
    const response = await $axios.post(Urls.STUDENT_EXAMS_SELECT, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to save selected option:", error);
    throw error;
  }
}

export async function submitExam(studentExamId) {
  try {
    const $axios = getAxios();
    const response = await $axios.put(
      `${Urls.STUDENT_EXAMS}/${studentExamId}/submit`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to submit exam:", error);
    throw error;
  }
}
