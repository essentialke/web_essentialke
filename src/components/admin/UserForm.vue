<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
            <label for="name" class="block text-sm font-medium text-gray-700"
                >Name</label
            >
            <input
                type="text"
                id="name"
                v-model="formData.name"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="errors.name" class="text-red-500 text-xs">{{
                errors.name
            }}</span>
        </div>

        <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
                >Email</label
            >
            <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="errors.email" class="text-red-500 text-xs">{{
                errors.email
            }}</span>
        </div>

        <div>
            <label
                for="userType"
                class="block text-sm font-medium text-gray-700"
                >Role</label
            >
            <select
                id="userType"
                v-model="formData.userType"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
                <option value="ADMIN">Admin</option>
                <option value="MEMBER">Member</option>
                <option value="CHILD">Child</option>
            </select>
            <span v-if="errors.userType" class="text-red-500 text-xs">{{
                errors.userType
            }}</span>
        </div>

        <div>
            <label
                for="password"
                class="block text-sm font-medium text-gray-700"
                >Password</label
            >
            <input
                type="password"
                id="password"
                v-model="formData.password"
                :required="!isEditing"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="isEditing" class="text-xs text-gray-500"
                >Leave blank to keep the current password</span
            >
            <span v-if="errors.password" class="text-red-500 text-xs">{{
                errors.password
            }}</span>
        </div>

        <div class="flex justify-end space-x-4">
            <button
                type="button"
                @click="onCancel"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            >
                Cancel
            </button>
            <button
                type="submit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
                Save
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
    user: Object, // User object being edited (if any)
});

const emit = defineEmits(["save", "cancel"]);

const isEditing = ref(false);
const formData = ref({
    name: "",
    email: "",
    userType: "MEMBER",
    password: "",
});

const errors = ref({});

onMounted(() => {
    // Initialize the form data when the component is mounted
    if (props.user) {
        isEditing.value = true;
        formData.value = { ...props.user };
    }
});

watch(
    () => props.user,
    (newUser) => {
        if (newUser) {
            isEditing.value = true;
            formData.value = { ...newUser };
        } else {
            isEditing.value = false;
            formData.value = {
                name: "",
                email: "",
                userType: "MEMBER",
                password: "",
            };
        }
        errors.value = {};
    },
);

const validateForm = () => {
    errors.value = {};
    let isValid = true;

    if (!formData.value.name) {
        errors.value.name = "Name is required.";
        isValid = false;
    }

    if (!formData.value.email) {
        errors.value.email = "Email is required.";
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
        errors.value.email = "Email is invalid.";
        isValid = false;
    }

    if (!formData.value.userType) {
        errors.value.userType = "Role is required.";
        isValid = false;
    }

    if (!isEditing.value && !formData.value.password) {
        errors.value.password = "Password is required.";
        isValid = false;
    }

    return isValid;
};

const onSubmit = () => {
    if (validateForm()) {
        emit("save", formData.value);
    }
};

const onCancel = () => {
    errors.value = {};
    emit("cancel");
};
</script>
