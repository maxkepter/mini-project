<template>
    <nav class="sidebar bg-light border-right" 
    :style="{ width: sidebarCollapsed ? '70px' : '250px' }" 
    style="position: fixed; top: 0; left: 0; height: 100vh; transition: width 0.3s ease; 
    overflow-y: auto; z-index: 1000;">
        <div class="sidebar-header p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 v-show="!sidebarCollapsed" class="mb-0">Admin Panel</h5>
            <button class="btn btn-sm btn-outline-secondary" @click="toggleSidebar" style="padding: 0.25rem 0.5rem; flex-shrink: 0;">
                <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
            </button>
        </div>
        <ul class="nav flex-column p-3">
            <!-- Dashboard -->
            <li class="nav-item mb-2" v-for="sidebarItem in sidebarItems" :key="sidebarItem.route">
                <NuxtLink
                    :to="sidebarItem.route"
                    class="nav-link d-flex align-items-center"
                    :class="{ active: isActive(sidebarItem) }"
                    :title="sidebarCollapsed ? sidebarItem.name : ''"
                >
                    <i :class="`fas ${sidebarItem.icon} mr-2`"></i>
                    <span v-show="!sidebarCollapsed">{{ sidebarItem.name }}</span>
                </NuxtLink>
            </li>

        
        </ul>

        <!-- Profile Section -->
        <div class="sidebar-footer border-top p-3" style="position: absolute; bottom: 0; width: 100%; left: 0; max-height: 150px; overflow-y: auto;">
            <!-- Profile Items -->
            <NuxtLink
                v-for="item in profileItems"
                :key="item.route"
                :to="item.route"
                class="nav-link d-flex align-items-center text-dark mb-2"
                :class="{ active: isActive(item) }"
                :title="sidebarCollapsed ? item.name : ''"
            >
                <i :class="`fas ${item.icon} mr-2`"></i>
                <span v-show="!sidebarCollapsed">{{ item.name }}</span>
            </NuxtLink>
        </div>
    </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { ADMIN_SIDEBAR_ITEMS, ADMIN_PROFILE_ITEMS } from '~/const/sidebar-items';

export default {
    name: 'AdminSidebar',
    data() {
        return {
            sidebarItems: ADMIN_SIDEBAR_ITEMS,
            profileItems: ADMIN_PROFILE_ITEMS
        };
    },
    computed: {
        ...mapGetters('ui', ['sidebarCollapsed'])
    },
    methods: {
        ...mapActions('ui', ['toggleSidebar']),
        isActive(item) {
            // If item.exact is true, match exact path
            if (item.exact) {
                return this.$route.path === item.route;
            }
            // Otherwise, match prefix but ensure no more specific match exists
            return this.$route.path.startsWith(item.route) && 
                   !this.hasMoreSpecificMatch(item.route);
        },
        hasMoreSpecificMatch(currentRoute) {
            // Check if there's any other item with a longer matching route
            const allItems = [...this.sidebarItems, ...this.profileItems];
            return allItems.some(other => 
                other.route !== currentRoute &&
                other.route.length > currentRoute.length &&
                this.$route.path.startsWith(other.route)
            );
        }
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
}
</style>
