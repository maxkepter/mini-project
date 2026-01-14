<template>
    <div>
        <AdminSidebar />
        <main class="p-4" :style="{ marginLeft: sidebarCollapsed ? '70px' : '250px', transition: 'margin-left 0.3s ease', backgroundColor: '#f8f9fa' }">
            <Nuxt />
        </main>
    </div>
</template>

<script>
import AdminSidebar from '~/components/AdminSidebar.vue';
import { mapGetters } from 'vuex';
import { logoutUser } from '~/services/auth.service';

export default {
    name: 'AdminLayout',
    components: {
        AdminSidebar
    },
    computed: {
        ...mapGetters('ui', ['sidebarCollapsed'])
    },
    methods: {
        logout() {
            logoutUser();
        }
    }
}
</script>

<style scoped>

main {
    min-height: calc(100vh - 56px);
    overflow-y: auto;
}
</style>
