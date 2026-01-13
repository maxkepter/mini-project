<script>
import { registerUser } from "../../../services/auth.service";
import { Urls } from "../../../const/url.const";
import BaseModal from "~/components/BaseModal.vue";

export default {
  name: "RegisterPage",
  data() {
    return {
      title: "Register",
      username: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      loading: false,
      showSuccessModal: false,
    };
  },
  methods: {
    handleRegister() {
      // Validation
      if (!this.username || !this.password || !this.confirmPassword) {
        this.errorMessage = "Please fill in all fields.";
        return;
      }

      if (this.password.length < 6) {
        this.errorMessage = "Password must be at least 6 characters.";
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      this.loading = true;
      this.errorMessage = "";

      registerUser({
        username: this.username,
        password: this.password,
      })
        .then((response) => {
          console.log("Registration successful:", response);
          this.errorMessage = "";
          this.showSuccessModal = true;
        })
        .catch((error) => {
          console.error("Registration failed:", error);
          this.errorMessage =
            error.response?.data?.message ||
            "Registration failed. Please try again.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    goToLogin() {
      this.$router.push(Urls.LOGIN);
    },
  },
};
</script>

<template>
  <main>
    <b-container class="mt-5">
      <b-row class="justify-content-center">
        <b-col cols="12" md="6">
          <b-card class="shadow-sm border-0" title="Create New Account">
            <!-- Error Alert -->
            <b-alert
              v-if="errorMessage"
              variant="danger"
              show
              @dismissed="errorMessage = ''"
              class="mb-3"
            >
              {{ errorMessage }}
            </b-alert>

            <!-- Registration Form -->
            <b-form @submit.prevent="handleRegister">
              <!-- Username Field -->
              <b-form-group
                id="username-group"
                label="Username"
                label-for="username"
                description="Choose a unique username" class="mb-3"
              >
                <b-form-input
                  id="username"
                  v-model="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                ></b-form-input>
              </b-form-group>

              <!-- Password Field -->
              <b-form-group
                id="password-group"
                label="Password"
                label-for="password"
                description="At least 6 characters" class="mb-3"
              >
                <b-form-input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                ></b-form-input>
              </b-form-group>

              <!-- Confirm Password Field -->
              <b-form-group
                id="confirm-password-group"
                label="Confirm Password"
                label-for="confirm-password"
                description="Re-enter your password" class="mb-3"
              >
                <b-form-input
                  id="confirm-password"
                  v-model="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                ></b-form-input>
              </b-form-group>

              <!-- Submit Button -->
              <b-button
                type="submit"
                variant="primary"
                class="w-100 mb-2"
                :disabled="loading"
              >
                <b-spinner
                  v-if="loading"
                  small
                  type="border"
                  class="mr-2"
                ></b-spinner>
                {{ loading ? "Registering..." : "Register" }}
              </b-button>

              <!-- Login Link -->
              <div class="text-center">
                <p class="mb-0">
                  Already have an account?
                  <b-link @click="goToLogin" href="#">Log in here</b-link>
                </p>
              </div>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
      <!-- Modal success -->
       <base-modal
        :show="showSuccessModal"
        title="Registration Successful"
        @close="showSuccessModal = false; goToLogin()">
        <template #header>
          <div class="modal-header">
            <h5 class="modal-title">Registration Successful</h5>
            <button type="button" class="btn-close" @click="showSuccessModal = false"></button>
          </div>
          </template>
        <template #default>
          <div class="modal-body">
            <p>Your account has been created successfully!</p>
          </div>
        </template>
        <template #footer>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="showSuccessModal = false; goToLogin()">OK</button>
          </div>
        </template>
      </base-modal>
    </b-container>
  </main>
</template>

<style scoped>
.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

b-card {
  border-radius: 8px;
}
</style>
