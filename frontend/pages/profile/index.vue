<script>
import { ADMIN_ROLE, USER_ROLE, SUB_ADMIN_ROLE } from '~/const/role.const';
import { getUserProfile } from '~/services/user.service';

export default {
  name: "ProfilePage",
  layout: 'profile',
  middleware: 'auth',
  meta: {
    auth: true,
    roles: [ADMIN_ROLE, SUB_ADMIN_ROLE, USER_ROLE]
  },
  data() {
    return {
      title: "Profile",
      userInfo: {
        userId: null,
        username: null,
        role: null,
        isActive: null,
      },
      loading: true,
      error: null,
    };
  },
  computed: {
    statusBadgeVariant() {
      return this.userInfo.isActive ? "success" : "danger";
    },
    statusText() {
      return this.userInfo.isActive ? "Active" : "Inactive";
    },
    roleBadgeVariant() {
      if (this.userInfo.role === ADMIN_ROLE) {
        return 'danger';
      } else if (this.userInfo.role === SUB_ADMIN_ROLE) {
        return 'warning';
      } else if (this.userInfo.role === USER_ROLE) {
        return 'info';
      }
      return 'secondary';
    },
    roleValue() {
      if (this.userInfo.role === ADMIN_ROLE) {
        return "Admin";
      } else if (this.userInfo.role === SUB_ADMIN_ROLE) {
        return "Sub Admin";
      } else if (this.userInfo.role === USER_ROLE) {
        return "User";
      }
      return  "N/A";
    }

  },
  methods: {
    getUserInfo() {
      this.loading = true;
      this.error = null;
      getUserProfile()
        .then((response) => {
          const data = response;
          console.log("User profile data:", response);
          this.userInfo.userId = data.userId;
          this.userInfo.username = data.username;
          this.userInfo.role = data.role;
          this.userInfo.isActive = data.isActive;
          this.loading = false;
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          this.error = error.message || "Failed to load user profile";
          this.loading = false;
        });
    }
  },
  mounted() {
    this.getUserInfo();
  }
};
</script>

<template>
  <main class="profile-page py-5">
    <b-container>
      <!-- Error Alert -->
      <b-alert v-if="error" variant="danger" dismissible show>
        <strong>Error:</strong> {{ error }}
      </b-alert>

      <!-- Loading State -->
      <div v-if="loading" class="text-center my-5">
        <b-spinner label="Loading..."></b-spinner>
        <p class="mt-3">Loading profile information...</p>
      </div>

      <!-- Profile Content -->
      <div v-else>
        <!-- Info Card -->
        <b-card class="profile-card shadow-sm mb-4">
          <b-row>
            <b-col cols="12">
              <h2 class="mb-4">
                <i class="fas fa-user-circle mr-2"></i>
                User Profile
              </h2>
            </b-col>
          </b-row>

          <b-list-group flush>
            <b-list-group-item>
              <strong>User ID:</strong>
              <span class="float-right text-muted">{{ userInfo.userId || "N/A" }}</span>
            </b-list-group-item>

            <b-list-group-item>
              <strong>Username:</strong>
              <span class="float-right text-muted">{{ userInfo.username || "N/A" }}</span>
            </b-list-group-item>

            <b-list-group-item>
              <strong>Role:</strong>
              <span class="float-right">
                <b-badge :variant="roleBadgeVariant" >
                  {{ roleValue }}
                </b-badge>
              </span>
            </b-list-group-item>

            <b-list-group-item>
              <strong>Status:</strong>
              <span class="float-right">
                <b-badge :variant="statusBadgeVariant">
                  {{ statusText }}
                </b-badge>
              </span>
            </b-list-group-item>
          </b-list-group>
        </b-card>


      </div>
    </b-container>
  </main>
</template>

<style scoped>
.profile-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.profile-card {
  border: none;
  border-radius: 0.5rem;
}

.profile-page > .list-group-item {
  border-left: none;
  border-right: none;
  padding: 0.75rem 0;
}

.profile-page b-list-group-item:first-child {
  border-top: none;
}

.profile-page b-list-group-item:last-child {
  border-bottom: none;
}

/* Badge styles */
.badge {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.9rem !important;
  font-weight: 600 !important;
}

.badge-success {
  background-color: #28a745 !important;
  color: white !important;
}

.badge-danger {
  background-color: #dc3545 !important;
  color: white !important;
}

.badge-warning {
  background-color: #ffc107 !important;
  color: #212529 !important;
}

.badge-info {
  background-color: #17a2b8 !important;
  color: white !important;
}

.badge-secondary {
  background-color: #6c757d !important;
  color: white !important;
}
</style>
