<script>
import { activeUser, deactivateUser, getAllUser, updateUserRole } from '~/services/user.service';
import { ADMIN_ROLE, USER_ROLE } from '~/const/role.const';
import { getUserInfo } from '~/services/auth.service';

export default{
    name: "UserAdminPage",
    data(){
        return{
            title: "User Management",
            users: [],
            loading: false,
            errorMessage: "",
            fields:[
                {key: 'index', label: '#' },
                { key: 'userId', label: 'ID' },
                { key: 'username', label: 'Name' },
                { key: 'role', label: 'Role' },
                {key:'isActive', label: 'Status' },
                ,{ key: 'actions', label: 'Actions' }
            ]
        };
    },
    computed:{
        userId(){

            return getUserInfo()?.userId || null;
        }
    }
    ,
    methods:{
        fetchUsers(){
            this.loading = true;
            this.errorMessage = "";
            getAllUser().then((response)=>{
                console.log("Fetched users:", response);
                this.users = response;
            }).catch((error)=>{
                console.error("Error fetching users:", error);
                this.errorMessage = "Failed to load users.";
            }).finally(()=>{
                this.loading = false;
            });
        },
        getUserRole(role) {
            if (role === ADMIN_ROLE) {
                return "Admin";
            } else if (role === USER_ROLE) {
                return "User";
            }
            return "N/A";
        },
        getRoleBadgeVariant(role) {
            if (role === ADMIN_ROLE) {
                return 'danger';
            } else if (role === USER_ROLE) {
                return 'info';
            }
            return 'secondary';
        }, handleUpdateRole(user){
            const userId = user.userId;
            const newRole = user.role === ADMIN_ROLE ? USER_ROLE : ADMIN_ROLE;
            try {
                updateUserRole(userId, newRole).then((response)=>{
                    console.log("User role updated successfully:", response);
                    this.fetchUsers();
                }).catch((error)=>{
                    console.error("Error updating user role:", error);
                    this.errorMessage = error.message;
                });
            } catch (error) {
                this.errorMessage = "An unexpected error occurred.";
                console.error("Unexpected error:", error);
            }

        },handleDeactivateUser(userId) {
            deactivateUser(userId).then((response) => {
                console.log("User deactivated successfully:", response);
                this.fetchUsers();
            }).catch((error) => {
                console.error("Error deactivating user:", error);
                this.errorMessage = "Failed to deactivate user.";
            });
        },
        handleActiveUser(userId){
            activeUser(userId).then((response) => {
                console.log("User activated successfully:", response);
                this.fetchUsers();
            }).catch((error) => {
                console.error("Error activating user:", error);
                this.errorMessage = "Failed to activate user.";
            });
        },
        handleUpdateActiveUser(user) {
            if (user.isActive) {
                this.handleDeactivateUser(user.userId);
            } else {
                this.handleActiveUser(user.userId);
            }
        }
    },
    mounted(){
        this.fetchUsers();
    }   
}
</script>
<template>
    <main class="py-4">
        <b-container>
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i class="fas fa-users mr-2"></i>
                    {{ title }}
                </h2>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <b-spinner></b-spinner>
                <p class="mt-3">Loading users...</p>
            </div>

            <!-- Error Alert -->
            <b-alert v-if="errorMessage" variant="danger" show @dismissed="errorMessage = ''" class="mb-3">
                <i class="fas fa-exclamation-circle mr-2"></i>
                {{ errorMessage }}
            </b-alert>

            <!-- User Table -->
            <b-card v-if="!loading " class="shadow-sm">
                <b-table 
                    :items="users" 
                    :fields="fields" 
                    responsive="sm" 
                    striped 
                    hover 
                    class="mb-0">
                    <template #cell(index)="data">
                        <strong>{{ data.index + 1 }}</strong>
                    </template>
                    
                    <template #cell(userId)="data">
                        <span class="text-muted">{{ data.item.userId }}</span>
                    </template>
                    
                    <template #cell(username)="data">
                        <i class="fas fa-user mr-2 text-muted"></i>
                        <strong>{{ data.item.username }}</strong>
                    </template>
                    
                    <template #cell(role)="data">
                        <b-badge :variant="getRoleBadgeVariant(data.item.role)" class="px-3 py-2">
                            {{ getUserRole(data.item.role) }}
                        </b-badge>
                    </template>

                    <template #cell(isActive)="data">
                        <b-badge :variant="data.item.isActive ? 'success' : 'secondary'" class="px-3 py-2">
                            {{ data.item.isActive ? 'Active' : 'Inactive' }}
                        </b-badge>
                    </template>
                    
                    <template #cell(actions)="data">
                        <b-button 
                            size="sm" 
                            variant="primary" 
                            class="mr-2"
                            @click="handleUpdateRole(data.item)"
                            :disabled="data.item.userId === userId">
                            <i class="fas fa-edit mr-1"></i>
                            {{ getUserRole(data.item.role) === "Admin" ? 'Demote to User' : 'Promote to Admin' }}            
                        </b-button>
                        <b-button v-if="data.item.isActive" size="sm" variant="danger" :disabled="data.item.userId === userId" @click="handleUpdateActiveUser(data.item)">
                            <i class="fas fa-trash mr-1" ></i>Deactive
                        </b-button>
                        <b-button v-else size="sm" variant="success" :disabled="data.item.userId === userId" @click="handleUpdateActiveUser(data.item)">
                            <i ></i>Active
                        </b-button>
                    </template>
                </b-table>
            </b-card>
        </b-container>
    </main>
</template>

<style scoped>
/* Badge styles */
.badge {
    padding: 0.5rem 0.75rem !important;
    font-size: 0.9rem !important;
    font-weight: 600 !important;
}

.badge-danger {
    background-color: #dc3545 !important;
    color: white !important;
}

.badge-info {
    background-color: #17a2b8 !important;
    color: white !important;
}

.badge-secondary {
    background-color: #6c757d !important;
    color: white !important;
}
.badge-success {
    background-color: #28a745 !important;
    color: white !important;
}
</style>