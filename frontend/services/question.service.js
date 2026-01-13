import { getAxios } from "@/plugins/axios";
import { Urls } from "@/const/url.const";
export async function getAllQuestions() {
  try {
    const $axios = getAxios();
    const response = await $axios.get(Urls.QUESTIONS_GET_ALL);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all questions:", error);
    throw error;
  }
}

export async function createQuestion(questionData) {
  try {
    const $axios = getAxios();
    const response = await $axios.post(Urls.ADMIN_QUESTIONS, questionData);
    return response.data;
  } catch (error) {
    console.error("Failed to create question:", error);
    throw error;
  }
}

export async function updateQuestion(questionId, questionData) {
  try {
    const $axios = getAxios();
    const response = await $axios.put(
      `${Urls.ADMIN_QUESTIONS}/${questionId}`,
      questionData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update question:", error);
    throw error;
  }
}

export async function deleteQuestion(questionId) {
  try {
    const $axios = getAxios();
    const response = await $axios.delete(
      `${Urls.ADMIN_QUESTIONS}/${questionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete question:", error);
    throw error;
  }
}
