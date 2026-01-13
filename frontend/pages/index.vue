<template>
  <div class="home">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <h1 class="mb-4">Welcome to Nuxt</h1>
        <p class="lead">This is your Nuxt 2.14.7 project with Bootstrap and Axios.</p>
        
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Getting Started</h5>
            <p class="card-text">You have successfully set up:</p>
            <ul>
              <li>Nuxt 2.14.7</li>
              <li>Bootstrap 5</li>
              <li>Bootstrap Vue 2</li>
              <li>Axios</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
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
}

.card {
  margin-top: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
