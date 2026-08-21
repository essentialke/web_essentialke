<template>
    <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">Settings</h2>

        <!-- Change Password Form -->
        <div class="mb-6">
            <h3 class="text-lg font-medium mb-2">Change Password</h3>
            <form @submit.prevent="changePassword" class="space-y-4">
                <div>
                    <label
                        for="current-password"
                        class="block text-sm font-medium text-gray-700"
                        >Current Password</label
                    >
                    <input
                        type="password"
                        id="current-password"
                        v-model="passwordForm.currentPassword"
                        required
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        for="new-password"
                        class="block text-sm font-medium text-gray-700"
                        >New Password</label
                    >
                    <input
                        type="password"
                        id="new-password"
                        v-model="passwordForm.newPassword"
                        required
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        for="confirm-password"
                        class="block text-sm font-medium text-gray-700"
                        >Confirm New Password</label
                    >
                    <input
                        type="password"
                        id="confirm-password"
                        v-model="passwordForm.confirmPassword"
                        required
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Change Password
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useSnackbarStore } from "../../stores/snackbar";

const passwordForm = ref({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
});

const notifications = ref({
    email: true,
    sms: false,
});

const snackbarStore = useSnackbarStore();

const changePassword = () => {
    // Implement password change logic here
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        snackbarStore.addSnackbar({
            message: "New passwords don't match!",
            type: "error"
        });
        return;
    }

    // Make API call to update password
    console.log("Changing password...", passwordForm.value);
    snackbarStore.addSnackbar({
        message: "Password changed successfully!",
        type: "success"
    });

    // Reset form
    passwordForm.value.currentPassword = "";
    passwordForm.value.newPassword = "";
    passwordForm.value.confirmPassword = "";
};
</script>
