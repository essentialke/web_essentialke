<template>
    <main class="min-h-screen bg-gray-50 px-4 py-12">
        <section class="mx-auto max-w-md rounded-lg bg-white p-8 shadow-md">
            <img class="mx-auto h-16 w-auto" src="/essential-logo.png" alt="Essential logo" />
            <h1 class="mt-6 text-center text-2xl font-bold text-gray-900">
                Choose a new password
            </h1>
            <p class="mt-2 text-center text-sm text-gray-600">
                Your new password must contain at least 12 characters.
            </p>

            <form class="mt-6 space-y-5" @submit.prevent="setPassword">
                <div>
                    <label for="new-password" class="block text-sm font-medium text-gray-700">New password</label>
                    <input
                        id="new-password"
                        v-model="newPassword"
                        type="password"
                        autocomplete="new-password"
                        minlength="12"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                    />
                </div>
                <div>
                    <label for="confirm-new-password" class="block text-sm font-medium text-gray-700">Confirm new password</label>
                    <input
                        id="confirm-new-password"
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
                    class="w-full rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-secondary disabled:opacity-50"
                >
                    {{ saving ? "Saving…" : "Set new password" }}
                </button>
            </form>
        </section>
    </main>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useSnackbarStore } from "../stores/snackbar";

const newPassword = ref("");
const confirmPassword = ref("");
const saving = ref(false);
const route = useRoute();
const router = useRouter();
const snackbarStore = useSnackbarStore();

const notify = (message, type) => snackbarStore.addSnackbar({ message, type });

const setPassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
        notify("Passwords do not match.", "error");
        return;
    }

    saving.value = true;
    try {
        await axios.post("/users/set-new-password", {
            token: route.params.token,
            newPassword: newPassword.value,
        });
        notify("Password updated. You can now sign in.", "success");
        router.push("/login?redirect=/admin/dashboard");
    } catch (error) {
        notify(error.response?.data?.error || error.response?.data?.message || "Reset link is invalid or expired.", "error");
    } finally {
        saving.value = false;
    }
};
</script>
