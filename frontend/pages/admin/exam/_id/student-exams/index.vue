<script>
import { ADMIN_ROLE, SUB_ADMIN_ROLE } from '~/const/role.const';
import { STATUS_ENUM } from '~/const/student-exam-status.enum';
import { STATUS_VARIANT, STATUS_COLOR_MAP, SCORE_PASS_THRESHOLD } from '~/const/status-variant.const';
import { getStudentExamByExamId } from '~/services/student-exam.service';
import { formatDate } from '~/utils/date-formatter';

export default {
    name: "AdminStudentExamsPage",
    layout: 'admin',
    middleware: 'auth',
    meta: {
        auth: true,
        roles: [ADMIN_ROLE, SUB_ADMIN_ROLE]
    },
    data() {
        return {
            title: "Student Exams",
            examId: this.$route.params.id,
            studentExams: [],
            loading: false,
            errorMessage: "",
            STATUS_ENUM: STATUS_ENUM,
            STATUS_VARIANT,
            STATUS_COLOR_MAP,
            SCORE_PASS_THRESHOLD
        };
    },
    methods: {
        fetchStudentExams() {
            this.loading = true;
            this.errorMessage = "";
            getStudentExamByExamId(this.examId).then((response) => {
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
        },
        goToViewDetails(studentExamId) {
            this.$router.push(`/admin/exam/${this.examId}/student-exams/${studentExamId}`);
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
                    <h2 class="font-weight-bold text-dark">{{ title }}</h2>
                    <p class="text-muted">View all student submissions for this exam.</p>
                </div>
                <b-button variant="secondary" @click="backToExamList">
                    <i class="fas fa-arrow-left mr-2"></i>Back to Exams
                </b-button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <b-spinner></b-spinner>
                <p class="mt-3">Loading student exams...</p>
            </div>

            <!-- Error Alert -->
            <b-alert v-if="errorMessage" variant="danger" show dismissible @dismissed="errorMessage = ''">
                {{ errorMessage }}
            </b-alert>

            <!-- Debug Info -->
            <div v-if="!loading" class="mb-3">
                <small class="text-muted">Total exams: {{ studentExams.length }}</small>
            </div>

            <!-- No Data State -->
            <b-alert v-if="!loading && studentExams.length === 0 && !errorMessage" variant="info" show>
                No student exams found for this exam.
            </b-alert>

            <!-- Content - Card View -->
            <div v-if="!loading && studentExams.length > 0" class="row">
                <div v-for="exam in studentExams" :key="exam.id" class="col-12 mb-4">
                    <b-card class="shadow-sm">
                        <div class="row">
                            <div class="col-md-3">
                                <b-card-title>
                                    <h5 class="mb-0">
                                        <strong>{{ exam.username }}</strong>
                                    </h5>
                                </b-card-title>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                      
                                <div class="mb-2">
                                    <strong>Score:</strong>
                                    <span class="ml-2" :style="{ color: getScoreColor(exam.score), fontSize: '14px', fontWeight: 'bold' }">{{ exam.score }}</span>
                                </div>
                  
                      
                                <div class="mb-2">
                                    <strong>Status:</strong>
                                    <span class="ml-2" :style="getStatusStyle(exam.status)" style="font-size: 14px; font-weight: bold;">
                                        {{ getStatusLabel(exam.status) }}
                                    </span>
                                </div>
                       
                                <div class="mb-2">
                                    <strong>Start Date:</strong>
                                    <small class="text-muted ">{{ formatDate(exam.startTime) }}</small>
                                </div>


                                <div class="mb-2">
                                    <strong>Submit Date:</strong>
                                    <small class="text-muted ">{{ formatDate(exam.submitTime) }}</small>
                                </div>
                                <div class="col-md-3 text-right">
                                <b-button variant="primary" size="md" @click="goToViewDetails(exam.studentExamId)">
                                    <i class="fas fa-eye mr-2"></i> View Details
                                </b-button>
                            </div>

                        </div>
                    </b-card>
                </div>
            </div>
        </b-container>
    </main>
</template>
