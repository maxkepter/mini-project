<script>
import { Urls } from "../../../const/url.const";
import { loginUser } from "../../../services/auth.service";
import { ADMIN_ROLE, USER_ROLE } from "../../../const/role.const";
import { LocalStorageKeys } from "../../../const/local-storage.const";

export default {
  name: "LoginPage",
  data() {
    return {
      title: "Login",
      username: "",
      password: "",
      erorrMessage: "",
    };
  },
  methods: {
    handleLogin() {
      if (!this.username || !this.password) {
        this.erorrMessage = "Please enter both username and password.";
        return;
      }
      loginUser({
        username: this.username,
        password: this.password,
      })
        .then((response) => {
          console.log("Login successful:", response);
          this.erorrMessage = "";
          
          // Get user role from localStorage after login
          const userInfo = localStorage.getItem(LocalStorageKeys.USER_INFO);
          if (userInfo) {
            const info = JSON.parse(userInfo);
            console.log("User role after login:", info.role);
            
            // Add small delay to ensure localStorage is synced
            setTimeout(() => {
              // Redirect based on role
              if (info.role === ADMIN_ROLE) {
                this.$router.push({ path: '/admin' });
              } else if (info.role === USER_ROLE) {
                this.$router.push({ path: Urls.HOME });
              } else {
                this.$router.push({ path: Urls.HOME });
              }
            }, 100);
          } else {
            this.$router.push({ path: Urls.HOME });
          }
        })
        .catch((error) => {
          console.error("Login failed:", error);
          this.erorrMessage = "Invalid username or password.";
        });
    },
  },
};
</script>
<template>
  <main>
    <b-container class="mt-5">
      <b-row class="justify-content-center">
        <b-col cols="12" md="6">
          <b-card title="Login" class="p-4">
            <b-form>
              <b-form-group
                label="Username"
                label-for="username-input"
                class="mb-3"
              >
                <b-form-input
                  v-model="username"
                  id="username-input"
                  type="text"
                  placeholder="Enter username"
                  required
                  class="mt-2"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                label="Password"
                label-for="password-input"
                class="mb-3"
              >
                <b-form-input
                  v-model="password"
                  id="password-input"
                  type="password"
                  placeholder="Enter password"
                  required
                  class="mt-2"
                ></b-form-input>
              </b-form-group>
              <div v-if="erorrMessage" class="text-danger mb-3">
                {{ erorrMessage }}
              </div>
              <b-button variant="primary" block @click="handleLogin()"
                >Login</b-button
              >
              <NuxtLink to="/auth/register" class="d-block text-center mt-3">
                Don't have an account? Register
              </NuxtLink>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </main>
</template>
