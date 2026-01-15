<script>
import { USER_ROLE, ADMIN_ROLE, SUB_ADMIN_ROLE } from '~/const/role.const';
import { STATUS_ENUM } from '~/const/student-exam-status.enum';
import { STATUS_VARIANT, STATUS_COLOR_MAP, SCORE_PASS_THRESHOLD } from '~/const/status-variant.const';
import { getExamHistory } from '~/services/student-exam.service';
import { formatDate } from '~/utils/date-formatter';

export default {
    name: "ExamHistoryPage",
    layout: 'user',
    middleware: 'auth',
    meta: {
        auth: true,
        roles: [USER_ROLE, ADMIN_ROLE,SUB_ADMIN_ROLE]
    },
    data() {
        return {
            title: "Exam History",
            studentExams: [],
            loading: false,
            errorMessage: "",
            STATUS_ENUM: STATUS_ENUM,
            STATUS_VARIANT
        };
    },
    methods: {
        fetchExamHistory() {
            this.loading = true;
            this.errorMessage = "";
            getExamHistory().then((response) => {
                console.log("Fetched exam history:", response);
                this.studentExams = Array.isArray(response) ? response : [];
            }).catch((error) => {
                console.error("Error fetching exam history:", error);
                this.errorMessage = "Failed to load exam history.";
                this.studentExams = [];
            }).finally(() => {
                this.loading = false;
            });
        },
        goToViewDetails(studentExamId) {
            this.$router.push(`/exam/history/${studentExamId}`);
        },
        getStatusLabel(statusCode) {
            return this.STATUS_ENUM[statusCode] || 'UNKNOWN';
        },
        getStatusVariant(statusCode) {
            return this.STATUS_VARIANT[statusCode] || 'secondary';
        },
        getStatusStyle(statusCode) {
            const variant = this.getStatusVariant(statusCode);
            return {
                color: STATUS_COLOR_MAP[variant] || '#6c757d'
            };
        },
        getScoreColor(score) {
            return score < SCORE_PASS_THRESHOLD ? '#dc3545' : '#28a745';
        }
        ,
        formatDate(dateString) {
            return formatDate(dateString);
        }
    },
    mounted() {
        this.fetchExamHistory();
    }
}
</script>

<template>
    <main class="py-4">
        <b-container>
            <!-- Header -->
            <div class="mb-4">
                <h2 class="font-weight-bold text-dark">{{ title }}</h2>
                <p class="text-muted">View your past exam submissions and results.</p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <b-spinner></b-spinner>
                <p class="mt-3">Loading exam history...</p>
            </div>

            <!-- Error Alert -->
            <b-alert v-if="errorMessage" variant="danger" show dismissible @dismissed="errorMessage = ''">
                {{ errorMessage }}
            </b-alert>

            <!-- Debug Info -->
            <div v-if="!loading && studentExams && studentExams.length > 0" class="mb-3">
                <small class="text-muted">Total submissions: {{ studentExams.length }}</small>
            </div>

            <!-- No Data State -->
            <b-alert v-if="!loading && studentExams.length === 0 && !errorMessage" variant="info" show>
                <i class="fas fa-info-circle mr-2"></i>
                No exam history yet. Complete an exam to see it here.
            </b-alert>

            <!-- Content - Card View -->
            <div v-if="!loading && studentExams.length > 0" class="row">
                <div v-for="exam in studentExams" :key="exam.studentExamId" class="col-12 mb-4">
                    <b-card class="shadow-sm">
                        <div class="row">
                            <div class="col-md-4">
                                <b-card-title>
                                    <h5 class="mb-0">
                                        <i class="fas fa-book mr-2 text-primary"></i>
                                        <strong>{{ exam.examName }}</strong>
                                    </h5>
                                </b-card-title>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-md-2">
                                <div class="mb-2">
                                    <strong>Score:</strong>
                                    <span class="ml-2" :style="{ color: getScoreColor(exam.score), fontSize: '14px', fontWeight: 'bold' }">
                                        {{ exam.score }}
                                    </span>
                                </div>
                            </div>

                            <div class="col-md-2">
                                <div class="mb-2">
                                    <strong>Status:</strong>
                                    <span class="ml-2" :style="getStatusStyle(exam.status)" style="font-size: 14px; font-weight: bold;">
                                        {{ getStatusLabel(exam.status) }}
                                    </span>
                                </div>
                            </div>

                            <div class="col-md-3">
                                <div class="mb-2">
                                    <strong>Start Date:</strong>
                                    <small class="text-muted d-block">{{ formatDate(exam.startTime) }}</small>
                                </div>
                            </div>

                            <div class="col-md-3">
                                <div class="mb-2">
                                    <strong>Submit Date:</strong>
                                    <small class="text-muted d-block">{{ formatDate(exam.submitTime) }}</small>
                                </div>
                            </div>

                            <div class="col-md-2 text-right">
                                <b-button variant="primary" size="md" @click="goToViewDetails(exam.studentExamId)">
                                    <i class="fas fa-eye mr-2"></i> View
                                </b-button>
                            </div>
                        </div>
                    </b-card>
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
</style>
