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
                    Create your account
                </h2>
            </div>
            <div class="space-y-4">
                <GoogleSignInButton
                    @credential="handleGoogleSignup"
                    @error="handleGoogleError"
                />
                <div class="flex items-center gap-3" aria-hidden="true">
                    <span class="h-px flex-1 bg-gray-300"></span>
                    <span class="text-xs uppercase tracking-wider text-gray-500">or</span>
                    <span class="h-px flex-1 bg-gray-300"></span>
                </div>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="name" class="sr-only">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autocomplete="name"
                            required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Full Name"
                            v-model="name"
                        />
                    </div>
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
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
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
                            autocomplete="new-password"
                            required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Password"
                            v-model="password"
                        />
                    </div>
                    <div>
                        <label for="confirm-password" class="sr-only"
                            >Confirm Password</label
                        >
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autocomplete="new-password"
                            required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Confirm Password"
                            v-model="confirmPassword"
                        />
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
                            <!-- Heroicon name: solid/user-add -->
                            <svg
                                class="h-5 w-5 text-white group-hover:text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"
                                />
                            </svg>
                        </span>
                        Sign up
                    </button>
                </div>
            </form>
            <div class="text-center mt-4">
                <p class="text-sm">
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { registerUser } from "../services/api";
import { useSnackbarStore } from "../stores/snackbar";
import { useUserStore } from "../stores/user";
import GoogleSignInButton from "../components/GoogleSignInButton.vue";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const router = useRouter();
const snackbarStore = useSnackbarStore();
const userStore = useUserStore();

const handleGoogleSignup = async (credential) => {
    try {
        const result = await userStore.googleLogin(credential);
        snackbarStore.addSnackbar({
            message: result.isNewUser
                ? "Your account was created successfully."
                : "Welcome back!",
            type: "success",
        });
        router.push("/");
    } catch (error) {
        snackbarStore.addSnackbar({
            message: error.response?.data?.error || "Google signup failed.",
            type: "error",
        });
    }
};

const handleGoogleError = () => {
    snackbarStore.addSnackbar({
        message: "Google signup could not be loaded.",
        type: "error",
    });
};

const handleRegister = async () => {
    // Basic password match validation
    if (password.value !== confirmPassword.value) {
        snackbarStore.addSnackbar({
            message: "Passwords don't match!",
            type: "error"
        });
        return;
    }

    try {
        const response = await registerUser({
            name: name.value,
            email: email.value,
            password: password.value,
            userType: "MEMBER",
        });

        // Handle successful registration
        console.log("Registration successful:", response);
        snackbarStore.addSnackbar({
            message: "Registration successful! Please check your email to verify your account.",
            type: "success"
        });
        router.push("/login"); // Redirect to login page
    } catch (error) {
        // Handle registration error
        console.error("Registration error:", error);
        snackbarStore.addSnackbar({
            message: `Registration failed: ${error.message}`,
            type: "error"
        });
    } finally {
        // Reset the form
        name.value = "";
        email.value = "";
        password.value = "";
        confirmPassword.value = "";
    }
};
</script>
