<script>
import { USER_ROLE, ADMIN_ROLE } from '~/const/role.const';
import { getUserInfo } from '~/services/auth.service';
import { saveOption, submitExam, takeExam } from '~/services/student-exam.service';

export default {
    name: "TakeExamPage",
    layout: 'clean',
    middleware: 'auth',
    meta: {
        auth: true,
        roles: [USER_ROLE, ADMIN_ROLE]
    },
    data() {
        return {
            title: "Take Exam",
            examId: this.$route.params.examId,
            studentExam: null,
            loading: false,
            errorMessage: "",
            selectedQuestion: null,
            markQuestions: [],
            questions: [],
            answers: {},
            isShowSubmitModal: false,
            autoSaveTime: 3 * 60 * 1000, // 3 minutes
            autoSaveInterval: null,
            timeInterval: null,
            currentTime: Date.now()
        }
    },
    computed: {
        timeLeft() {
            if (!this.studentExam) return 0;
            const startTime = new Date(this.studentExam.startTime).getTime();
            const duration = this.studentExam.duration * 60 * 1000;
            return Math.max(0, duration - (this.currentTime - startTime));
        },
        formatTimeLeft() {
            const totalSeconds = Math.floor(this.timeLeft / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        },
        answeredCount() {
            return Object.keys(this.answers).filter(key => {
                const answer = this.answers[key];
                return Array.isArray(answer) ? answer.length > 0 : !!answer;
            }).length;
        },
        unansweredCount() {
            return this.questions.length - this.answeredCount;
        }
    },
    methods: {
        getStudentExam() {
            console.log("Fetching student exam for examId:", this.examId);
            takeExam({ userId:getUserInfo().userId,examId: this.examId }).then((response) => {
                console.log("Fetched student exam detail:", response);
                this.studentExam = response;
                this.questions = response.studentExamQuestions || [];
                
                // Initialize currentTime when data is loaded
                this.currentTime = Date.now();
                
                // Load previously selected answers (support multiple selections)
                this.questions.forEach(question => {
                    const selectedOptions = question.options.filter(opt => opt.isSelected);
                    if (selectedOptions.length > 0) {
                        this.$set(this.answers, question.studentExamQuestionId, 
                            selectedOptions.map(opt => opt.studentExamAnswerId));
                    } else {
                        this.$set(this.answers, question.studentExamQuestionId, []);
                    }
                });
                
                if (response.isReloaded) {
                    this.handleReloadExam();
                }
                
                this.startTimeCounter();
            }).catch((error) => {
                console.error("Error fetching student exam detail:", error);
                this.errorMessage = "Failed to load student exam detail.";
            }).finally(() => {
                this.loading = false;
            });
        },
        handleReloadExam() {
            if (this.examId !== this.studentExam.examId) {
                alert("You have an in-progress exam. You will be redirected to continue the exam.");
                this.$router.push(`/exam/take/${this.studentExam.examId}`);
            }
        },
        handleSubmitExam() {
            if (confirm('Are you sure you want to submit this exam? You cannot change your answers after submission.')) {
                this.isShowSubmitModal = true;
                submitExam(this.studentExam.studentExamId).then((response) => {
                    console.log("Submitted exam successfully:", response);
                    alert('Exam submitted successfully!');
                    this.$router.push('/exam/history');
                }).catch((error) => {
                    console.error("Error submitting exam:", error);
                    this.errorMessage = "Failed to submit exam.";
                    alert('Failed to submit exam. Please try again.');
                }).finally(() => {
                    this.isShowSubmitModal = false;
                });
            }
        },
        handleSaveExam() {
            if (!this.studentExam) return;
            
            // Transform answers to selections format
            const selections = [];
            Object.keys(this.answers).forEach(questionId => {
                const selectedAnswerIds = this.answers[questionId];
                if (Array.isArray(selectedAnswerIds)) {
                    selectedAnswerIds.forEach(answerId => {
                        selections.push({
                            studentExamAnswerId: answerId,
                            isSelected: true
                        });
                    });
                }
            });
            
            const payload = {
                studentExamId: this.studentExam.studentExamId,
                selections: selections
            };
            
            saveOption(payload).then((response) => {
                console.log("Saved exam answers:", response);
            }).catch((error) => {
                console.error("Error saving exam answers:", error);
            });
        },
        startAutoSave() {
            this.autoSaveInterval = setInterval(() => {
                this.handleSaveExam();
            }, this.autoSaveTime);
        },
        startTimeCounter() {
            this.timeInterval = setInterval(() => {
                this.currentTime = Date.now();
                if (this.timeLeft <= 0) {
                    clearInterval(this.timeInterval);
                    alert('Time is up! Your exam will be automatically submitted.');
                    this.handleSubmitExam();
                }
            }, 1000);
        },
        scrollToQuestion(index) {
            this.selectedQuestion = this.questions[index];
            const element = document.getElementById(`question-${index}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },
        toggleMark(questionId) {
            const index = this.markQuestions.indexOf(questionId);
            if (index > -1) {
                this.markQuestions.splice(index, 1);
            } else {
                this.markQuestions.push(questionId);
            }
        },
        getQuestionVariant(question) {
            const questionId = question.studentExamQuestionId;
            if (this.markQuestions.includes(questionId)) {
                return 'warning';
            } else {
                const answer = this.answers[questionId];
                const hasAnswer = Array.isArray(answer) ? answer.length > 0 : !!answer;
                return hasAnswer ? 'success' : 'secondary';
            }
        }   
    },
    mounted() {
        this.loading = true;
        this.getStudentExam();
        this.startAutoSave();
    },
    beforeDestroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
    }
}
</script>
<template>
    <main style="background-color: #f8f9fa; min-height: 100vh;">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
            <b-spinner variant="primary" style="width: 3rem; height: 3rem;"></b-spinner>
            <p class="mt-3 text-muted">Loading exam...</p>
        </div>

        <!-- Error State -->
        <b-alert v-if="errorMessage" variant="danger" show dismissible class="m-4">
            {{ errorMessage }}
        </b-alert>

        <!-- Main Content -->
        <b-container fluid v-if="!loading && studentExam">
            <b-row>
                <!-- Left Column - Questions -->
                <b-col cols="12" lg="9" class="py-3">
                    <div class="mb-3 p-3 bg-white rounded shadow-sm">
                        <h3 class="mb-2">{{ studentExam.examName }}</h3>
                        <p class="text-muted mb-0">
                            <i class="fas fa-user mr-2"></i>{{ studentExam.username }}
                        </p>
                    </div>

                    <!-- Questions List -->
                    <div v-for="(question, index) in questions" :key="question.studentExamQuestionId" :id="`question-${index}`" class="mb-4">
                        <b-card>
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <h5 class="mb-0">
                                    <b-badge variant="primary" class="mr-2">Q{{ index + 1 }}</b-badge>
                                    {{ question.content }}
                                </h5>
                                <b-button 
                                    size="sm" 
                                    :variant="markQuestions.includes(question.studentExamQuestionId) ? 'warning' : 'outline-warning'"
                                    @click="toggleMark(question.studentExamQuestionId)"
                                >
                                    <i class="fas fa-flag"></i>
                                    {{ markQuestions.includes(question.studentExamQuestionId) ? 'Marked' : 'Mark' }}
                                </b-button>
                            </div>
                            
                            <div class="pl-4">
                                <div
                                    v-for="option in question.options"
                                    :key="option.studentExamAnswerId"
                                    class="option-wrapper mb-2"
                                >
                                    <label 
                                        class="option-label p-3 rounded d-block"
                                        :class="{ 'selected': answers[question.studentExamQuestionId] && answers[question.studentExamQuestionId].includes(option.studentExamAnswerId) }"
                                    >
                                        <b-form-checkbox
                                            v-model="answers[question.studentExamQuestionId]"
                                            :value="option.studentExamAnswerId"
                                        >
                                            {{ option.content }}
                                        </b-form-checkbox>
                                    </label>
                                </div>
                            </div>
                        </b-card>
                    </div>
                </b-col>

                <!-- Right Column - Navigation & Info -->
                <b-col cols="12" lg="3" class="py-3">
                    <div class="sticky-top" style="top: 20px;">
                        <!-- Timer Card -->
                        <b-card class="mb-3 text-center shadow-sm">
                            <h5 class="mb-2">Time Remaining</h5>
                            <h2 class="text-danger mb-0" style="font-size: 2.5rem; font-weight: bold;">
                                {{ formatTimeLeft }}
                            </h2>
                        </b-card>

                        <!-- Progress Card -->
                        <b-card class="mb-3 shadow-sm">
                            <h6 class="mb-3">Progress</h6>
                            <div class="d-flex justify-content-between mb-2">
                                <span><i class="fas fa-check-circle text-success"></i> Answered</span>
                                <b-badge variant="success">{{ answeredCount }}</b-badge>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span><i class="fas fa-circle text-secondary"></i> Unanswered</span>
                                <b-badge variant="secondary">{{ unansweredCount }}</b-badge>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span><i class="fas fa-flag text-warning"></i> Marked</span>
                                <b-badge variant="warning">{{ markQuestions.length }}</b-badge>
                            </div>
                            <b-progress :value="answeredCount" :max="questions.length" variant="success" class="mt-3"></b-progress>
                        </b-card>

                        <!-- Question Navigator -->
                        <b-card class="mb-3 shadow-sm">
                            <h6 class="mb-3">Questions</h6>
                            <div class="d-flex flex-wrap">
                                <b-button
                                    v-for="(question, index) in questions"
                                    :key="question.studentExamQuestionId"
                                    :variant="getQuestionVariant(question)"
                                    size="sm"
                                    class="m-1"
                                    style="width: 40px; height: 40px;"
                                    @click="scrollToQuestion(index)"
                                >
                                    {{ index + 1 }}
                                </b-button>
                            </div>
                        </b-card>

                        <!-- Legend -->
                        <b-card class="mb-3 shadow-sm">
                            <h6 class="mb-3">Legend</h6>
                            <div class="mb-2">
                                <b-button variant="success" size="sm" disabled style="width: 30px; height: 30px;"></b-button>
                                <span class="ml-2">Answered</span>
                            </div>
                            <div class="mb-2">
                                <b-button variant="warning" size="sm" disabled style="width: 30px; height: 30px;"></b-button>
                                <span class="ml-2">Marked</span>
                            </div>
                            <div>
                                <b-button variant="secondary" size="sm" disabled style="width: 30px; height: 30px;"></b-button>
                                <span class="ml-2">Not Answered</span>
                            </div>
                        </b-card>

                        <!-- Action Buttons -->
                        <b-card class="shadow-sm">
                            <b-button variant="danger" block @click="handleSaveExam" class="mb-2">
                                <i class="fas fa-save mr-2"></i>Save Progress
                            </b-button>
                            <b-button variant="primary" block @click="handleSubmitExam">
                                <i class="fas fa-paper-plane mr-2"></i>Submit Exam
                            </b-button>
                        </b-card>
                    </div>
                </b-col>
            </b-row>
        </b-container>

        <!-- Submit Modal -->
        <b-modal v-model="isShowSubmitModal" title="Submitting Exam" hide-footer no-close-on-backdrop no-close-on-esc>
            <div class="text-center py-4">
                <b-spinner variant="primary" style="width: 3rem; height: 3rem;"></b-spinner>
                <p class="mt-3">Please wait while we submit your exam...</p>
            </div>
        </b-modal>
    </main>
</template>

<style scoped>
.sticky-top {
    position: sticky;
}

.option-wrapper {
    transition: all 0.3s ease;
}

.option-label {
    cursor: pointer;
    border: 2px solid #dee2e6;
    transition: all 0.3s ease;
    background-color: #fff;
}

.option-label:hover {
    background-color: #f8f9fa;
    border-color: #0d6efd;
}

.option-label.selected {
    background-color: #e7f3ff;
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.option-label >>> .custom-control-label {
    cursor: pointer;
    width: 100%;
    margin-bottom: 0;
}

.card {
    border: none;
}

.shadow-sm {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}
</style>