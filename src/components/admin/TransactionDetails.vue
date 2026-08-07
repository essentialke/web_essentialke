<template>
    <div v-if="transaction" class="p-4">
        <!-- Basic Transaction Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <h4 class="font-semibold text-lg mb-4">
                    Transaction Information
                </h4>
                <p class="mb-2">
                    <strong class="font-semibold">Transaction ID:</strong>
                    {{ transaction.id }}
                </p>
                <p class="mb-2">
                    <strong class="font-semibold">Type:</strong>
                    {{ capitalizeFirst(transaction.type) }}
                </p>
                <p class="mb-2">
                    <strong class="font-semibold">Status:</strong>
                    <span :class="getStatusColorClass(transaction.status)">
                        {{ capitalizeFirst(transaction.status) }}
                    </span>
                </p>
                <p class="mb-2">
                    <strong class="font-semibold">Date:</strong>
                    {{ formatDate(transaction.transactionDate) }}
                </p>
            </div>

            <div>
                <h4 class="font-semibold text-lg mb-4">User Information</h4>
                <p class="mb-2">
                    <strong class="font-semibold">Member:</strong>
                    {{ transaction.member?.name }}
                </p>
                <p class="mb-2">
                    <strong class="font-semibold">Member Email:</strong>
                    {{ transaction.member?.email }}
                </p>
                <p v-if="transaction.admin" class="mb-2">
                    <strong class="font-semibold">Processed By:</strong>
                    {{ transaction.admin.name }}
                </p>
            </div>
        </div>

        <!-- Purchase-specific Information -->
        <div v-if="transaction.type === 'purchase'" class="mb-6">
            <h4 class="font-semibold text-lg mb-4">Purchase Details</h4>
            <p class="mb-2">
                <strong class="font-semibold">Amount:</strong> KES
                {{ transaction.amount?.toFixed(2) }}
            </p>
            <p v-if="transaction.paymentReference" class="mb-2">
                <strong class="font-semibold">Payment Reference:</strong>
                {{ transaction.paymentReference }}
            </p>
            <p class="mb-2">
                <strong class="font-semibold">Payment Status:</strong>
                {{ capitalizeFirst(transaction.paymentStatus) }}
            </p>

            <!-- Shipping Information -->
            <div
                v-if="transaction.shippingAddress || transaction.shippingMethod"
                class="mt-4"
            >
                <h5 class="font-semibold mb-2">Shipping Information</h5>
                <p v-if="transaction.shippingAddress" class="mb-2">
                    <strong class="font-semibold">Shipping Address:</strong>
                    {{ transaction.shippingAddress }}
                </p>
                <p v-if="transaction.shippingMethod" class="mb-2">
                    <strong class="font-semibold">Shipping Method:</strong>
                    {{ transaction.shippingMethod }}
                </p>
                <p v-if="transaction.billingAddress" class="mb-2">
                    <strong class="font-semibold">Billing Address:</strong>
                    {{ transaction.billingAddress }}
                </p>
            </div>
        </div>
        <!-- Order Items -->
        <div v-if="transaction.orderItems?.length" class="mb-6">
            <h4 class="font-semibold text-lg mb-4">Order Items</h4>
            <div class="bg-gray-50 rounded-lg p-4">
                <div
                    v-for="item in transaction.orderItems"
                    :key="item.id"
                    class="border-b last:border-b-0 py-2"
                >
                    <p class="font-medium">{{ item.product.title }}</p>
                    <div class="text-sm text-gray-600">
                        <span>Quantity: {{ item.quantity }}</span>
                        <span v-if="item.price" class="ml-4">
                            Price: KES {{ item.price.toFixed(2) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Notes -->
        <div v-if="transaction.notes" class="mb-6">
            <h4 class="font-semibold text-lg mb-4">Notes</h4>
            <p class="whitespace-pre-wrap">{{ transaction.notes }}</p>
        </div>

        <!-- Status Update -->
        <div class="mt-6 border-t pt-4">
            <h4 class="font-semibold text-lg mb-4">Update Status</h4>
            <div class="flex items-center">
                <select
                    v-model="transactionStatus"
                    class="mt-1 block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm mr-2"
                >
                    <option
                        v-for="status in availableStatuses"
                        :key="status"
                        :value="status"
                    >
                        {{ capitalizeFirst(status) }}
                    </option>
                </select>
                <button
                    @click="updateStatus"
                    :disabled="isUpdating"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest bg-primary hover:bg-primary-dark active:bg-primary-darker focus:outline-none focus:ring focus:ring-primary-light disabled:opacity-25 transition"
                >
                    {{ isUpdating ? "Updating..." : "Save" }}
                </button>
            </div>
            <div v-if="updateError" class="text-red-600 text-sm mt-1">
                {{ updateError }}
            </div>
            <div v-if="updateMessage" class="text-green-600 text-sm mt-1">
                {{ updateMessage }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";

const props = defineProps({
    transaction: {
        type: Object,
        required: true,
    },
});

const transactionStatus = ref(props.transaction.status);
const isUpdating = ref(false);
const updateError = ref(null);
const updateMessage = ref(null);

const availableStatuses = computed(() => {
    switch (props.transaction.type) {
        case "purchase":
            return [
                "pending",
                "processing",
                "completed",
                "failed",
                "cancelled",
                "refunded",
            ];
        default:
            return ["pending", "completed", "cancelled"];
    }
});

function formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function capitalizeFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

function getStatusColorClass(status) {
    const statusClasses = {
        pending: "text-yellow-600",
        processing: "text-blue-600",
        completed: "text-green-600",
        failed: "text-red-600",
        cancelled: "text-gray-600",
        refunded: "text-purple-600",
        active: "text-blue-600",
        returned: "text-green-600",
    };
    return statusClasses[status] || "text-gray-600";
}

const updateStatus = async () => {
    isUpdating.value = true;
    updateError.value = null;
    updateMessage.value = null;

    try {
        const response = await axios.put(
            `/transactions/${props.transaction.id}`,
            {
                status: transactionStatus.value,
            },
        );
        if (response.status === 200) {
            updateMessage.value = "Status updated successfully";
        }
    } catch (error) {
        console.error("Error updating status:", error);
        updateError.value =
            error.response?.data?.error || "Error updating status";
    } finally {
        isUpdating.value = false;
    }
};
</script>
