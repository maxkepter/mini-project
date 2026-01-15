<script>
import { ADMIN_ROLE, SUB_ADMIN_ROLE } from '~/const/role.const';
import { getStudentExamById } from '~/services/student-exam.service';
import { STATUS_ENUM } from '~/const/student-exam-status.enum';
import { STATUS_VARIANT, STATUS_COLOR_MAP, SCORE_PASS_THRESHOLD } from '~/const/status-variant.const';
import { formatDate } from '~/utils/date-formatter';
import ExamSummaryItem from '~/components/ExamSummaryItem.vue';
import QuestionDetail from '~/components/QuestionDetail.vue';

export default {
    name: "AdminStudentExamDetailPage",
    layout: 'admin',
    middleware: 'auth',
    meta: {
        auth: true,
        roles: [ADMIN_ROLE, SUB_ADMIN_ROLE]
    },
    components: {
        ExamSummaryItem,
        QuestionDetail
    },
    data() {
        return {
            title: "Student Exam Detail",
            examId: '',
            studentExamId: this.$route.params.studentExamId,
            studentExam: null,
            loading: false,
            errorMessage: "",
            STATUS_ENUM: STATUS_ENUM,
            STATUS_VARIANT,
            STATUS_COLOR_MAP,
            SCORE_PASS_THRESHOLD
        };
    },
    methods: {
        fetchStudentExamDetail() {
            this.loading = true;
            this.errorMessage = "";
            getStudentExamById(this.studentExamId).then((response) => {
                console.log("Fetched student exam detail:", response);
                this.studentExam = response;
                this.examId = response.examId;
            }).catch((error) => {
                console.error("Error fetching student exam detail:", error);
                this.errorMessage = "Failed to load student exam detail.";
            }).finally(() => {
                this.loading = false;
            });
        },
        backToStudentExams() {
            this.$router.push(`/admin/exam/${this.examId}/student-exams`);
        },
        getStatusLabel(statusCode) {
            return this.STATUS_ENUM[statusCode] || 'UNKNOWN';
        },
        getStatusVariant(statusCode) {
            return this.STATUS_VARIANT[statusCode] || 'secondary';
        }
        ,
        formatDate(dateString) {
            return formatDate(dateString);
        }
    },
    mounted() {
        this.fetchStudentExamDetail();
    }
}
</script>
<template>
    <main class="py-4">
        <b-container>
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="font-weight-bold text-dark">{{ title }}</h2>
                    <p class="text-muted">Review student exam answers and scores.</p>
                </div>
                <b-button variant="secondary" @click="backToStudentExams">
                    <i class="fas fa-arrow-left mr-2"></i>Back to Student Exams
                </b-button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <b-spinner></b-spinner>
                <p class="mt-3">Loading student exam details...</p>
            </div>

            <!-- Error Alert -->
            <b-alert v-if="errorMessage" variant="danger" show dismissible @dismissed="errorMessage = ''">
                {{ errorMessage }}
            </b-alert>

            <!-- Student Exam Details -->
            <div v-if="!loading && studentExam">
                <!-- Summary Card -->
                <b-card class="shadow-sm mb-4">
                    <div class="row">
                        <exam-summary-item label="Student Name" :value="studentExam.username" />
                        <exam-summary-item
                            label="Score"
                            :value="studentExam.score"
                            :valueColor="studentExam.score < SCORE_PASS_THRESHOLD ? '#dc3545' : '#28a745'"
                        />
                        <exam-summary-item label="Status">
                            <span :style="{ color: STATUS_COLOR_MAP[getStatusVariant(studentExam.status)] || '#6c757d', fontWeight: 'bold' }">
                                {{ getStatusLabel(studentExam.status) }}
                            </span>
                        </exam-summary-item>
                        <exam-summary-item label="Submit Date" :value="formatDate(studentExam.submitTime)" />
                    </div>
                </b-card>

                <!-- Questions and Answers -->
                <div class="row">
                    <question-detail
                        v-for="(question, index) in studentExam.studentExamQuestions"
                        :key="question.studentExamQuestionId"
                        :question="question"
                        :index="index"
                    />
                </div>
            </div>
        </b-container>
    </main>
</template>