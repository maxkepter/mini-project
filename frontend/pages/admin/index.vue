<template>
  <div class="home">
    <div class="row">
      <div class="col-md-12">
        <h1 class="mb-2">Admin Dashboard</h1>
        <p class="text-muted mb-4">Welcome back! Here's an overview of your system.</p>

        <!-- Statistics Cards -->
        <div class="row mb-4">
          <div class="col-md-3 mb-3">
            <div class="card shadow-sm border-left-primary">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="text-muted mb-1">Total Exams</h6>
                    <h3 class="text-primary mb-0">{{ totalExams }}</h3>
                  </div>
                  <i class="fas fa-book fa-2x text-primary opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-3 mb-3">
            <div class="card shadow-sm border-left-success">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="text-muted mb-1">Total Questions</h6>
                    <h3 class="text-success mb-0">{{ totalQuestions }}</h3>
                  </div>
                  <i class="fas fa-question-circle fa-2x text-success opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-3 mb-3">
            <div class="card shadow-sm border-left-info">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="text-muted mb-1">Total Users</h6>
                    <h3 class="text-info mb-0">{{ totalUsers }}</h3>
                  </div>
                  <i class="fas fa-users fa-2x text-info opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-3 mb-3">
            <div class="card shadow-sm border-left-warning">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="text-muted mb-1">Active Users</h6>
                    <h3 class="text-warning mb-0">{{ activeUsers }}</h3>
                  </div>
                  <i class="fas fa-user-check fa-2x text-warning opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="row">
          <div class="col-md-12">
            <div class="card shadow-sm">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">Quick Actions</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <NuxtLink to="/admin/exam" class="btn btn-outline-primary btn-block py-3">
                      <i class="fas fa-plus mr-2"></i>Manage Exams
                    </NuxtLink>
                  </div>
                  <div class="col-md-6 mb-3">
                    <NuxtLink to="/admin/exam/create" class="btn btn-outline-primary btn-block py-3">
                      <i class="fas fa-plus mr-2"></i>Create New Exam
                    </NuxtLink>
                  </div>
                  <div class="col-md-6 mb-3">
                    <NuxtLink to="/admin/question" class="btn btn-outline-success btn-block py-3">
                      <i class="fas fa-plus mr-2"></i>Manage Questions
                    </NuxtLink>
                  </div>
                  <div class="col-md-6 mb-3">
                    <NuxtLink to="/admin/user" class="btn btn-outline-info btn-block py-3">
                      <i class="fas fa-plus mr-2"></i>Manage Users
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ADMIN_ROLE, SUB_ADMIN_ROLE } from '~/const/role.const';
import { getExam } from '~/services/exam.service';
import { getAllQuestions } from '~/services/question.service';
import { getAllUser } from '~/services/user.service';

export default {
  name: 'AdminHomePage',
  layout: 'admin',
  middleware: 'auth',
  meta: {
    auth: true,
    roles: [ADMIN_ROLE, SUB_ADMIN_ROLE]
  },
  data() {
    return {
      title: 'Admin Dashboard',
      totalExams: 0,
      totalQuestions: 0,
      totalUsers: 0,
      activeUsers: 0,
      loading: false
    };
  },
  methods: {
    async fetchDashboardStats() {
      this.loading = true;
      try {
        // Fetch exams
        const examsResponse = await getExam('');
        this.totalExams = Array.isArray(examsResponse) ? examsResponse.length : 0;

        // Fetch questions
        const questionsResponse = await getAllQuestions();
        this.totalQuestions = Array.isArray(questionsResponse) ? questionsResponse.length : 0;

        // Fetch users
        const usersResponse = await getAllUser();
        if (Array.isArray(usersResponse)) {
          this.totalUsers = usersResponse.length;
          this.activeUsers = usersResponse.filter(user => user.isActive).length;
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchDashboardStats();
  }
}
</script>

<style scoped>
.home {
  padding-top: 1rem;
}

h1 {
  color: #333;
  font-weight: bold;
}

.card {
  border: none;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.border-left-primary {
  border-left: 4px solid #007bff !important;
}

.border-left-success {
  border-left: 4px solid #28a745 !important;
}

.border-left-info {
  border-left: 4px solid #17a2b8 !important;
}

.border-left-warning {
  border-left: 4px solid #ffc107 !important;
}

.opacity-50 {
  opacity: 0.5;
}

.card-header {
  background-color: #f8f9fa;
}

.btn-block {
  display: block;
  width: 100%;
}

.btn-outline-primary:hover,
.btn-outline-success:hover,
.btn-outline-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>
