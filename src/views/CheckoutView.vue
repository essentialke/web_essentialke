<template>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">Checkout</h1>

        <div v-if="!showPaymentStatus">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Order Summary -->
                <div class="bg-white shadow rounded-lg p-6">
                    <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
                    <div v-if="cartStore.cartItems.length === 0">
                        <p class="text-gray-600">Your cart is empty.</p>
                    </div>
                    <div v-else>
                        <ul class="space-y-4">
                            <li
                                v-for="item in cartStore.cartItems"
                                :key="item.id"
                                class="flex items-center justify-between"
                            >
                                <div>
                                    <h4 class="font-medium">
                                        {{ item.product.title }}
                                    </h4>
                                    <p class="text-gray-600 text-sm">
                                        Qty: {{ item.quantity }} x KES
                                        {{ item.product.price.toFixed(2) }}
                                    </p>
                                </div>
                                <span class="font-semibold">
                                    KES
                                    {{
                                        (
                                            item.quantity * item.product.price
                                        ).toFixed(2)
                                    }}
                                </span>
                            </li>
                        </ul>
                        <hr class="my-4" />
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-600">Subtotal</span>
                            <span class="font-semibold">
                                KES {{ cartStore.subtotal.toFixed(2) }}
                            </span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-600">Tax (VAT)</span>
                            <span class="font-semibold">
                                KES {{ cartStore.tax.toFixed(2) }}
                            </span>
                        </div>

                        <div
                            class="flex justify-between mb-2"
                            v-if="appliedDiscount"
                        >
                            <span class="text-gray-600">Discount Applied</span>
                            <span class="font-semibold text-green-600">
                                -KES {{ appliedDiscount.toFixed(2) }}
                            </span>
                        </div>

                        <div
                            class="flex justify-between mb-2"
                            v-if="appliedGiftVoucherAmount"
                        >
                            <span class="text-gray-600"
                                >Gift Voucher Applied</span
                            >
                            <span class="font-semibold text-green-600">
                                -KES {{ appliedGiftVoucherAmount.toFixed(2) }}
                            </span>
                        </div>

                        <hr class="my-2" />
                        <div class="flex justify-between mb-2">
                            <span class="text-lg font-semibold"
                                >Final Total</span
                            >
                            <span class="text-lg font-semibold">
                                KES
                                {{
                                    (
                                        finalTotal - appliedGiftVoucherAmount
                                    ).toFixed(2)
                                }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Shipping and Billing Details -->
                <div class="bg-white shadow rounded-lg p-6">
                    <h2 class="text-xl font-semibold mb-4">Shipping Details</h2>
                    <form @submit.prevent="placeOrder" class="space-y-6">
                        <!-- Shipping Address Form -->
                        <div>
                            <label
                                for="shippingName"
                                class="block text-sm font-medium text-gray-700"
                                >Full Name</label
                            >
                            <input
                                type="text"
                                id="shippingName"
                                v-model="shippingDetails.name"
                                required
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label
                                for="shippingAddress"
                                class="block text-sm font-medium text-gray-700"
                                >Address</label
                            >
                            <input
                                type="text"
                                id="shippingAddress"
                                v-model="shippingDetails.address"
                                required
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label
                                for="shippingCity"
                                class="block text-sm font-medium text-gray-700"
                                >City</label
                            >
                            <input
                                type="text"
                                id="shippingCity"
                                v-model="shippingDetails.city"
                                required
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label
                                for="shippingZip"
                                class="block text-sm font-medium text-gray-700"
                                >ZIP Code</label
                            >
                            <input
                                type="text"
                                id="shippingZip"
                                v-model="shippingDetails.zip"
                                required
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label
                                for="shippingCountry"
                                class="block text-sm font-medium text-gray-700"
                                >Country</label
                            >
                            <select
                                id="shippingCountry"
                                v-model="shippingDetails.country"
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="Kenya">Kenya</option>
                            </select>
                        </div>

                        <div>
                            <label
                                for="phoneNumber"
                                class="block text-sm font-medium text-gray-700"
                                >Phone Number</label
                            >
                            <input
                                type="tel"
                                id="phoneNumber"
                                v-model="shippingDetails.phoneNumber"
                                required
                                placeholder="e.g. 07XXXXXXXXX or 01XXXXXXXXX "
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                :class="{
                                    'border-red-500':
                                        !isPhoneNumberValid &&
                                        shippingDetails.phoneNumber,
                                }"
                            />
                            <p
                                v-if="
                                    !isPhoneNumberValid &&
                                    shippingDetails.phoneNumber
                                "
                                class="mt-1 text-sm text-red-600"
                            >
                                Phone number must be 10 digits and start with 0
                            </p>
                            <p class="mt-1 text-sm text-gray-500">
                                Enter your M-Pesa phone number to receive
                                payment prompt
                            </p>
                        </div>

                        <!-- Discount Code -->
                        <!--
                        <div>
                            <label
                                for="discountCode"
                                class="block text-sm font-medium text-gray-700"
                                >Discount Code</label
                            >
                            <div class="mt-1 flex rounded-md shadow-sm">
                                <input
                                    type="text"
                                    id="discountCode"
                                    v-model="discountCode"
                                    class="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300"
                                    placeholder="Enter discount code"
                                />
                                <button
                                    @click.prevent="applyDiscountCode"
                                    :disabled="isApplyingDiscount"
                                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md font-semibold text-xs text-white uppercase tracking-widest bg-gray-800 hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition"
                                >
                                    Apply
                                </button>
                            </div>
                            <div
                                v-if="discountError"
                                class="text-red-600 text-sm mt-1"
                            >
                                {{ discountError }}
                            </div>
                            <div
                                v-if="discountMessage"
                                class="text-green-600 text-sm mt-1"
                            >
                                {{ discountMessage }}
                            </div>
                        </div> -->

                        <!-- Gift Voucher Code -->
                        <!-- <div>
                            <label
                                for="giftVoucherCode"
                                class="block text-sm font-medium text-gray-700"
                                >Gift Voucher Code</label
                            >
                            <div class="mt-1 flex rounded-md shadow-sm">
                                <input
                                    type="text"
                                    id="giftVoucherCode"
                                    v-model="giftVoucherCode"
                                    class="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300"
                                    placeholder="Enter gift voucher code"
                                />
                                <button
                                    @click.prevent="redeemGiftVoucher"
                                    :disabled="isRedeemingGiftVoucher"
                                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md font-semibold text-xs text-white uppercase tracking-widest bg-gray-800 hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition"
                                >
                                    Redeem
                                </button>
                            </div>
                            <div
                                v-if="giftVoucherError"
                                class="text-red-600 text-sm mt-1"
                            >
                                {{ giftVoucherError }}
                            </div>
                            <div
                                v-if="giftVoucherMessage"
                                class="text-green-600 text-sm mt-1"
                            >
                                {{ giftVoucherMessage }}
                            </div>
                        </div> -->

                        <!-- Place Order Button -->
                        <button
                            type="submit"
                            :disabled="
                                isPlacingOrder ||
                                cartStore.cartItems.length === 0
                            "
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {{
                                isPlacingOrder
                                    ? "Placing Order..."
                                    : "Place Order"
                            }}
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Payment Status Section -->
        <div v-else class="mt-8 max-w-2xl mx-auto">
            <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">
                    Complete Your Payment
                </h2>

                <!-- Status Steps -->
                <div class="mb-6">
                    <div class="flex items-center mb-2">
                        <div
                            class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mr-3"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                        <span class="text-gray-700"
                            >Order created successfully</span
                        >
                    </div>

                    <div class="flex items-center mb-2">
                        <div
                            class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                            :class="{
                                'bg-green-500 text-white': paymentInfo,
                                'bg-gray-200 text-gray-500': !paymentInfo,
                            }"
                        >
                            <span v-if="!paymentInfo">2</span>
                            <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                        <span class="text-gray-700">Payment initialized</span>
                    </div>

                    <div class="flex items-center">
                        <div
                            class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                            :class="{
                                'bg-green-500 text-white':
                                    paymentStatus === 'COMPLETED',
                                'bg-gray-200 text-gray-500':
                                    paymentStatus !== 'COMPLETED',
                            }"
                        >
                            <span v-if="paymentStatus !== 'COMPLETED'">3</span>
                            <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                        <span class="text-gray-700">Payment completed</span>
                    </div>
                </div>

                <!-- Loading Indicator -->
                <div
                    v-if="isCheckingStatus && !paymentInfo"
                    class="flex justify-center my-6"
                >
                    <div
                        class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700"
                    ></div>
                </div>

                <!-- Payment Info -->
                <div v-if="paymentInfo" class="mb-8">
                    <div
                        class="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200"
                    >
                        <h3 class="font-medium text-gray-800 mb-2">
                            Payment Instructions
                        </h3>
                        <p class="text-gray-700 whitespace-pre-line">
                            {{ paymentInfo.CustomerMessage }}
                        </p>
                    </div>

                    <!-- QR Code Section -->
                    <div v-if="qrCodeUrl" class="mb-6 text-center">
                        <h3 class="font-medium text-gray-800 mb-2">
                            Scan QR Code to Pay
                        </h3>
                        <img
                            :src="qrCodeUrl"
                            alt="Payment QR Code"
                            class="mx-auto h-48 w-48 object-contain"
                        />
                        <p class="text-sm text-gray-600 mt-2">
                            Use your M-PESA app to scan this QR code
                        </p>
                    </div>

                    <!-- Payment Status Badge -->
                    <div class="flex items-center justify-center mb-4">
                        <span
                            class="px-3 py-1 rounded-full text-sm font-medium"
                            :class="{
                                'bg-yellow-100 text-yellow-800':
                                    paymentStatus === 'PENDING',
                                'bg-green-100 text-green-800':
                                    paymentStatus === 'COMPLETED',
                                'bg-red-100 text-red-800':
                                    paymentStatus === 'FAILED',
                            }"
                        >
                            {{ paymentStatus }}
                        </span>
                    </div>

                    <!-- Status Message -->
                    <p class="text-center text-gray-700 mb-4">
                        {{ statusMessage }}
                    </p>
                </div>

                <!-- Error Message -->
                <div
                    v-if="paymentError"
                    class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
                >
                    <p class="font-medium">Error</p>
                    <p>{{ paymentError }}</p>
                </div>

                <!-- Actions -->
                <div class="flex justify-between">
                    <button
                        @click="cancelPayment"
                        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>

                    <button
                        v-if="paymentStatus === 'COMPLETED'"
                        @click="goToOrders"
                        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        View Order Details
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useCartStore } from "../stores/cart";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";
import axios from "axios";
import { useSnackbarStore } from "../stores/snackbar";
import QRCode from "qrcode";

const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();
const snackbarStore = useSnackbarStore();

// Form data and state
const shippingDetails = ref({
    name: "",
    address: "",
    city: "",
    zip: "",
    country: "Kenya",
    phoneNumber: "",
});

const discountCode = ref("");
const giftVoucherCode = ref("");
const isApplyingDiscount = ref(false);
const isRedeemingGiftVoucher = ref(false);
const isPlacingOrder = ref(false);
const discountError = ref("");
const discountMessage = ref("");
const giftVoucherError = ref("");
const giftVoucherMessage = ref("");
const appliedDiscount = ref(0);
const appliedGiftVoucherAmount = ref(0);

// Payment status tracking
const showPaymentStatus = ref(false);
const paymentInfo = ref(null);
const qrCodeUrl = ref("");
const paymentStatus = ref("PENDING");
const statusMessage = ref("Waiting for payment...");
const paymentError = ref("");
const transactionId = ref(null);
const isCheckingStatus = ref(false);
let statusCheckInterval = null;

// Computed property for final total
const finalTotal = computed(() => {
    return cartStore.total - appliedDiscount.value + cartStore.tax;
});

// Lifecycle hooks
onMounted(() => {
    if (!userStore.isAuthenticated) {
        router.push("/login");
        return;
    }
    cartStore.fetchCartItems();
});

// Methods
const applyDiscountCode = async () => {
    isApplyingDiscount.value = true;
    discountError.value = "";
    discountMessage.value = "";
    appliedDiscount.value = 0;

    try {
        const response = await axios.post("/api/discounts/verify", {
            discountCode: discountCode.value,
        });

        if (response.data && response.data.appliedDiscount > 0) {
            appliedDiscount.value = response.data.appliedDiscount;
            discountMessage.value = "Discount applied successfully!";
        } else {
            discountError.value = "Invalid discount code.";
        }
    } catch (error) {
        console.error("Error applying discount code:", error);
        discountError.value =
            error.response?.data?.error || "Error applying discount code.";
    } finally {
        isApplyingDiscount.value = false;
    }
};

const redeemGiftVoucher = async () => {
    isRedeemingGiftVoucher.value = true;
    giftVoucherError.value = "";
    giftVoucherMessage.value = "";

    try {
        const response = await axios.get(
            `/api/gift-vouchers/${giftVoucherCode.value}`,
        );

        if (response.data.success) {
            const voucher = response.data.data;

            if (voucher.status !== "active") {
                giftVoucherError.value =
                    "This voucher has already been used or is invalid.";
                return;
            }

            appliedGiftVoucherAmount.value = voucher.amount;
            giftVoucherMessage.value = `Gift voucher worth KES ${voucher.amount.toFixed(
                2,
            )} applied successfully!`;
        }
    } catch (error) {
        console.error("Error redeeming gift voucher:", error);
        giftVoucherError.value =
            error.response?.data?.error || "Invalid gift voucher code.";
    } finally {
        isRedeemingGiftVoucher.value = false;
    }
};

const placeOrder = async () => {
    if (cartStore.cartItems.length === 0) {
        snackbarStore.addSnackbar({
            message: "Your cart is empty!",
            type: "warning",
        });
        return;
    }

    isPlacingOrder.value = true;

    try {
        if (cartStore.cartItems.length === 0) {
            snackbarStore.addSnackbar({
                message: "Your cart is empty!",
                type: "warning",
            });
            return;
        }

        if (!isPhoneNumberValid.value) {
            snackbarStore.addSnackbar({
                message:
                    "Please enter a valid phone number (10 digits starting with 0)",
                type: "error",
            });
            return;
        }

        const phoneNumber = shippingDetails.value.phoneNumber.startsWith("0")
            ? `254${shippingDetails.value.phoneNumber.substring(1)}`
            : shippingDetails.value.phoneNumber;

        const orderData = {
            shippingAddress: `${shippingDetails.value.address}, ${shippingDetails.value.city}, ${shippingDetails.value.zip}, ${shippingDetails.value.country}`,
            billingAddress: shippingDetails.value.address,
            shippingMethod: "Standard",
            discountCode: discountCode.value || null,
            giftVoucherCode: giftVoucherCode.value || null,
            notes: "",
            phoneNumber,
        };

        const response = await axios.post("/transactions", orderData);

        if (response.data && response.data.transaction) {
            // Store transaction ID for status checks
            transactionId.value = response.data.transaction.id;

            // Show payment status section
            showPaymentStatus.value = true;

            // Store payment info
            paymentInfo.value = response.data.sasaPayOrder;

            // Start status polling
            startStatusPolling(transactionId.value);

            // Generate QR code if possible
            await generateQRCode(response.data.sasaPayOrder);

            // Reset form values
            appliedDiscount.value = 0;
            appliedGiftVoucherAmount.value = 0;
            discountCode.value = "";
            giftVoucherCode.value = "";

            // Clear cart
            cartStore.clearCart();
        }
    } catch (error) {
        console.error("Error placing order:", error);
        snackbarStore.addSnackbar({
            message:
                error.response?.data?.error ||
                "Failed to place order. Please try again.",
            type: "error",
        });
    } finally {
        isPlacingOrder.value = false;
    }
};

const generateQRCode = async (paymentData) => {
    if (!paymentData || !paymentData.CustomerMessage) return;

    try {
        // Extract payment details from the CustomerMessage
        const businessNumberMatch = paymentData.CustomerMessage.match(
            /BUSINESS NUMBER:\s*(\d+)/,
        );
        const accountNumberMatch = paymentData.CustomerMessage.match(
            /ACCOUNT NUMBER:\s*(\w+)/,
        );
        const amountMatch =
            paymentData.CustomerMessage.match(/AMOUNT:\s*(\d+)/);

        if (businessNumberMatch && accountNumberMatch && amountMatch) {
            const businessNumber = businessNumberMatch[1];
            const accountNumber = accountNumberMatch[1];
            const amount = amountMatch[1];

            // Format QR code data for M-PESA
            const qrData = `PB|${businessNumber}|${amount}|${accountNumber}`;
            qrCodeUrl.value = await QRCode.toDataURL(qrData);
        }
    } catch (error) {
        console.error("Error generating QR code:", error);
    }
};

const startStatusPolling = (id) => {
    // Clear any existing interval
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }

    // Set initial status check
    checkPaymentStatus(id);

    // Set up regular polling every 5 seconds
    statusCheckInterval = setInterval(() => {
        checkPaymentStatus(id);
    }, 5000);

    // Auto-stop polling after 10 minutes (maximum waiting time)
    setTimeout(
        () => {
            if (statusCheckInterval) {
                clearInterval(statusCheckInterval);

                // Only update if still pending
                if (paymentStatus.value === "PENDING") {
                    statusMessage.value =
                        "Payment waiting time expired. Please check your order status in your account.";
                }
            }
        },
        10 * 60 * 1000,
    );
};

const checkPaymentStatus = async (id) => {
    if (paymentStatus.value !== "PENDING") {
        // Stop polling if payment is complete or failed
        if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
        }
        return;
    }

    isCheckingStatus.value = true;

    try {
        const response = await axios.get(`/transactions/${id}/status`);

        if (response.data && response.data.status) {
            paymentStatus.value = response.data.status;

            if (response.data.status === "COMPLETED") {
                statusMessage.value =
                    "Payment received! Your order has been confirmed.";

                // Stop polling
                if (statusCheckInterval) {
                    clearInterval(statusCheckInterval);
                }

                // Show success message
                snackbarStore.addSnackbar({
                    message: "Payment successful! Your order has been placed.",
                    type: "success",
                });

                // Redirect after 5 seconds
                setTimeout(() => {
                    goToOrders();
                }, 5000);
            } else if (response.data.status === "FAILED") {
                statusMessage.value = "Payment failed. Please try again.";
                paymentError.value =
                    "We couldn't process your payment. Please check your payment details and try again.";

                // Stop polling
                if (statusCheckInterval) {
                    clearInterval(statusCheckInterval);
                }
            }
        }
    } catch (error) {
        console.error("Error checking payment status:", error);
    } finally {
        isCheckingStatus.value = false;
    }
};

const cancelPayment = () => {
    // Stop status polling
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }

    // Reset payment UI
    showPaymentStatus.value = false;
    paymentInfo.value = null;
    qrCodeUrl.value = "";
    paymentStatus.value = "PENDING";
    statusMessage.value = "Waiting for payment...";
    paymentError.value = "";

    // Show warning
    snackbarStore.addSnackbar({
        message: "Payment cancelled. Your order has not been processed.",
        type: "warning",
    });
};

const goToOrders = () => {
    router.push("/dashboard");
};

const isPhoneNumberValid = computed(() => {
    const phone = shippingDetails.value.phoneNumber;
    if (!phone) return true; // Don't show error when empty

    // Must be 10 digits and start with 0
    return /^0\d{9}$/.test(phone);
});

const isFormValid = computed(() => {
    return isPhoneNumberValid.value && shippingDetails.value.phoneNumber !== "";
});

// Clean up on component unmount
onUnmounted(() => {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }
});
</script>
