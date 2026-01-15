<script>
import { USER_ROLE, ADMIN_ROLE, SUB_ADMIN_ROLE } from '~/const/role.const';
import { getStudentExamById } from '~/services/student-exam.service';
import { STATUS_ENUM } from '~/const/student-exam-status.enum';
import { STATUS_VARIANT } from '~/const/status-variant.const';
import { formatDate } from '~/utils/date-formatter';
import QuestionDetail from '~/components/QuestionDetail.vue';

export default {
    name: "ExamHistoryDetailPage",
    layout: 'user',
    middleware: 'auth',
    meta: {
        auth: true,
        roles: [USER_ROLE, ADMIN_ROLE,SUB_ADMIN_ROLE]
    },
    data() {
        return {
            title: "Exam Result Details",
            studentExamId: this.$route.params.id,
            studentExam: null,
            loading: false,
            errorMessage: "",
            STATUS_ENUM: STATUS_ENUM,
            STATUS_VARIANT
        };
    },
    methods: {
        fetchStudentExamDetail() {
            this.loading = true;
            this.errorMessage = "";
            getStudentExamById(this.studentExamId).then((response) => {
                console.log("Fetched exam result details:", response);
                this.studentExam = response;
            }).catch((error) => {
                console.error("Error fetching exam result details:", error);
                this.errorMessage = "Failed to load exam result details.";
            }).finally(() => {
                this.loading = false;
            });
        },
        backToHistory() {
            this.$router.push('/exam/history');
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
    components: {
        QuestionDetail
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
                    <p class="text-muted">Review your exam answers and scores.</p>
                </div>
                <b-button variant="secondary" @click="backToHistory">
                    <i class="fas fa-arrow-left mr-2"></i>Back to History
                </b-button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <b-spinner></b-spinner>
                <p class="mt-3">Loading exam result details...</p>
            </div>

            <!-- Error Alert -->
            <b-alert v-if="errorMessage" variant="danger" show dismissible @dismissed="errorMessage = ''">
                {{ errorMessage }}
            </b-alert>

            <!-- Exam Result Details -->
            <div v-if="!loading && studentExam">
                <!-- Summary Card -->
                <b-card class="shadow-sm mb-4">
                    <div class="row">
                        <div class="col-md-3">
                            <div>
                                <strong class="text-muted">
                                    <i class="fas fa-book mr-2"></i>Exam Name
                                </strong>
                                <h5 class="mt-2">{{ studentExam.examName }}</h5>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <strong class="text-muted">
                                    <i class="fas fa-percent mr-2"></i>Score
                                </strong>
                                <h5 class="mt-2">
                                    <span :style="{ color: studentExam.score < 40 ? '#dc3545' : '#28a745', fontWeight: 'bold' }">
                                        {{ studentExam.score }}
                                    </span>
                                </h5>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <strong class="text-muted">
                                    <i class="fas fa-flag mr-2"></i>Status
                                </strong>
                                <div class="mt-2">
                                    <span :style="{ color: getStatusVariant(studentExam.status) === 'warning' ? '#ffc107' : getStatusVariant(studentExam.status) === 'info' ? '#17a2b8' : getStatusVariant(studentExam.status) === 'primary' ? '#007bff' : '#28a745', fontWeight: 'bold' }">
                                        {{ getStatusLabel(studentExam.status) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <strong class="text-muted">
                                    <i class="fas fa-calendar mr-2"></i>Submitted
                                </strong>
                                <p class="mt-2 mb-0">
                                    <small>{{ formatDate(studentExam.submitTime) }}</small>
                                </p>
                            </div>
                        </div>
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

<style scoped>
.card {
    border: none;
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.badge {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 600;
}

.badge-primary {
    background-color: #007bff;
    color: white;
}

.badge-success {
    background-color: #28a745;
    color: white;
}
</style>
