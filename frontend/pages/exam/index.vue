<script>
import { USER_ROLE, ADMIN_ROLE } from '~/const/role.const';
import { getExam } from '~/services/exam.service';

export default {
    name: "ExamPage",
    layout: 'user',
    middleware: 'auth',
    meta: {
        auth: true,
        roles: [USER_ROLE, ADMIN_ROLE]
    },
    data() {
        return {
            title: "Exams",
            exams: [],
            searchQuery: '',
            errorMessage: '',
            loading: false,
        };
    },
    methods: {
        fetchExams() {
            this.loading = true;
            this.errorMessage = '';
            getExam(this.searchQuery).then((res) => {
                this.exams = res;
                this.loading = false;
            }).catch((err) => {
                console.error("Error fetching exams:", err);
                this.errorMessage = "Failed to load exams.";
                this.loading = false;
            });
        },
        searchExams() {
            this.fetchExams();
        },
        resetFields() {
            this.searchQuery = '';
            this.fetchExams();
        },
        takeExam(examId) {
            this.$router.push(`/exam/take/${examId}`);
        }
    },
    mounted() {
        this.fetchExams();
    },
}
</script>
<template>
    <main class="py-4">
        <b-container>
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>{{ title }}</h2>
            </div>

            <!-- Search Bar -->
            <b-row class="mb-4">
                <b-col cols="12" md="10">
                    <b-form-input
                        v-model="searchQuery"
                        placeholder="Search exams by name..."
                        @keyup.enter="searchExams"
                    ></b-form-input>
                </b-col>
                <b-col cols="12" md="2" class="mt-2 mt-md-0">
                    <b-button variant="primary" @click="searchExams" class="mr-2">
                        <i class="fas fa-search mr-2"></i>Search
                    </b-button>
                    <b-button variant="secondary" @click="resetFields">
                        <i class="fas fa-redo mr-2"></i>Reset
                    </b-button>
                </b-col>
            </b-row>
            
            <!-- Error Alert -->
            <b-row v-if="errorMessage">
                <b-col cols="12">
                    <b-alert variant="danger" show @dismissed="errorMessage = ''">
                        {{ errorMessage }}
                    </b-alert>
                </b-col>
            </b-row>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <b-spinner ></b-spinner>
                <p class="mt-3">Loading exams...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="exams.length === 0" class="text-center py-5">
                <i class="fas fa-folder-open fa-4x text-muted mb-3"></i>
                <h4 class="text-muted">No exams found</h4>
                <p class="text-muted">Try adjusting your search or come back later.</p>
            </div>

            <!-- Exams Grid -->
            <b-row v-else>
                <b-col cols="12" sm="6" lg="4" class="mb-4" v-for="exam in exams" :key="exam.examId">
                    <b-card class="h-100 shadow-sm">
                        <b-card-title>{{ exam.name }}</b-card-title>
                        <b-card-text>
                            <div class="mb-2">
                                <i class="fas fa-question-circle mr-2 text-primary"></i>
                                <strong>Questions:</strong> {{ exam.totalQuestions }}
                            </div>
                            <div class="mb-2">
                                <i class="fas fa-clock mr-2 text-info"></i>
                                <strong>Duration:</strong> {{ exam.duration }} minutes
                            </div>
                        </b-card-text>
                        
                        <template #footer>
                            <b-button 
                                block
                                variant="success" 
                                size="sm" 
                                @click="takeExam(exam.examId)">
                                <i class="fas fa-play mr-2"></i>Take Exam
                            </b-button>
                        </template>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </main>
</template>