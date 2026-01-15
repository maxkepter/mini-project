<template>
    <nav class="sidebar bg-light border-right" :style="{ width: sidebarCollapsed ? '70px' : '250px' }" style="position: fixed; top: 0; left: 0; height: 100vh; transition: width 0.3s ease; overflow-y: auto; z-index: 1000;">
        <div class="sidebar-header p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 v-show="!sidebarCollapsed" class="mb-0">Settings</h5>
            <button class="btn btn-sm btn-outline-secondary" @click="toggleSidebar" style="padding: 0.25rem 0.5rem; flex-shrink: 0;">
                <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
            </button>
        </div>
        <ul class="nav flex-column p-3">
            <!-- Profile Items -->
            <li class="nav-item mb-2" v-for="item in sidebarItems" :key="item.route">
                <NuxtLink
                    :to="item.route"
                    class="nav-link d-flex align-items-center"
                    :class="{ active: isActive(item) }"
                    :title="sidebarCollapsed ? item.name : ''"
                >
                    <i :class="`fas ${item.icon} mr-2`"></i>
                    <span v-show="!sidebarCollapsed">{{ item.name }}</span>
                </NuxtLink>
            </li>
        </ul>

        <!-- Navigation Section -->
        <div class="sidebar-footer border-top p-3" style="position: absolute; bottom: 0; width: 100%; left: 0;">
            <!-- Back to Home/Dashboard -->
            <NuxtLink
                :to="(userRole === ADMIN_ROLE || userRole === SUB_ADMIN_ROLE) ? '/admin' : '/'"
                class="nav-link d-flex align-items-center text-dark mb-2"
                :title="sidebarCollapsed ? ((userRole === ADMIN_ROLE || userRole === SUB_ADMIN_ROLE) ? 'Dashboard' : 'Home') : ''"
            >
                <i :class="(userRole === ADMIN_ROLE || userRole === SUB_ADMIN_ROLE) ? 'fas fa-chart-line' : 'fas fa-home'" class="mr-2"></i>
                <span v-show="!sidebarCollapsed">{{ (userRole === ADMIN_ROLE || userRole === SUB_ADMIN_ROLE) ? 'Dashboard' : 'Home' }}</span>
            </NuxtLink>

            <!-- Logout -->
            <button class="btn btn-outline-danger w-100" @click="logout" :title="sidebarCollapsed ? 'Logout' : ''">
                <i class="fas fa-sign-out-alt mr-2" v-show="!sidebarCollapsed"></i>
                <span v-show="!sidebarCollapsed">Logout</span>
                <i v-show="sidebarCollapsed" class="fas fa-sign-out-alt"></i>
            </button>
        </div>
    </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { ADMIN_ROLE, SUB_ADMIN_ROLE } from '~/const/role.const';
import { logoutUser } from '~/services/auth.service';
import { PROFILE_SIDEBAR_ITEMS } from '~/const/sidebar-items';
import { LocalStorageKeys } from '~/const/local-storage.const';

export default {
    name: 'ProfileSidebar',
    data() {
        return {
            userRole: null,
            ADMIN_ROLE,
            SUB_ADMIN_ROLE,
            sidebarItems: PROFILE_SIDEBAR_ITEMS
        };
    },
    computed: {
        ...mapGetters('ui', ['sidebarCollapsed'])
    },
    methods: {
        ...mapActions('ui', ['toggleSidebar']),
        isActive(item) {

            if (item.exact) {
                return this.$route.path === item.route;
            }
            return this.$route.path.startsWith(item.route) && 
                   !this.hasMoreSpecificMatch(item.route);
        },
        hasMoreSpecificMatch(currentRoute) {
            const allItems = [...this.sidebarItems];
            return allItems.some(other => 
                other.route !== currentRoute &&
                other.route.length > currentRoute.length &&
                this.$route.path.startsWith(other.route)
            );
        },
        logout() {
            logoutUser();
        },
        getUserRole() {
            try {
                const userInfo = localStorage.getItem(LocalStorageKeys.USER_INFO);
                if (userInfo) {
                    const info = JSON.parse(userInfo);
                    this.userRole = info.role;
                }
            } catch (err) {
                console.error('Failed to get user role:', err);
            }
        }
    },
    mounted() {
        this.getUserRole();
    }
}
</script>

<style scoped>
.sidebar {
    position: relative;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
    background-color: #f8f9fa;
}

.nav-link {
    color: #333;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.3s ease;
    padding: 10px 15px;
    margin-bottom: 5px;
    white-space: nowrap;
}

.nav-link:hover {
    background-color: #e9ecef;
    color: #0d6efd;
}

.nav-link.active {
    background-color: #0d6efd;
    color: white;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(13, 110, 253, 0.3);
}

.sidebar-footer {
    border-top: 1px solid #dee2e6;
}

i {
    width: 20px;
    flex-shrink: 0;
}

.btn {
    border-radius: 4px;
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}
</style>
