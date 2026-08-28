<template>
    <main class="min-h-screen bg-white px-4 py-8 sm:py-12">
        <section class="mx-auto max-w-md rounded-lg bg-white p-5 sm:p-8 shadow-md">
            <img class="mx-auto h-16 w-auto" src="/essential-logo.png" alt="Essential logo" />
            <h1 class="mt-6 text-center text-2xl font-bold text-gray-900">
                Reset your password
            </h1>
            <p class="mt-2 text-center text-sm text-gray-600">
                Enter your account email and we’ll send a link valid for one hour.
            </p>

            <form class="mt-6 space-y-5" @submit.prevent="requestReset">
                <div>
                    <label for="reset-email" class="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <input
                        id="reset-email"
                        v-model.trim="email"
                        type="email"
                        autocomplete="email"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                    />
                </div>
                <button
                    type="submit"
                    :disabled="sending"
                    class="w-full rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-secondary disabled:opacity-50"
                >
                    {{ sending ? "Sending…" : "Send reset link" }}
                </button>
            </form>

            <RouterLink :to="loginTarget" class="mt-6 block text-center text-sm font-medium text-primary hover:text-secondary">
                Return to sign in
            </RouterLink>
        </section>
    </main>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import axios from "axios";
import { useSnackbarStore } from "../stores/snackbar";

const email = ref("");
const sending = ref(false);
const route = useRoute();
const snackbarStore = useSnackbarStore();
const loginTarget = computed(() => route.query.admin === "1"
    ? "/login?redirect=/admin/dashboard"
    : "/login");

const requestReset = async () => {
    sending.value = true;
    try {
        const response = await axios.post("/users/request-password-reset", { email: email.value });
        snackbarStore.addSnackbar({ message: response.data.message, type: "success" });
        email.value = "";
    } catch (error) {
        snackbarStore.addSnackbar({
            message: error.response?.data?.error || "Could not request a reset link.",
            type: "error",
        });
    } finally {
        sending.value = false;
    }
};
</script>
