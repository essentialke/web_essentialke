<template>
    <section class="rounded-lg bg-white p-6 shadow-md" aria-labelledby="change-password-heading">
        <h2 id="change-password-heading" class="text-lg font-semibold text-gray-900">
            Change admin password
        </h2>
        <p class="mt-1 text-sm text-gray-500">
            Confirm your current password before choosing a new one.
        </p>

        <form class="mt-5 max-w-xl space-y-4" @submit.prevent="changePassword">
            <div>
                <label for="current-password" class="block text-sm font-medium text-gray-700">
                    Current password
                </label>
                <input
                    id="current-password"
                    v-model="currentPassword"
                    type="password"
                    autocomplete="current-password"
                    required
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                />
            </div>
            <div>
                <label for="new-password" class="block text-sm font-medium text-gray-700">
                    New password
                </label>
                <input
                    id="new-password"
                    v-model="newPassword"
                    type="password"
                    autocomplete="new-password"
                    minlength="12"
                    required
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                />
                <p class="mt-1 text-xs text-gray-500">Use at least 12 characters.</p>
            </div>
            <div>
                <label for="confirm-password" class="block text-sm font-medium text-gray-700">
                    Confirm new password
                </label>
                <input
                    id="confirm-password"
                    v-model="confirmPassword"
                    type="password"
                    autocomplete="new-password"
                    minlength="12"
                    required
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                />
            </div>
            <button
                type="submit"
                :disabled="saving"
                class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
                {{ saving ? "Changing…" : "Change password" }}
            </button>
        </form>
    </section>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useSnackbarStore } from "../../stores/snackbar";

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const saving = ref(false);
const snackbarStore = useSnackbarStore();

const notify = (message, type) => snackbarStore.addSnackbar({ message, type });

const changePassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
        notify("New passwords do not match.", "error");
        return;
    }

    saving.value = true;
    try {
        await axios.post("/users/change-password", {
            currentPassword: currentPassword.value,
            newPassword: newPassword.value,
        });
        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
        notify("Admin password changed successfully.", "success");
    } catch (error) {
        notify(error.response?.data?.error || "Could not change password.", "error");
    } finally {
        saving.value = false;
    }
};
</script>
