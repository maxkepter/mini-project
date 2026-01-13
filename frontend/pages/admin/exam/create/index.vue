<script>
import { createExam } from '~/services/exam.service';
import { getAllQuestions } from '~/services/question.service';

    export default {
        name: "AdminCreateExamPage",
        data() {
            return {
                title: "Create Exam",
                questions: [],
                examName: "",
                duration: 0,
                errorMessage: "",
                selectedQuestionIds: [],
            };
        },
        computed: {
            selectedQuestion(){
                const temp=this.questions;
                console.log("All questions:", temp);
                return temp.filter(q=>this.selectedQuestionIds.includes(q.questionId));
            }
        }
        ,methods: {
            fetchQuestions(){
                // Fetch all questions from the server
                getAllQuestions()
                    .then((response) => {
                        console.log("Fetched questions:", response);
                        this.questions = response;
                    })
                    .catch((error) => {
                        console.error("Error fetching questions:", error);
                        this.errorMessage = "Failed to load questions.";
                    });
            },handeleCeateExam(){
                if(!this.examName){
                    this.errorMessage="Exam name is required.";
                    return;
                }
                if(this.duration <=0){
                    this.errorMessage="Duration must be greater than 0.";
                    return;
                }
                if(this.selectedQuestionIds.length ===0){
                    this.errorMessage="Please select at least one question.";
                    return;
                }
                const examData={
                    name:this.examName,
                    duration:this.duration,
                    questionIds:this.selectedQuestionIds,
                };
                createExam(examData).then((res)=>{
                    console.log("Exam created successfully:", res);
                    this.$router.push('/admin/exam');
                }).catch((err)=>{
                    this.errorMessage="Failed to create exam.";
                    console.error(err);
                });

            }
        },mounted() {
            this.fetchQuestions();
        }}
</script><template>
    <main class="py-4">
        <b-container>
            <b-row>
                <b-col cols="12" md="4">
                    <div class="mb-4">
                        <h2 class="mb-4">Create Exam</h2>
                        <b-form @submit.prevent="handeleCeateExam">
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
                                    placeholder="Enter duration in minutes"
                                    required>
                                </b-form-input>
                            </b-form-group>
                            
                            <b-alert v-if="errorMessage" variant="danger" show dismissible @dismissed="errorMessage = ''" class="mb-3">
                                {{ errorMessage }}
                            </b-alert>
                            
                            <b-button variant="success" type="submit" class="w-100 mt-2">
                                <i class="fas fa-plus-circle mr-2"></i>Create Exam
                            </b-button>
                        </b-form>
                    </div>
                    
                    <b-card no-body class="shadow-sm">
                        <b-card-header header-bg-variant="light">
                            <strong>Selected Questions ({{ selectedQuestion.length }})</strong>
                        </b-card-header>
                        <b-card-body class="p-0">
                            <div v-if="selectedQuestion.length === 0" class="p-3 text-center text-muted">
                                No questions selected yet
                            </div>
                            <b-list-group v-else flush>
                                <b-list-group-item v-for="question in selectedQuestion" :key="question.questionId">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <span>{{ question.content }}</span>
                                        <b-button 
                                            size="sm" 
                                            variant="outline-danger" 
                                            @click="selectedQuestionIds = selectedQuestionIds.filter(id => id !== question.questionId)">
                                            &times;
                                        </b-button>
                                    </div>
                                </b-list-group-item>
                            </b-list-group>
                        </b-card-body>
                    </b-card>
                </b-col>
                
                <b-col cols="12" md="8">
                    <h3 class="mb-3">All Questions</h3>
                    <div v-if="questions.length === 0" class="text-center text-muted py-5">
                        <p>No questions available. Please create some questions first.</p>
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
                                        <span v-if="option.isCorrect" class="text-success font-weight-bold">(Correct)</span>
                                    </li>
                                </ul>
                            </div>
                        </b-list-group-item>
                    </b-list-group>
                </b-col>
            </b-row>
        </b-container>
    </main>
</template>