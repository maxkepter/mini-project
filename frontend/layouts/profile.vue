<template>
    <div>
        <ProfileSidebar />
        <main class="p-4" :style="{ marginLeft: sidebarCollapsed ? '70px' : '250px', transition: 'margin-left 0.3s ease', backgroundColor: '#f8f9fa' }">
            <Nuxt />
        </main>
    </div>
</template>

<script>
import ProfileSidebar from '~/components/ProfileSidebar.vue';
import { mapGetters } from 'vuex';
import { ADMIN_ROLE, SUB_ADMIN_ROLE } from '~/const/role.const';

export default {
    name: 'ProfileLayout',
    components: {
        ProfileSidebar
    },
    data() {
        return {
            userRole: null,
            ADMIN_ROLE,
            SUB_ADMIN_ROLE
        };
    },
    computed: {
        ...mapGetters('ui', ['sidebarCollapsed'])
    },
    methods: {
        getUserRole() {
            try {
                const userInfo = localStorage.getItem('USER_INFO');
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

main {
    min-height: calc(100vh - 56px);
    overflow-y: auto;
}
</style>
