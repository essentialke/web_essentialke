<template>
    <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">My Gift Vouchers</h2>

        <div v-if="isLoading" class="text-center">Loading...</div>
        <div v-else-if="giftVouchers.length === 0" class="text-center">
            <p>You have no gift vouchers.</p>
        </div>
        <div v-else>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Code
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Amount
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Status
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Expiry Date
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="voucher in giftVouchers" :key="voucher.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ voucher.code }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            KES {{ voucher.amount.toFixed(2) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ voucher.status }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ formatDate(voucher.expiryDate) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const giftVouchers = ref([]);
const isLoading = ref(false);

onMounted(async () => {
    await fetchGiftVouchers();
});

async function fetchGiftVouchers() {
    isLoading.value = true;
    try {
        const response = await axios.get("/gift-vouchers");
        giftVouchers.value = response.data.data.filter(
            (voucher) => voucher.status !== "cancelled",
        );
        console.log(giftVouchers.value);
    } catch (error) {
        console.error("Error fetching gift vouchers:", error);
    } finally {
        isLoading.value = false;
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}
</script>
