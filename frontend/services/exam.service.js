import { getAxios } from "~/plugins/axios";
import { Urls } from "~/const/url.const";
async function getExamById(examId) {
  try {
    const $axios = getAxios();
    const response = await $axios.get(`${Urls.EXAMS}/${examId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch exam by ID:", error);
    throw error;
  }
}
async function createExam(exam) {
  try {
    const $axios = getAxios();
    const response = await $axios.post(Urls.EXAMS, exam);
    return response.data;
  } catch (error) {
    console.error("Failed to create exam:", error);
    throw error;
  }
}
