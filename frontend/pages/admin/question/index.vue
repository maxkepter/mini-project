<script>
import { ADMIN_ROLE } from '~/const/role.const';
import BaseModal from '~/components/BaseModal.vue';
import { createQuestion, deleteQuestion, getAllQuestions, updateQuestion } from '~/services/question.service';

export default {
    name: "AdminQuestionPage",
    layout: 'admin',
    middleware: 'auth',
    meta: {
        auth: true,
        roles: [ADMIN_ROLE]
    },
    components: { BaseModal },
    data() {
        return {
            title: "Manage Questions",
            questions: [],
            errorMessage: "",
            questionContent: "",
            options: [
                { content: '', isCorrect: false },
                { content: '', isCorrect: false },
            ],
            isShowCreateModal: false,
            isShowEditModal: false,
            editQuestionId: null,
            editQuestionData: null,
        };
    },
    computed: {
        editQuestion() {
            return this.editQuestionData;
        },
        hasAtLeastTwoOptionsEdit() {
            return this.editQuestion && this.editQuestion.options.length >= 2;
        },
        hasAtLeastOneCorrectEdit() {
            return this.editQuestion && this.editQuestion.options.some(o => !!o.isCorrect);
        },
        allFieldsFilledEdit() {
            if (!this.editQuestion) return false;
            return !!(this.editQuestion.content && this.editQuestion.content.trim()) &&
                this.editQuestion.options.every(o => !!(o.content && o.content.trim()));
        },
        isUpdateDisabled() {
            return !(this.hasAtLeastTwoOptionsEdit && this.hasAtLeastOneCorrectEdit && this.allFieldsFilledEdit);
        },
        hasAtLeastTwoOptions() {
            return this.options.length >= 2;
        },
        hasAtLeastOneCorrect() {
            return this.options.some(o => !!o.isCorrect);
        },
        allFieldsFilled() {
            return !!(this.questionContent && this.questionContent.trim()) &&
                this.options.every(o => !!(o.content && o.content.trim()));
        },
        isCreateDisabled() {
            return !(this.hasAtLeastTwoOptions && this.hasAtLeastOneCorrect && this.allFieldsFilled);
        }
    },
    methods: {
        fetchQuestions() {
            getAllQuestions().then((res) => {
                this.questions = res;
            }).catch((err) => {
                this.errorMessage = "Failed to load questions.";
                console.error(err);
            });
        },
        createQuestion() {
            if (this.isCreateDisabled) {
                this.errorMessage = "Please fill all fields, keep at least 2 options, and mark at least 1 option as correct.";
                return;
            }
            this.errorMessage = "";
            // TODO: implement API call to create question
            const payload = {
                content: this.questionContent.trim(),
                options: this.options.map((o, i) => ({ 
                    content: o.content.trim(), 
                    isCorrect: !!o.isCorrect, 
                    order: i 
                }))
            };
            console.log('Create question payload:', payload);
            this.hideCreateModal();
            this.questionContent = '';
            this.options = [
                { content: '', isCorrect: false },
                { content: '', isCorrect: false },
            ];
            createQuestion(payload).then((res) => {
                console.log('Question created successfully:', res);
                this.fetchQuestions();
            }).catch((err) => {
                this.errorMessage = "Failed to create question.";
                console.error(err);
            });
        },
        deleteQuestion(questionId){
            deleteQuestion(questionId).then((res)=>{
                console.log('Question deleted successfully:', res);
                this.fetchQuestions();
            }).catch((err)=>{
                this.errorMessage = "Failed to delete question.";
                console.error(err);
            })
        },
        updateQuestion() {
            if (this.isUpdateDisabled) {
                this.errorMessage = "Please fill all fields, keep at least 2 options, and mark at least 1 option as correct.";
                return;
            }
            if (!this.editQuestion) {
                this.errorMessage = "Question not found.";
                return;
            }
            this.errorMessage = "";
            const payload = {
                content: this.editQuestion.content.trim(),
                options: this.editQuestion.options.map((o, i) => ({ 
                    content: o.content.trim(), 
                    isCorrect: !!o.isCorrect, 
                    order: i 
                }))
            };
            console.log('Update question payload:', payload);
            
            updateQuestion(this.editQuestionId, payload).then((res) => {
                console.log('Question updated successfully:', res);
                this.hideEditModal();
                this.fetchQuestions();
            }).catch((err) => {
                this.errorMessage = "Failed to update question.";
                console.error(err);
            });
        },
        showCreateModal() {
            this.isShowCreateModal = true;
        },
        hideCreateModal() {
            this.isShowCreateModal = false;
        },
        showEditModal(questionId) {
            const originalQuestion = this.getQuestionById(questionId);
            if (!originalQuestion) {
                this.errorMessage = "Question not found.";
                return;
            }
            // Deep clone to avoid mutating original
            this.editQuestionData = {
                ...originalQuestion,
                content: originalQuestion.content,
                options: originalQuestion.options.map(opt => ({
                    ...opt,
                    content: opt.content,
                    isCorrect: opt.isCorrect
                }))
            };
            this.editQuestionId = questionId;
            this.isShowEditModal = true;
        },
        hideEditModal() {
            this.editQuestionId = null;
            this.editQuestionData = null;
            this.isShowEditModal = false;
        },
        removeOption(optionsArray, index) {
            if (optionsArray.length <= 2) return;
            optionsArray.splice(index, 1);
        },
        addOption(optionsArray) {
            optionsArray.push({ content: '', isCorrect: false });
        },
        getQuestionById(id) {
            return this.questions.find(q => q.questionId === id || q.id === id);
        }
    },
    mounted() {
        this.fetchQuestions();
    },
}
</script><template>
    <main>
        <b-container>
            <b-row>
                <h2>Create Question</h2>
                <b-col class="text-right mb-3 mt-3">
                    <b-button variant="success" @click="showCreateModal"><i class="fas fa-plus-circle mr-2"></i>Create New Question</b-button>
                </b-col>

            </b-row>
            <!-- List questions -->
            <b-row>
                <h3>Question Added</h3>
                <div>
                    <div class="list-group">
                    <div class="list-group-item" v-for="question in questions" :key="question.id">
                        <div class="mb-3 d-flex justify-content-between align-items-center">
                            <strong>{{ question.content }}</strong>
                            <div class="text-right">
                            <b-button size="sm" variant="warning" class="mr-2" @click="showEditModal(question.questionId)">Edit</b-button>
                            <b-button size="sm" variant="danger" @click="deleteQuestion(question.questionId)">Delete</b-button>
                        </div>
                        </div>
                        <div class="mb-3">
                            <ul class="ml-4">
                                <li v-for="option in question.options" :key="option.id">
                                    {{ option.content }} 
                                    <span v-if="option.isCorrect" class="text-success font-weight-bold">(Correct)</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                </div>
            </b-row>

             <!-- Create modal -->
            <base-modal :show="isShowCreateModal" @update:show="isShowCreateModal = $event" size="md" centered>
             <!--header  -->
            <template #header>
                <div class="modal-header">
                    <h5 class="modal-title">Create Question</h5>
                    <button type="button" class="btn-close" @click="hideCreateModal"></button>
                </div>
            </template>         
              <!-- body  -->
            <div class="modal-body">
                <b-form>
                    <b-form-group label="Question Content">
                        <b-form-input v-model="questionContent" placeholder="Enter question content"></b-form-input>
                    </b-form-group>
                    <b-form-group label="Options">
                        <div v-for="(option, index) in options" :key="index" class="mb-2">
                            <b-row>
                                <b-col cols="8">
                                    <b-form-input v-model="option.content" placeholder="Enter option text"></b-form-input>
                                </b-col>
                                <b-col cols="3" class="d-flex align-items-center">
                                    <b-form-checkbox v-model="option.isCorrect">Correct</b-form-checkbox>
                                </b-col>
                                <b-col cols="1" class="text-right">
                                    <b-button size="sm" variant="outline-danger" :disabled="options.length <= 2" @click="removeOption(options, index)">
                                        &times;
                                    </b-button>
                                </b-col>
                            </b-row>
                        </div>
                        <div class="d-flex align-items-center mt-2">
                            <b-button variant="secondary" @click="addOption(options)">Add Option</b-button>
                            <small class="text-muted ml-3">Min 2 options. Mark at least 1 as correct.</small>
                        </div>
                    </b-form-group>
                    <b-alert v-if="errorMessage" variant="danger" show class="mt-2">{{ errorMessage }}</b-alert>
                </b-form>
            </div>
            <!-- footer -->
            <template #footer>
                <div class="modal-footer">
                    <b-button variant="secondary" @click="hideCreateModal">Close</b-button>
                    <b-button variant="primary" :disabled="isCreateDisabled" @click="createQuestion">Create Question</b-button>
                </div>
            </template>
            </base-modal>

               <!-- Update Modal -->
                <base-modal :show="isShowEditModal" @update:show="isShowEditModal = $event" size="md" centered>
                <template #header>
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Question</h5>
                        <button type="button" class="btn-close" @click="hideEditModal"></button>
                    </div>
                </template>
            <div class="modal-body" v-if="editQuestion">
    <b-form>
        <b-form-group label="Question Content">
            <b-form-input v-model="editQuestion.content" placeholder="Enter question content"></b-form-input>
        </b-form-group>
        <b-form-group label="Options">
            <div v-for="(option, index) in editQuestion.options" :key="index" class="mb-2">
                <b-row>
                    <b-col cols="8">
                        <b-form-input v-model="option.content" placeholder="Enter option text"></b-form-input>
                    </b-col>
                    <b-col cols="3" class="d-flex align-items-center">
                        <b-form-checkbox v-model="option.isCorrect">Correct</b-form-checkbox>
                    </b-col>
                    <b-col cols="1" class="text-right">
                        <b-button size="sm" variant="outline-danger" :disabled="editQuestion.options.length <= 2" @click="removeOption(editQuestion.options, index)">
                            &times;
                        </b-button>
                    </b-col>
                </b-row>
            </div>
            <div class="d-flex align-items-center mt-2">
                <b-button variant="secondary" @click="addOption(editQuestion.options)">Add Option</b-button>
                <small class="text-muted ml-3">Min 2 options. Mark at least 1 as correct.</small>
            </div>
        </b-form-group>
        <b-alert v-if="errorMessage" variant="danger" show class="mt-2">{{ errorMessage }}</b-alert>
    </b-form>
</div>
                   <template #footer>
            <div class="modal-footer">  
                <b-button variant="secondary" @click="hideEditModal">Close</b-button>
                <b-button variant="primary" :disabled="isUpdateDisabled" @click="updateQuestion">Save Changes</b-button>
            </div>
                   </template> 
            </base-modal>
        </b-container>
    </main>
</template>