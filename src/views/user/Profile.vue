<template>
    <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">My Profile</h2>
        <!-- Profile Form -->
        <form @submit.prevent="updateProfile" class="space-y-4">
            <!-- Name -->
            <div>
                <label
                    for="name"
                    class="block text-sm font-medium text-gray-700"
                    >Name</label
                >
                <input
                    type="text"
                    id="name"
                    v-model="user.name"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            </div>

            <!-- Email -->
            <div>
                <label
                    for="email"
                    class="block text-sm font-medium text-gray-700"
                    >Email</label
                >
                <input
                    type="email"
                    id="email"
                    v-model="user.email"
                    disabled
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-100"
                />
            </div>

            <!-- Phone (Optional) -->
            <div>
                <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700"
                    >Phone (Optional)</label
                >
                <input
                    type="tel"
                    id="phone"
                    v-model="user.phone"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            </div>

            <!-- Address (Optional) -->
            <div>
                <label
                    for="address"
                    class="block text-sm font-medium text-gray-700"
                    >Address (Optional)</label
                >
                <textarea
                    id="address"
                    v-model="user.address"
                    rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                ></textarea>
            </div>

            <!-- Update Button -->
            <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                Update Profile
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../../stores/user";
import axios from "axios";
import { useSnackbarStore } from "../../stores/snackbar";

const userStore = useUserStore();
const snackbarStore = useSnackbarStore();
const user = ref({
    name: "",
    email: "",
    phone: "",
    address: "",
});

onMounted(async () => {
    // Fetch user profile data
    if (userStore.isAuthenticated) {
        try {
            const response = await axios.get("/users/profile");
            user.value = response.data;
        } catch (error) {
            console.error("Error fetching profile:", error);
            // Handle error appropriately
        }
    }
});

const updateProfile = async () => {
    try {
        const response = await axios.put("/users/profile", user.value);
        // Update the user store with the updated data (if needed)
        userStore.user = { ...userStore.user, ...response.data.user };
        snackbarStore.addSnackbar({
            message: "Profile updated successfully!",
            type: "success"
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        snackbarStore.addSnackbar({
            message: "Failed to update profile. Please try again.",
            type: "error"
        });
    }
};
</script>
