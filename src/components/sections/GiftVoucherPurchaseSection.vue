<template>
    <section class="bg-light py-10">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-8">
                Purchase a Gift Voucher
            </h2>

            <div class="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
                <form @submit.prevent="purchaseVoucher">
                    <div class="mb-4">
                        <label
                            for="amount"
                            class="block mb-2 font-medium text-gray-700"
                            >Amount (KES)</label
                        >
                        <input
                            type="number"
                            id="amount"
                            v-model.number="voucherForm.amount"
                            min="1"
                            required
                            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div class="mb-4">
                        <label
                            for="name"
                            class="block mb-2 font-medium text-gray-700"
                            >Full Name</label
                        >
                        <input
                            type="text"
                            id="name"
                            v-model="voucherForm.recipientName"
                            required
                            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div class="mb-4">
                        <label
                            for="recipientEmail"
                            class="block mb-2 font-medium text-gray-700"
                            >Recipient Email</label
                        >
                        <input
                            type="email"
                            id="recipientEmail"
                            v-model="voucherForm.recipientEmail"
                            required
                            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div class="mb-4">
                        <label
                            for="message"
                            class="block mb-2 font-medium text-gray-700"
                            >Message (Optional)</label
                        >
                        <textarea
                            id="message"
                            v-model="voucherForm.message"
                            rows="3"
                            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        :disabled="isSubmitting"
                        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {{
                            isSubmitting ? "Purchasing..." : "Purchase Voucher"
                        }}
                    </button>
                </form>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "../../stores/user";
import { useSnackbarStore } from "../../stores/snackbar";

const userStore = useUserStore();
const snackbarStore = useSnackbarStore();
const voucherForm = ref({
    amount: null,
    recipientName: "",
    recipientEmail: "",
    message: "",
});
const isSubmitting = ref(false);

const purchaseVoucher = async () => {
    if (!userStore.isAuthenticated) {
        snackbarStore.addSnackbar({
            message: "Please login to purchase a gift voucher.",
            type: "warning"
        });
        return;
    }

    isSubmitting.value = true;
    try {
        // Set expiry date to 1 year from today
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        const response = await axios.post("/gift-vouchers", {
            ...voucherForm.value,
            expiryDate: expiryDate.toISOString(),
        });
        console.log("Voucher purchased:", response.data);

        // Assuming a successful purchase, you might want to:
        // 1. Show a success message
        snackbarStore.addSnackbar({
            message: "Gift voucher purchased successfully!",
            type: "success",
        });
        // 2. Clear the form
        voucherForm.value = {
            amount: null,
            recipientEmail: "",
            message: "",
        };
        // 3. Potentially redirect to a confirmation page or the user's dashboard
    } catch (error) {
        console.error("Error purchasing voucher:", error);
        snackbarStore.addSnackbar({
            message:
                "Failed to purchase gift voucher. " +
                (error.response?.data?.error || "Please try again."),
            type: "error",
        });
    } finally {
        isSubmitting.value = false;
    }
};
</script>
