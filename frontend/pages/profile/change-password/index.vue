<script>
import { ADMIN_ROLE, USER_ROLE } from '~/const/role.const';
import { LocalStorageKeys } from "~/const/local-storage.const";
import { changePassword } from "../../../services/auth.service";
import BaseModal from "~/components/BaseModal.vue";

export default {
    name: 'ChangePasswordPage',
    layout: 'profile',
    middleware: 'auth',
    meta: {
        auth: true,
        roles: [ADMIN_ROLE, USER_ROLE]
    },
    components: { BaseModal },
    data() {
        return {
            title: "Change Password",
            username: "",
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            errorMessage: "",
            showModal: false,
        };
    },
    methods: {
        initUsername() {
            try {
                const raw = localStorage.getItem(LocalStorageKeys.USER_INFO);
                if (raw) {
                    const info = JSON.parse(raw);
                    this.username = info?.username || "";
                }
            } catch (err) {
                console.error("Failed to parse user info from localStorage", err);
            }
        },
        handleChangePassword() {
            if (!this.username) {
                this.errorMessage = "Username not found.";
                return;
            }
            if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
                this.errorMessage = "Please fill in all fields.";
                return;
            }
            if (this.newPassword.length < 6) {
                this.errorMessage = "New password must be at least 6 characters.";
                return;
            }
            if (this.newPassword !== this.confirmNewPassword) {
                this.errorMessage = "New passwords do not match.";
                return;
            }

            this.errorMessage = "";
            changePassword({
                username: this.username,
                oldPassword: this.currentPassword,
                newPassword: this.newPassword,
            })
                .then((response) => {
                    console.log("Password changed successfully:", response);
                    this.errorMessage = "";
                    this.showModal = true;
                })
                .catch((error) => {
                    console.error("Change password failed:", error);
                    this.errorMessage =
                        error.response?.data?.message ||
                        "Change password failed. Please try again.";
                });
        },
        closeModal() {
            this.showModal = false;
            this.$router.push("/");
        },
    },
    mounted() {
        this.initUsername();
    },
};
</script>
<template>
    <main>
        <b-container>
            <b-row class="justify-content-md-center">
                <b-col md="6">
                    <h2 class="mb-4 text-center">{{ title }}</h2>
                    <b-form @submit.prevent="handleChangePassword">
                        <b-form-group label="Current Password" label-for="current-password" class="mb-3">
                            <b-form-input
                                id="current-password"
                                type="password"
                                v-model="currentPassword"
                                required
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group label="New Password" label-for="new-password" class="mb-3">
                            <b-form-input
                                id="new-password"
                                type="password"
                                v-model="newPassword"
                                required
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group label="Confirm New Password" label-for="confirm-new-password" class="mb-3">
                            <b-form-input
                                id="confirm-new-password"
                                type="password"
                                v-model="confirmNewPassword"
                                required
                            ></b-form-input>
                        </b-form-group>

                        <b-button type="submit" variant="primary" class="w-100">Change Password</b-button>

                        <b-alert
                            v-if="errorMessage"
                            variant="danger"
                            show
                            class="mt-3"
                        >
                            {{ errorMessage }}
                        </b-alert>
                    </b-form>
                </b-col>
            </b-row>

            <BaseModal v-model:show="showModal" size="md" centered>
                <template #header>
                    <div class="modal-header">
                        <h5 class="modal-title">Success</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                </template>
                <div class="modal-body">
                    Password changed successfully.
                </div>
                <template #footer>
                    <div class="modal-footer">
                        <b-button variant="primary" @click="closeModal">OK</b-button>
                    </div>
                </template>
            </BaseModal>
        </b-container>
    </main>
</template>