import { getAxios } from "@/plugins/axios";
import { Urls } from "@/const/url.const.js";
export async function takeExam(payload) {
  try {
    const $axios = getAxios();
    const response = await $axios.post(Urls.STUDENT_TAKE_EXAM, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to take exam:", error);
    throw error;
  }
}
export async function getStudentExams() {}
export async function getStudentExamByExamId(examId) {
  try {
    const $axios = getAxios();
    const response = await $axios.get(`${Urls.STUDENT_EXAMS}/${examId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get student exam by exam ID:", error);
    throw error;
  }
}

export async function getExamHistory() {}
