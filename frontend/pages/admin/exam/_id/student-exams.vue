<script>
import { getStudentExamByExamId } from '~/services/student-exam.service';

export default {
    name: "StudentExamsPage",
    data() {
        return {
            title: "Student Exams",
            examId: this.$route.params.id,
            studentExams: [],
            loading: false,
            errorMessage: "",
        };
    },
    methods: {
        fetchStudentExams() {
            this.loading = true;
            this.errorMessage = "";
            getStudentExamByExamId(this.examId).then((response) => {
                console.log("Fetched student exams:", response);
                this.studentExams = response;
            }).catch((error) => {
                console.error("Error fetching student exams:", error);
                this.errorMessage = "Failed to load student exams.";
            }).finally(() => {
                this.loading = false;
            });
        },
        backToExamList() {
            this.$router.push('/admin/exam');
        }
    },
    mounted() {
        this.fetchStudentExams();
    }
}
</script>

<template>
    <main class="py-4">
        <b-container>
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>{{ title }}</h2>
                <p>View all student submissions for this exam.</p></div>
                <b-button variant="secondary" @click="backToExamList">
                    <i class="fas fa-arrow-left mr-2"></i>Back to Exams
                </b-button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <b-spinner ></b-spinner>
                <p class="mt-3">Loading student exams...</p>
            </div>

            <!-- Error Alert -->
            <b-alert v-if="errorMessage" variant="danger" show dismissible @dismissed="errorMessage = ''">
                {{ errorMessage }}
            </b-alert>

            <!-- Content -->
            <b-card class="shadow-sm">
                <b-card-text class="text-center text-muted py-5">
                    <i class="fas fa-clipboard-list fa-4x mb-3"></i>
                    <h4>Student Exams Page</h4>
                    <p>Exam ID: {{ examId }}</p>
                    <p>This page will display all student exam submissions for this exam.</p>
                </b-card-text>
            </b-card>
        </b-container>
    </main>
</template>
