<template>
    <div>
        <UserSidebar v-if="isLoggedIn" />
        <main class="p-4" :style="{ marginLeft: isLoggedIn ? (sidebarCollapsed ? '70px' : '250px') : '0', transition: 'margin-left 0.3s ease', backgroundColor: '#f8f9fa' }">
            <Nuxt />
        </main>
    </div>
</template>

<script>
import UserSidebar from '~/components/UserSidebar.vue';
import { mapGetters } from 'vuex';
import { logoutUser } from '~/services/auth.service';
import { LocalStorageKeys } from '~/const/local-storage.const';

export default {
    name: 'UserLayout',
    components: {
        UserSidebar
    },
    data() {
        return {
            isLoggedIn: false
        };
    },
    computed: {
        ...mapGetters('ui', ['sidebarCollapsed'])
    },
    methods: {
        logout() {
            logoutUser();
        },
        checkLoginStatus() {
            const userInfo = localStorage.getItem(LocalStorageKeys.USER_INFO);
            this.isLoggedIn = !!userInfo;
        }
    },
    mounted() {
        this.checkLoginStatus();
        window.addEventListener('storage', this.checkLoginStatus);
    },
    beforeDestroy() {
        window.removeEventListener('storage', this.checkLoginStatus);
    }
}
</script>

<style scoped>

main {
    min-height: calc(100vh - 56px);
    overflow-y: auto;
}
</style>
