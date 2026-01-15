<script>
import { ADMIN_ROLE, SUB_ADMIN_ROLE } from '~/const/role.const';
import BaseModal from '~/components/BaseModal.vue';
import { getExamById, updateExam } from '~/services/exam.service';
import { getAllQuestions } from '~/services/question.service';

export default {
    name: "ExamDetailPage",
    layout: 'admin',
    middleware: 'auth',
    meta: {
        auth: true,
        roles: [ADMIN_ROLE, SUB_ADMIN_ROLE]
    },
    components: {
        BaseModal
    },
    data() {
        return {
            title: "Exam Details",
            examId: this.$route.params.id,
            examDetails: null,
            questions: [],
            selectedQuestionIds: [],
            examName: "",
            duration: 0,
            errorMessage: "",
            successMessage: "",
            loading: false,
            isShowQuestionModal: false,
        };
    },
    computed: {
        selectedQuestion() {
            const temp = this.questions;
            return temp.filter(q => this.selectedQuestionIds.includes(q.questionId));
        },
        isFormValid() {
            return !!(this.examName && this.examName.trim()) &&
                this.duration > 0 &&
                this.selectedQuestionIds.length > 0;
        }
    },
    methods: {
        fetchExamDetails() {
            this.loading = true;
            this.errorMessage = "";
            getExamById(this.examId)
                .then((res) => {
                    console.log("Fetched exam details:", res);
                    this.examDetails = res;
                    this.selectedQuestionIds = res.questions.map(q => q.questionId);
                    this.examName = res.name;
                    this.duration = res.duration;
                    this.loading = false;
                })
                .catch((err) => {
                    console.error("Error fetching exam details:", err);
                    this.errorMessage = "Failed to load exam details.";
                    this.loading = false;
                });
        },
        fetchQuestions() {
            getAllQuestions()
                .then((response) => {
                    console.log("Fetched questions:", response);
                    this.questions = response;
                })
                .catch((error) => {
                    console.error("Error fetching questions:", error);
                    this.errorMessage = "Failed to load questions.";
                });
        },
        handleUpdateExam() {
            if (!this.isFormValid) {
                this.errorMessage = "Please fill all fields and select at least one question.";
                return;
            }
            
            this.errorMessage = "";
            this.successMessage = "";
            
            const newExamData = {
                name: this.examName,
                duration: this.duration,
                questionIds: this.selectedQuestionIds,
            };
            
            updateExam(this.examId, newExamData).then((res) => {
                console.log("Exam updated successfully:", res);
                this.successMessage = "Exam updated successfully!";
                this.fetchExamDetails();
                setTimeout(() => {
                    this.successMessage = "";
                }, 3000);
            }).catch((err) => {
                console.error("Error updating exam:", err);
                this.errorMessage = "Failed to update exam.";
            });
        },
        hideQuestionModal() {
            this.isShowQuestionModal = false;
        },
        showQuestionModal() {
            this.isShowQuestionModal = true;
        },
        backToExamList() {
            this.$router.push('/admin/exam');
        }
    },
    mounted() {
        this.fetchExamDetails();
        this.fetchQuestions();
    }
}
</script>
<template>
    <main class="py-4">
        <b-container>
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>{{ title }}</h2>
                <b-button variant="secondary" @click="backToExamList">
                    <i class="fas fa-arrow-left mr-2"></i>Back to List
                </b-button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <b-spinner ></b-spinner>
                <p class="mt-3">Loading exam details...</p>
            </div>

            <!-- Error Alert -->
            <b-alert v-if="errorMessage" variant="danger" show @dismissed="errorMessage = ''" class="mb-3">
                {{ errorMessage }}
            </b-alert>

            <!-- Success Alert -->
            <b-alert v-if="successMessage" variant="success" show @dismissed="successMessage = ''" class="mb-3">
                {{ successMessage }}
            </b-alert>

            <!-- Main Content -->
            <b-row v-if="!loading && examDetails">
                <!-- Left Column - Form -->
                <b-col cols="12" md="4" class="mb-4">
                    <b-card class="shadow-sm">
                        <b-card-title>Exam Information</b-card-title>
                        <b-form @submit.prevent="handleUpdateExam">
                            <b-form-group label="Exam Name" label-for="exam-name" class="mb-3">
                                <b-form-input 
                                    id="exam-name"
                                    v-model="examName"
                                    placeholder="Enter exam name"
                                    required>
                                </b-form-input>
                            </b-form-group>
                            
                            <b-form-group label="Duration (minutes)" label-for="duration" class="mb-3">
                                <b-form-input 
                                    id="duration"
                                    v-model.number="duration"
                                    type="number"
                                    min="1"
                                    placeholder="Enter duration"
                                    required>
                                </b-form-input>
                            </b-form-group>

                            <b-form-group label="Selected Questions" class="mb-3">
                                <div class="d-flex align-items-center justify-content-between p-2 bg-light rounded">
                                    <span><strong>{{ selectedQuestionIds.length }}</strong> questions selected</span>
                                    <b-button variant="primary" size="sm" @click="showQuestionModal">
                                        <i class="fas fa-edit mr-1"></i>Select
                                    </b-button>
                                </div>
                            </b-form-group>

                            <div class="d-flex flex-column gap-2">
                                <b-button 
                                    variant="success" 
                                    type="submit"
                                    :disabled="!isFormValid"
                                    class="mb-2">
                                    <i class="fas fa-save mr-2"></i>Save Changes
                                </b-button>
                                <b-button variant="secondary" @click="backToExamList">
                                    <i class="fas fa-times mr-2"></i>Cancel
                                </b-button>
                            </div>
                        </b-form>
                    </b-card>
                </b-col>

                <!-- Right Column - Selected Questions -->
                <b-col cols="12" md="8">
                    <b-card class="shadow-sm">
                        <b-card-title>
                            Selected Questions ({{ selectedQuestion.length }})
                        </b-card-title>
                        
                        <div v-if="selectedQuestion.length === 0" class="text-center text-muted py-4">
                            <i class="fas fa-clipboard-list fa-3x mb-3"></i>
                            <p>No questions selected yet</p>
                            <b-button variant="primary" @click="showQuestionModal">
                                <i class="fas fa-plus mr-2"></i>Add Questions
                            </b-button>
                        </div>

                        <b-list-group v-else flush>
                            <b-list-group-item v-for="(question, index) in selectedQuestion" :key="question.questionId" class="border-bottom">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <div class="flex-grow-1">
                                        <span class="badge badge-secondary mr-2">{{ index + 1 }}</span>
                                        <strong>{{ question.content }}</strong>
                                    </div>
                                    <b-button 
                                        size="sm" 
                                        variant="outline-danger" 
                                        @click="selectedQuestionIds = selectedQuestionIds.filter(id => id !== question.questionId)">
                                        <i class="fas fa-times"></i>
                                    </b-button>
                                </div>
                                <div>
                                    <ul class="ml-4 mb-0">
                                        <li v-for="option in question.options" :key="option.id">
                                            {{ option.content }} 
                                            <span v-if="option.isCorrect" class="text-success font-weight-bold">
                                                <i class="fas fa-check-circle"></i> (Correct)
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </b-list-group-item>
                        </b-list-group>
                    </b-card>
                </b-col>
            </b-row>

            <!-- Question Selection Modal -->
            <BaseModal :show="isShowQuestionModal" @update:show="isShowQuestionModal = $event" size="xl" centered>
                <template #header>
                    <div class="modal-header">
                        <h5 class="modal-title">Select Questions</h5>
                        <button type="button" class="btn-close" @click="hideQuestionModal"></button>
                    </div>
                </template>

                <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
                    <div v-if="questions.length === 0" class="text-center text-muted py-4">
                        <p>No questions available</p>
                    </div>
                    
                    <b-list-group v-else>
                        <b-list-group-item v-for="question in questions" :key="question.questionId" class="mb-2">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div class="flex-grow-1">
                                    <strong>{{ question.content }}</strong>
                                </div>
                                <b-form-checkbox 
                                    :value="question.questionId" 
                                    v-model="selectedQuestionIds"
                                    class="ml-3">
                                </b-form-checkbox>
                            </div>
                            <div>
                                <ul class="ml-4 mb-0">
                                    <li v-for="option in question.options" :key="option.id">
                                        {{ option.content }} 
                                        <span v-if="option.isCorrect" class="text-success font-weight-bold">
                                            <i class="fas fa-check-circle"></i> (Correct)
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </b-list-group-item>
                    </b-list-group>
                </div>

                <template #footer>
                    <div class="modal-footer">
                        <span class="mr-auto text-muted">
                            <strong>{{ selectedQuestionIds.length }}</strong> questions selected
                        </span>
                        <b-button variant="primary" @click="hideQuestionModal">
                            <i class="fas fa-check mr-2"></i>Done
                        </b-button>
                    </div>
                </template>
            </BaseModal>
            <!-- Success -->
        </b-container>
    </main>
</template>