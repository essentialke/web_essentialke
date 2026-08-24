<template>
    <div
        class="min-h-screen flex items-start justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
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
                    Sign in to your account
                </h2>
            </div>
            <div v-if="!isAdminLogin" class="space-y-4">
                <GoogleSignInButton
                    @credential="handleGoogleLogin"
                    @error="handleGoogleError"
                />
                <div class="flex items-center gap-3" aria-hidden="true">
                    <span class="h-px flex-1 bg-gray-300"></span>
                    <span class="text-xs uppercase tracking-wider text-gray-500">or</span>
                    <span class="h-px flex-1 bg-gray-300"></span>
                </div>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="email-address" class="sr-only"
                            >Email address</label
                        >
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            v-model="email"
                        />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Password"
                            v-model="password"
                        />
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            v-model="rememberMe"
                        />
                        <label
                            for="remember-me"
                            class="ml-2 block text-sm text-gray-900"
                        >
                            Remember me
                        </label>
                    </div>

                    <div class="text-sm">
                        <a
                            href="#"
                            class="font-medium text-primary hover:text-secondary"
                        >
                            Forgot your password?
                        </a>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <span
                            class="absolute left-0 inset-y-0 flex items-center pl-3"
                        >
                            <!-- Heroicon name: solid/lock-closed -->
                            <svg
                                class="h-5 w-5 text-white group-hover:text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M5 9 V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </span>
                        Sign in
                    </button>
                </div>
            </form>
            <div class="text-center mt-4">
                <p class="text-sm">
                    Don't have an account?
                    <RouterLink
                        to="/register"
                        class="font-medium text-primary hover:text-secondary"
                    >
                        Sign up
                    </RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useUserStore } from "../stores/user"; // Import the user store
import { useWishlistStore } from "../stores/wishlist";
import { useSnackbarStore } from "../stores/snackbar";
import GoogleSignInButton from "../components/GoogleSignInButton.vue";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const router = useRouter();
const userStore = useUserStore();
const wishlistStore = useWishlistStore();
const snackbarStore = useSnackbarStore();
const isAdminLogin = computed(() => {
    const redirectRoute = router.currentRoute.value.query.redirect;
    return typeof redirectRoute === "string" && redirectRoute.startsWith("/admin");
});

const finishLogin = () => {
    wishlistStore.fetchWishlistItems();
    const redirectRoute = router.currentRoute.value.query.redirect;
    router.push(redirectRoute || "/");
};

const handleGoogleLogin = async (credential) => {
    try {
        await userStore.googleLogin(credential);
        finishLogin();
    } catch (error) {
        snackbarStore.addSnackbar({
            message: error.response?.data?.error || "Google sign-in failed.",
            type: "error",
        });
    }
};

const handleGoogleError = () => {
    snackbarStore.addSnackbar({
        message: "Google sign-in could not be loaded.",
        type: "error",
    });
};

const handleLogin = async () => {
    try {
        const success = await userStore.login({
            email: email.value,
            password: password.value,
        });

        if (success) {
            // Handle successful login
            console.log("Login successful");
            finishLogin();
        }
    } catch (error) {
        // Handle login error
        console.error("Login error:", error);
        snackbarStore.addSnackbar({
            message: `Login failed: ${error.message}`,
            type: "error"
        });
    } finally {
        // Reset the form
        email.value = "";
        password.value = "";
        rememberMe.value = false;
    }
};
</script>
