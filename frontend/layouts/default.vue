<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <NuxtLink to="/" class="navbar-brand">My App</NuxtLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <NuxtLink to="/" class="nav-link">Home</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <main class="container py-4">
      <Nuxt />
    </main>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>

<style scoped>
nav {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
