<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-code">403</h1>
      <h2 class="error-title">Access Denied</h2>
      <p class="error-message">You do not have permission to access this page.</p>
      <div class="error-actions">
        <b-button variant="primary" @click="$router.push('/')">
          <i class="fas fa-home"></i> Go to Home
        </b-button>
        <b-button variant="secondary" @click="$router.back()">
          <i class="fas fa-arrow-left"></i> Go Back
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Error403Page",
  layout: "default"
};
</script>

<style scoped>
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.error-content {
  text-align: center;
  background: white;
  border-radius: 8px;
  padding: 60px 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.error-code {
  font-size: 80px;
  font-weight: 700;
  color: #ea6666;
  margin: 0;
  line-height: 1;
}

.error-title {
  font-size: 32px;
  color: #333;
  margin: 20px 0 10px 0;
}

.error-message {
  font-size: 16px;
  color: #666;
  margin: 0 0 30px 0;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.error-actions button {
  min-width: 150px;
}

.error-actions i {
  margin-right: 8px;
}
</style>
