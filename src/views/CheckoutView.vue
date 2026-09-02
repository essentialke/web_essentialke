<template>
    <div class="checkout-page container mx-auto px-3 sm:px-4 py-7 sm:py-10">
        <header class="checkout-header">
            <p class="checkout-kicker">Secure checkout</p>
            <h1>Complete your order</h1>
            <div class="checkout-steps" aria-label="Checkout progress">
                <span class="complete">1 <b>Cart</b></span><i></i><span class="active">2 <b>Delivery</b></span><i></i><span>3 <b>Payment</b></span>
            </div>
        </header>

        <div v-if="!showPaymentStatus">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <!-- Order Summary -->
                <aside class="order-summary order-2 lg:col-span-5 lg:order-2">
                    <div class="summary-heading"><div><p>Your bag</p><h2>Order summary</h2></div><span>{{ cartStore.cartItemCount }} item{{ cartStore.cartItemCount === 1 ? '' : 's' }}</span></div>
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
                                        {{ Number(item.product.salePrice && item.product.salePrice < item.product.price ? item.product.salePrice : item.product.price).toFixed(2) }}
                                    </p>
                                </div>
                                <span class="font-semibold">
                                    KES
                                    {{
                                        (
                                            item.quantity * (item.product.salePrice && item.product.salePrice < item.product.price ? item.product.salePrice : item.product.price)
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
                        <div
                            class="flex justify-between mb-2"
                            v-if="appliedDiscount"
                        >
                            <span class="text-gray-600">Discount Applied</span>
                            <span class="font-semibold text-green-600">
                                -KES {{ appliedDiscount.toFixed(2) }}
                            </span>
                        </div>

                        <div v-if="selectedDelivery" class="flex justify-between mb-2">
                            <span class="text-gray-600">{{ selectedDelivery.isPickup ? 'Store pickup' : 'Delivery' }}</span>
                            <span class="font-semibold">{{ selectedDelivery.fee === 0 ? 'Free' : `KES ${selectedDelivery.fee.toFixed(2)}` }}</span>
                        </div>

                        <hr class="my-2" />
                        <div class="flex justify-between mb-2">
                            <span class="text-lg font-semibold"
                                >Final Total</span
                            >
                            <span class="text-lg font-semibold">
                                KES
                                {{ finalTotal.toFixed(2) }}
                            </span>
                        </div>
                    </div>
                </aside>

                <!-- Shipping and Billing Details -->
                <section class="delivery-panel order-1 lg:col-span-7 lg:order-1">
                    <div class="panel-heading"><span>01</span><div><h2>Delivery or pickup</h2><p>Choose delivery to your area or collect your order from our store.</p></div></div>
                    <form @submit.prevent="placeOrder" class="space-y-6 checkout-form">
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

                        <fieldset>
                            <legend class="block text-sm font-medium text-gray-700">Delivery method</legend>
                            <div class="delivery-options">
                                <label v-for="option in deliveryOptions" :key="option.id" class="delivery-option" :class="{ selected: shippingDetails.deliveryDestination === option.id }">
                                    <input v-model="shippingDetails.deliveryDestination" type="radio" name="deliveryDestination" :value="option.id" required />
                                    <span><b>{{ option.label }}</b><small>{{ option.isPickup ? 'Collect from our store' : 'Standard delivery' }}</small></span><strong>{{ option.fee === 0 ? 'Free' : `KES ${option.fee}` }}</strong>
                                </label>
                            </div>
                        </fieldset>

                        <div>
                            <label for="deliveryNote" class="block text-sm font-medium text-gray-700">{{ selectedDelivery?.isPickup ? 'Pickup notes' : 'Delivery notes' }} <span class="text-gray-400">(optional)</span></label>
                            <textarea
                                id="deliveryNote"
                                v-model.trim="shippingDetails.deliveryNote"
                                rows="3"
                                maxlength="500"
                                :placeholder="selectedDelivery?.isPickup ? 'Add the name of the person collecting, if different.' : 'Add a landmark or any details that will help with delivery.'"
                                class="mt-1 block w-full border border-gray-300 py-3 px-3 focus:outline-none sm:text-sm"
                            ></textarea>
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

                        <div class="checkout-actions">
                            <button
                                type="submit"
                                :disabled="isPlacingOrder || cartStore.cartItems.length === 0 || !isFormValid"
                                class="primary-checkout-action"
                            >
                                {{ isPlacingOrder ? "Placing Order..." : `Pay KES ${payableTotal.toFixed(2)}` }}
                            </button>
                            <button
                                type="button"
                                class="whatsapp-checkout-action"
                                :disabled="cartStore.cartItems.length === 0"
                                @click="openWhatsAppCheckout"
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill="currentColor" d="M12.04 2a9.84 9.84 0 0 0-8.47 14.84L2 22l5.3-1.52A9.93 9.93 0 1 0 12.04 2Zm0 17.98a8.04 8.04 0 0 1-4.1-1.12l-.3-.18-3.15.9.93-3.06-.2-.32a7.94 7.94 0 1 1 6.82 3.78Zm4.4-5.94c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2a7.25 7.25 0 0 1-1.34-1.67c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                                </svg>
                                Order via WhatsApp
                            </button>
                        </div>
                    </form>
                    <p class="secure-note">🔒 Your payment is securely processed. We never store your M-Pesa PIN.</p>
                </section>
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
                            Check your phone for the M-PESA prompt and enter
                            your PIN to complete payment.
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
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useCartStore } from "../stores/cart";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";
import axios from "axios";
import { useSnackbarStore } from "../stores/snackbar";

const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();
const snackbarStore = useSnackbarStore();

// Form data and state
const shippingDetails = ref({
    name: "",
    phoneNumber: "",
    deliveryDestination: "",
    deliveryNote: "",
});

const deliveryOptions = [
    { id: "store-pickup", label: "Pick up from store", fee: 0, country: "Kenya", isPickup: true },
    { id: "mombasa-nairobi-service-area", label: "Mombasa → Nairobi CBD, Westlands, Parklands, Kilimani, South C & South B", fee: 350, country: "Kenya" },
    { id: "nairobi-kilimani-kileleshwa", label: "Nairobi → Kilimani & Kileleshwa", fee: 250, country: "Kenya" },
    { id: "ngong-road", label: "Ngong Road", fee: 200, country: "Kenya" },
    { id: "nairobi-cbd", label: "Nairobi CBD", fee: 450, country: "Kenya" },
    { id: "malindi-lamu", label: "Malindi & Lamu", fee: 300, country: "Kenya" },
    { id: "dar-es-salaam", label: "Dar es Salaam", fee: 400, country: "Tanzania" },
    { id: "kampala", label: "Kampala", fee: 600, country: "Uganda" },
];
const selectedDelivery = computed(() => deliveryOptions.find((option) => option.id === shippingDetails.value.deliveryDestination) || null);

const discountCode = ref("");
const isApplyingDiscount = ref(false);
const isPlacingOrder = ref(false);
const discountError = ref("");
const discountMessage = ref("");
const appliedDiscount = ref(0);

// Payment status tracking
const showPaymentStatus = ref(false);
const paymentInfo = ref(null);
const paymentStatus = ref("PENDING");
const statusMessage = ref("Waiting for payment...");
const paymentError = ref("");
const transactionId = ref(null);
const isCheckingStatus = ref(false);
let statusCheckInterval = null;

// Computed property for final total
const finalTotal = computed(() => {
    return cartStore.total - appliedDiscount.value + (selectedDelivery.value?.fee || 0);
});
const payableTotal = computed(() => Math.max(0, finalTotal.value));
const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");

const openWhatsAppCheckout = () => {
    if (!cartStore.cartItems.length) return;

    const items = cartStore.cartItems.map((item) => {
        const unitPrice = Number(
            item.product.salePrice && item.product.salePrice < item.product.price
                ? item.product.salePrice
                : item.product.price,
        );
        return `• ${item.product.title} × ${item.quantity} — KES ${(unitPrice * item.quantity).toFixed(2)}`;
    });
    const message = [
        "Hello Essential, I would like to place this order:",
        "",
        ...items,
        "",
        selectedDelivery.value ? `Delivery: ${selectedDelivery.value.label}` : "Delivery: To be confirmed",
        `Total: KES ${payableTotal.value.toFixed(2)}`,
        shippingDetails.value.name.trim() ? `Name: ${shippingDetails.value.name.trim()}` : "",
    ].filter(Boolean).join("\n");
    const destination = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/";
    window.open(`${destination}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
};

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

const placeOrder = async () => {
    if (cartStore.cartItems.length === 0) {
        snackbarStore.addSnackbar({
            message: "Your cart is empty!",
            type: "warning",
        });
        return;
    }

    if (!selectedDelivery.value) {
        snackbarStore.addSnackbar({ message: "Please select delivery or store pickup.", type: "warning" });
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
            shippingAddress: shippingDetails.value.deliveryNote
                ? `${selectedDelivery.value.label} — ${shippingDetails.value.deliveryNote}`
                : selectedDelivery.value.label,
            billingAddress: selectedDelivery.value.label,
            shippingMethod: selectedDelivery.value.label,
            deliveryDestination: shippingDetails.value.deliveryDestination,
            discountCode: discountCode.value || null,
            notes: shippingDetails.value.deliveryNote,
            phoneNumber,
        };

        const response = await axios.post("/transactions", orderData);

        if (response.data && response.data.transaction) {
            // Store transaction ID for status checks
            transactionId.value = response.data.transaction.id;

            // Show payment status section
            showPaymentStatus.value = true;

            // Store payment info
            paymentInfo.value = response.data.intasendPayment;

            // Start status polling
            startStatusPolling(transactionId.value);

            // Reset form values
            appliedDiscount.value = 0;
            discountCode.value = "";

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
    const details = shippingDetails.value;
    return Boolean(
        details.name.trim() &&
        details.deliveryDestination &&
        details.phoneNumber &&
        isPhoneNumberValid.value
    );
});

// Clean up on component unmount
onUnmounted(() => {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }
});
</script>

<style scoped>
.checkout-page{max-width:1280px}.checkout-header{margin:0 auto 48px;text-align:center}.checkout-kicker{margin-bottom:9px;color:#9a7c50;font-size:9px;font-weight:650;letter-spacing:.25em;text-transform:uppercase}.checkout-header h1{font-family:'GFS Didot',Georgia,serif;font-size:clamp(38px,5vw,58px);font-weight:400;line-height:1}.checkout-steps{display:flex;align-items:center;justify-content:center;max-width:470px;margin:28px auto 0;color:#9a948c}.checkout-steps span{display:flex;align-items:center;gap:8px;font-size:11px}.checkout-steps span:first-letter{font-weight:700}.checkout-steps b{font-size:9px;letter-spacing:.13em;text-transform:uppercase}.checkout-steps i{width:72px;height:1px;margin:0 14px;background:#ddd4c7}.checkout-steps .complete,.checkout-steps .active{color:#8d7047}.checkout-steps .active{font-weight:700}.order-summary,.delivery-panel{border:1px solid #e7e0d6;background:#fff;box-shadow:0 14px 36px rgba(53,44,34,.07)}.order-summary{position:sticky;top:128px;padding:30px}.delivery-panel{padding:clamp(24px,4vw,42px)}.summary-heading,.panel-heading{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:28px}.summary-heading p{color:#9a7c50;font-size:8px;font-weight:600;letter-spacing:.2em;text-transform:uppercase}.summary-heading h2,.panel-heading h2{font-family:'GFS Didot',Georgia,serif;font-size:28px;font-weight:400}.summary-heading>span{padding:6px 9px;background:#f7f3ed;color:#665f56;font-size:9px;letter-spacing:.1em;text-transform:uppercase}.panel-heading{justify-content:flex-start}.panel-heading>span{display:grid;width:40px;height:40px;flex:0 0 auto;place-items:center;border:1px solid #b08d57;border-radius:50%;color:#8d7047;font-size:10px}.panel-heading p{color:#777;font-size:12px}.checkout-form input:not([type=radio]),.checkout-form select{min-height:46px;border-color:#ddd4c7;border-radius:0;background:#fff;box-shadow:none}.checkout-form input:focus,.checkout-form select:focus{border-color:#a88654;box-shadow:0 0 0 1px #a88654}.delivery-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:9px}.delivery-option{display:flex;min-height:82px;align-items:center;gap:11px;padding:14px;border:1px solid #ddd4c7;background:#fff;cursor:pointer;transition:.2s}.delivery-option:hover,.delivery-option.selected{border-color:#a88654;background:#faf7f2;box-shadow:0 6px 16px rgba(53,44,34,.06)}.delivery-option input{accent-color:#9a7c50}.delivery-option span{min-width:0;flex:1}.delivery-option b,.delivery-option small{display:block}.delivery-option b{font-family:Georgia,serif;font-size:12px;font-weight:500;line-height:1.35}.delivery-option small{margin-top:4px;color:#8a847c;font-size:9px;letter-spacing:.08em;text-transform:uppercase}.delivery-option strong{white-space:nowrap;color:#7f633d;font-size:11px}.checkout-form button[type=submit]{min-height:52px;border-radius:0;background:#1f1f1c;font-size:10px;font-weight:650;letter-spacing:.16em;text-transform:uppercase;transition:.25s}.checkout-form button[type=submit]:hover{background:#9a7c50}.secure-note{margin-top:16px;text-align:center;color:#777;font-size:10px}.order-summary li{padding-bottom:14px;border-bottom:1px solid #eee9e2}.order-summary li:last-child{border-bottom:0}@media(max-width:1023px){.order-summary{position:static}}@media(max-width:640px){.checkout-page{padding-top:28px}.checkout-header{margin-bottom:32px}.checkout-steps b{display:none}.checkout-steps i{width:42px}.delivery-options{grid-template-columns:1fr}.order-summary,.delivery-panel{padding:22px}.panel-heading{align-items:flex-start}}
.checkout-form button[type=submit]{display:flex;min-height:54px;align-items:center;justify-content:center;padding:0 24px;border-radius:0;background:#1f1f1c;font-size:12px;font-weight:800;line-height:1;letter-spacing:.12em;text-transform:uppercase;transition:.25s}
.checkout-actions{display:grid;gap:10px}.checkout-actions button{display:flex;width:100%;min-height:54px;align-items:center;justify-content:center;gap:10px;padding:0 24px;border-radius:0;font-size:12px;font-weight:800;line-height:1;letter-spacing:.12em;text-transform:uppercase;transition:.25s}.primary-checkout-action{border:1px solid #1f1f1c;color:#fff}.whatsapp-checkout-action{border:1px solid #1f1f1c;background:#fff;color:#1f1f1c}.whatsapp-checkout-action:hover:not(:disabled){border-color:#1f8f55;background:#f0faf4;color:#167344}.whatsapp-checkout-action svg{width:19px;height:19px;flex:0 0 auto}.checkout-actions button:disabled{cursor:not-allowed;opacity:.5}
@media(max-width:640px){.checkout-page{padding-top:22px}.checkout-header{margin-bottom:26px}.checkout-header h1{font-size:38px}.checkout-steps{margin-top:20px}.checkout-steps i{width:36px;margin-inline:10px}.order-summary,.delivery-panel{padding:18px}.panel-heading{margin-bottom:22px}.order-summary li{align-items:flex-start;gap:12px}.order-summary li>div{min-width:0}.order-summary li h4{line-height:1.35}.order-summary li>span{text-align:right;white-space:nowrap;font-size:13px}}
</style>
