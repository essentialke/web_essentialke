<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Gift Vouchers</h1>
            <p class="mt-2 text-sm text-gray-600">
                Manage gift vouchers for customers
            </p>
        </div>

        <!-- Alert Messages -->
        <div
            v-if="alert.show"
            :class="[
                'p-4 mb-4 rounded-md',
                alert.type === 'success' ? 'bg-green-50' : 'bg-red-50',
            ]"
        >
            <p
                :class="
                    alert.type === 'success' ? 'text-green-800' : 'text-red-800'
                "
            >
                {{ alert.message }}
            </p>
        </div>

        <!-- Vouchers List -->
        <div class="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-lg font-medium text-gray-900">
                        Active Vouchers
                    </h2>
                    <button
                        @click="showCreateForm = true"
                        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Create New Voucher
                    </button>
                </div>

                <!-- Vouchers Table -->
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Code
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Amount
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Recipient
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Status
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Expiry Date
                                </th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="voucher in vouchers" :key="voucher.id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {{ voucher.code }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    KSh {{ voucher.amount.toFixed(2) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {{
                                        voucher.recipientEmail ||
                                        `User #${voucher.recipientUserId}`
                                    }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        :class="{
                                            'px-2 py-1 text-xs rounded-full': true,
                                            'bg-green-100 text-green-800':
                                                voucher.status === 'active',
                                            'bg-gray-100 text-gray-800':
                                                voucher.status === 'redeemed',
                                            'bg-red-100 text-red-800':
                                                voucher.status === 'expired',
                                        }"
                                    >
                                        {{ voucher.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {{
                                        new Date(
                                            voucher.expiryDate,
                                        ).toLocaleDateString()
                                    }}
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-right"
                                >
                                    <button
                                        v-if="voucher.status === 'active'"
                                        @click="cancelVoucher(voucher.id)"
                                        class="text-red-600 hover:text-red-900"
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div
            v-if="showCreateForm"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
        >
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">
                        Create New Gift Voucher
                    </h3>
                </div>
                <div class="p-6">
                    <GiftVoucherForm
                        :is-submitting="isSubmitting"
                        @submit="handleSubmit"
                        @cancel="showCreateForm = false"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import GiftVoucherForm from "@/components/admin/GiftVoucherForm.vue";

export default defineComponent({
    name: "AdminGiftVoucher",

    components: {
        GiftVoucherForm,
    },

    setup() {
        const vouchers = ref([]);
        const showCreateForm = ref(false);
        const isSubmitting = ref(false);
        const alert = ref({
            show: false,
            type: "success",
            message: "",
        });

        const showAlert = (type: "success" | "error", message: string) => {
            alert.value = { show: true, type, message };
            setTimeout(() => {
                alert.value.show = false;
            }, 5000);
        };

        const fetchVouchers = async () => {
            try {
                const { data } = await axios.get("/gift-vouchers");
                vouchers.value = data.data;
            } catch (error) {
                console.error("Error fetching vouchers:", error);
                showAlert("error", "Failed to fetch vouchers");
            }
        };

        const handleSubmit = async (formData: any) => {
            isSubmitting.value = true;
            try {
                await axios.post("/gift-vouchers", formData);
                await fetchVouchers();
                showAlert("success", "Gift voucher created successfully");
                showCreateForm.value = false;
            } catch (error) {
                console.error("Error creating voucher:", error);
                showAlert("error", "Failed to create gift voucher");
            } finally {
                isSubmitting.value = false;
            }
        };

        const cancelVoucher = async (id: number) => {
            if (!confirm("Are you sure you want to cancel this voucher?"))
                return;

            try {
                await axios.post(`/gift-vouchers/${id}/cancel`);
                await fetchVouchers();
                showAlert("success", "Voucher cancelled successfully");
            } catch (error) {
                console.error("Error cancelling voucher:", error);
                showAlert("error", "Failed to cancel voucher");
            }
        };

        onMounted(fetchVouchers);

        return {
            vouchers,
            showCreateForm,
            isSubmitting,
            alert,
            handleSubmit,
            cancelVoucher,
        };
    },
});
</script>
