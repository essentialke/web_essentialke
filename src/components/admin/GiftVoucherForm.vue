<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 gap-6">
            <!-- Amount Field -->
            <div class="form-group">
                <label
                    for="amount"
                    class="block text-sm font-medium text-gray-700"
                >
                    Amount *
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                    <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                        <span class="text-gray-500 sm:text-sm">KSh</span>
                    </div>
                    <input
                        type="number"
                        id="amount"
                        v-model="formData.amount"
                        step="0.01"
                        min="0"
                        required
                        class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            </div>

            <!-- Recipient Type Selection -->
            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Recipient Type *
                </label>
                <div class="mt-2 space-x-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            v-model="recipientType"
                            value="email"
                            class="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span class="ml-2">Send by Email</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            v-model="recipientType"
                            value="user"
                            class="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span class="ml-2">Select User</span>
                    </label>
                </div>
            </div>

            <!-- Recipient Email Field -->
            <div v-if="recipientType === 'email'" class="form-group">
                <label
                    for="recipientEmail"
                    class="block text-sm font-medium text-gray-700"
                >
                    Recipient Email *
                </label>
                <input
                    type="email"
                    id="recipientEmail"
                    v-model="formData.recipientEmail"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
            </div>

            <!-- Recipient User Selection -->
            <div v-if="recipientType === 'user'" class="form-group">
                <label
                    for="recipientUserId"
                    class="block text-sm font-medium text-gray-700"
                >
                    Select Recipient *
                </label>
                <select
                    id="recipientUserId"
                    v-model="formData.recipientUserId"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">Select a user</option>
                    <option
                        v-for="user in users"
                        :key="user.id"
                        :value="user.id"
                    >
                        {{ user.name }} ({{ user.email }})
                    </option>
                </select>
            </div>

            <!-- Message Field -->
            <div class="form-group">
                <label
                    for="message"
                    class="block text-sm font-medium text-gray-700"
                >
                    Personal Message
                </label>
                <textarea
                    id="message"
                    v-model="formData.message"
                    rows="3"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                ></textarea>
            </div>

            <!-- Expiry Date Field -->
            <div class="form-group">
                <label
                    for="expiryDate"
                    class="block text-sm font-medium text-gray-700"
                >
                    Expiry Date *
                </label>
                <input
                    type="date"
                    id="expiryDate"
                    v-model="formData.expiryDate"
                    required
                    :min="minDate"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
            </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3">
            <button
                type="button"
                @click="$emit('cancel')"
                class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Cancel
            </button>
            <button
                type="submit"
                :disabled="isSubmitting"
                class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
                {{ isSubmitting ? "Saving..." : voucher ? "Update" : "Create" }}
            </button>
        </div>
    </form>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
    name: "GiftVoucherForm",

    props: {
        voucher: {
            type: Object,
            default: null,
        },
        isSubmitting: {
            type: Boolean,
            default: false,
        },
    },

    emits: ["submit", "cancel"],

    setup(props, { emit }) {
        const recipientType = ref("email");
        const users = ref([]);

        const formData = ref({
            amount: props.voucher?.amount || 0,
            recipientEmail: props.voucher?.recipientEmail || "",
            recipientUserId: props.voucher?.recipientUserId || "",
            message: props.voucher?.message || "",
            expiryDate: props.voucher?.expiryDate || "",
        });

        const minDate = computed(() => {
            const today = new Date();
            return today.toISOString().split("T")[0];
        });

        const fetchUsers = async () => {
            try {
                const { data } = await axios.get("/users");
                users.value = data.users;
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const handleSubmit = () => {
            const submitData = {
                ...formData.value,
                recipientEmail:
                    recipientType.value === "email"
                        ? formData.value.recipientEmail
                        : null,
                recipientUserId:
                    recipientType.value === "user"
                        ? formData.value.recipientUserId
                        : null,
            };
            emit("submit", submitData);
        };

        onMounted(() => {
            fetchUsers();
            if (props.voucher) {
                recipientType.value = props.voucher.recipientEmail
                    ? "email"
                    : "user";
            }
        });

        return {
            formData,
            recipientType,
            users,
            minDate,
            handleSubmit,
        };
    },
});
</script>
