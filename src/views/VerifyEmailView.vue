<template>
    <div
        class="min-h-screen flex items-center justify-center bg-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
    >
        <div class="max-w-md w-full space-y-8">
            <div v-if="loading">
                <p class="text-center text-lg text-gray-700">
                    Verifying your email...
                </p>
            </div>
            <div v-else-if="success">
                <h2
                    class="mt-6 text-center text-3xl font-extrabold text-gray-900"
                >
                    Email Verified!
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Thank you for verifying your email address. You can now
                    <RouterLink
                        to="/login"
                        class="font-medium text-primary hover:text-secondary"
                    >
                        log in
                    </RouterLink>
                    to your account.
                </p>
            </div>
            <div v-else>
                <h2
                    class="mt-6 text-center text-3xl font-extrabold text-gray-900"
                >
                    Verification Failed
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    {{ errorMessage }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const loading = ref(true);
const success = ref(false);
const errorMessage = ref("");
const route = useRoute();
const router = useRouter();

onMounted(async () => {
    const token = route.params.token;

    try {
        const response = await axios.get(`/users/verify-email/${token}`);
        success.value = true;
        console.log("Email verification successful:", response);
    } catch (error) {
        console.error("Email verification error:", error);
        errorMessage.value =
            error.response?.data?.message ||
            "An error occurred during verification.";
    } finally {
        loading.value = false;
    }
});
</script>
