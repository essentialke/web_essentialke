<template>
    <div
        class="min-h-screen flex items-start justify-center bg-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
    >
        <div class="max-w-md w-full space-y-8">
            <div>
                <img
                    class="mx-auto h-20 w-auto"
                    src="/essential-logo.png"
                    alt="Essential logo"
                />
                <h2
                    class="mt-6 text-center text-3xl font-extrabold text-gray-900"
                >
                    Complete Your Registration
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    You've been invited to join eLibrary. Set a password to
                    activate your account.
                </p>
            </div>

            <div v-if="loading" class="flex justify-center">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
                ></div>
            </div>

            <div v-else-if="error" class="rounded-md bg-red-50 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg
                            class="h-5 w-5 text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">Error</h3>
                        <div class="mt-2 text-sm text-red-700">
                            <p>{{ error }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="success" class="rounded-md bg-green-50 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg
                            class="h-5 w-5 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-green-800">
                            Success
                        </h3>
                        <div class="mt-2 text-sm text-green-700">
                            <p>
                                Your account has been activated! You can now log
                                in.
                            </p>
                        </div>
                        <div class="mt-4">
                            <button
                                @click="navigateToLogin"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <form
                v-else
                class="mt-8 space-y-6"
                @submit.prevent="acceptInvitation"
            >
                <div class="rounded-md shadow-sm -space-y-px">
                    <div class="mb-4">
                        <label
                            for="password"
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >New Password</label
                        >
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="new-password"
                            required
                            v-model="password"
                            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Enter a secure password"
                        />
                    </div>
                    <div>
                        <label
                            for="confirm-password"
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Confirm Password</label
                        >
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autocomplete="new-password"
                            required
                            v-model="confirmPassword"
                            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Confirm your password"
                        />
                    </div>
                </div>

                <div v-if="validationError" class="text-red-600 text-sm">
                    {{ validationError }}
                </div>

                <div>
                    <button
                        type="submit"
                        :disabled="isSubmitting"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span
                            v-if="isSubmitting"
                            class="absolute left-0 inset-y-0 flex items-center pl-3"
                        >
                            <svg
                                class="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        </span>
                        Activate Account
                    </button>
                </div>
            </form>

            <div class="text-center mt-4">
                <p class="text-sm text-gray-600">
                    Already have an account?
                    <RouterLink
                        to="/login"
                        class="font-medium text-primary hover:text-secondary"
                    >
                        Sign in
                    </RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const token = ref(route.params.token);

const password = ref("");
const confirmPassword = ref("");
const validationError = ref("");
const loading = ref(true);
const error = ref("");
const success = ref(false);
const isSubmitting = ref(false);
const userData = ref(null);

onMounted(async () => {
    // Verify token validity
    try {
        const response = await axios.get(
            `/users/verify-invitation/${token.value}`,
        );
        userData.value = response.data.user;
        loading.value = false;
    } catch (err) {
        loading.value = false;
        error.value =
            err.response?.data?.error ||
            "Invalid or expired invitation link. Please contact an administrator.";
    }
});

const acceptInvitation = async () => {
    // Validate passwords
    if (password.value.length < 8) {
        validationError.value = "Password must be at least 8 characters long";
        return;
    }

    if (password.value !== confirmPassword.value) {
        validationError.value = "Passwords do not match";
        return;
    }

    validationError.value = "";
    isSubmitting.value = true;

    try {
        // Accept invitation and set password
        await axios.post("/users/accept-invitation", {
            token: token.value,
            password: password.value,
        });

        success.value = true;
    } catch (err) {
        error.value =
            err.response?.data?.error ||
            "An error occurred while activating your account. Please try again.";
    } finally {
        isSubmitting.value = false;
    }
};

const navigateToLogin = () => {
    router.push("/login");
};
</script>
