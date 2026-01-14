<template>
  <div class="home">
    <div class="row">
      <div class="col-md-10 mx-auto">
        <h1 class="mb-4">Welcome to Student Portal</h1>
        <p class="lead">Explore and complete your exams</p>
        
        <div class="row mt-5">
          <div class="col-md-6 mb-4">
            <div class="card shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title">
                  <i class="fas fa-book mr-2 text-primary"></i>Available Exams
                </h5>
                <p class="card-text">Take a look at available exams and start answering questions.</p>
                <NuxtLink to="/exam" class="btn btn-primary btn-sm">
                  <i class="fas fa-arrow-right mr-2"></i>View Exams
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="col-md-6 mb-4">
            <div class="card shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title">
                  <i class="fas fa-history mr-2 text-success"></i>Exam History
                </h5>
                <p class="card-text">Check your past exam submissions and scores.</p>
                <NuxtLink to="/exam/history" class="btn btn-success btn-sm">
                  <i class="fas fa-arrow-right mr-2"></i>View History
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="col-md-6 mb-4">
            <div class="card shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title">
                  <i class="fas fa-user-circle mr-2 text-info"></i>Your Profile
                </h5>
                <p class="card-text">View and manage your profile information.</p>
                <NuxtLink to="/profile" class="btn btn-info btn-sm">
                  <i class="fas fa-arrow-right mr-2"></i>Go to Profile
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="col-md-6 mb-4">
            <div class="card shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title">
                  <i class="fas fa-lock mr-2 text-warning"></i>Change Password
                </h5>
                <p class="card-text">Update your account password for security.</p>
                <NuxtLink to="/profile/change-password" class="btn btn-warning btn-sm">
                  <i class="fas fa-arrow-right mr-2"></i>Change Password
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'user',
  data() {
    return {
      title: 'Home'
    }
  }
}
</script>

<style scoped>
.home {
  padding-top: 2rem;
}

h1 {
  color: #333;
  font-weight: bold;
}

.lead {
  color: #666;
  font-size: 1.1rem;
}

.card {
  border: none;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.card-title {
  font-weight: 600;
  color: #333;
}

.card-text {
  color: #666;
  margin-bottom: 1.5rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}
</style>
