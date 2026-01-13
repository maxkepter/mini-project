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
