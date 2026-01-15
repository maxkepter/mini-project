<script>
import { ADMIN_ROLE, SUB_ADMIN_ROLE } from '~/const/role.const';
import { getUserInfo } from '~/services/auth.service';
import { getExam, deleteExam } from '~/services/exam.service';

export default {
    name: "AdminExamPage",
    layout: 'admin',
    middleware: 'auth',
    meta: {
        auth: true,
        roles: [ADMIN_ROLE, SUB_ADMIN_ROLE]
    },
    data() {
        return {
            title: "Manage Exams",
            exams: [],
            searchQuery: '',
            errorMessage: '',
            loading: false,
            userInfo:getUserInfo(),
            ADMIN_ROLE,
        };
    },
    methods: {
        fetchExams() {
            this.loading = true;
            this.errorMessage = '';
            getExam(this.searchQuery).then((res) => {
                console.log("Fetched exams:", res);
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
        deleteExam(examId) {
            if (!confirm('Are you sure you want to delete this exam?')) {
                return;
            }
            deleteExam(examId).then((res) => {
                console.log("Exam deleted successfully:", res);
                this.fetchExams();
            }).catch((err) => {
                console.error("Error deleting exam:", err);
                this.errorMessage = "Failed to delete exam.";
            });
        },
        viewDetails(examId) {
            this.$router.push(`/admin/exam/${examId}`);
        },
        viewStudentExam(examId) {
            this.$router.push(`/admin/exam/${examId}/student-exams`);
        },
        goToCreateExam() {
            this.$router.push('/admin/exam/create');
        }
    },
    mounted() {
        this.fetchExams();
    },
}
</script><template>
    <main class="py-4">
        <b-container>
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>{{ title }}</h2>
                <b-button variant="success" @click="goToCreateExam">
                    <i class="fas fa-plus-circle mr-2"></i> Create New Exam
                </b-button>
            </div>

            <!-- Search Bar -->
            <b-row class="mb-4">
                <b-col cols="12" class="mb-2 " >
                    <b-form-input
                        v-model="searchQuery"
                        placeholder="Search exams by name..."
                        @keyup.enter="searchExams"
                    ></b-form-input>
                </b-col>
                <b-col cols="12" class="mt-2 mt-md-0 ">
                    <b-button variant="primary" @click="searchExams" class="mr-2">
                        <i class="fas fa-search mr-2"></i> Search
                    </b-button>
                    <b-button variant="secondary" @click="resetFields">
                        <i class="fas fa-redo mr-2"></i> Reset
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
                <p class="text-muted">Create your first exam to get started</p>
                <b-button variant="success" @click="goToCreateExam">
                    <i class="fas fa-plus-circle mr-2"></i> Create Exam
                </b-button>
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
                            <div class="d-flex flex-column gap-2">
                                <b-button 
                                    variant="primary" 
                                    size="sm" 
                                    @click="viewDetails(exam.examId)">
                                    <i class="fas fa-eye mr-2"></i> View Details
                                </b-button>
                                <b-button 
                                    variant="info" 
                                    size="sm" 
                                    @click="viewStudentExam(exam.examId)">
                                    <i class="fas fa-users mr-2"></i> Student Exams
                                </b-button>
                                <b-button 
                                    variant="danger" 
                                    size="sm" 
                                    @click="deleteExam(exam.examId)"
                                    :disabled="userInfo.role !== ADMIN_ROLE"
                                    >
                                    <i class="fas fa-trash mr-2"></i> Delete
                                </b-button>
                            </div>
                        </template>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </main>
</template>