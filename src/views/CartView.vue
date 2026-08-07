<template>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">Your Cart</h1>

        <div v-if="cartStore.cartItems.length === 0">
            <p class="text-gray-600">Your cart is empty.</p>
        </div>

        <div v-else>
            <!-- Cart Items List -->
            <div class="space-y-4">
                <div
                    v-for="item in cartStore.cartItems"
                    :key="item.id"
                    class="border rounded-lg p-4 flex items-center justify-between"
                >
                    <div class="flex items-center space-x-4">
                        <img
                            :src="getImageUrl(item.product.coverImageUrl)"
                            :alt="item.product.title"
                            class="w-16 h-24 object-cover rounded"
                        />
                        <div>
                            <h3 class="text-lg font-semibold">
                                {{ item.product.title }}
                            </h3>
                            <p class="text-gray-600">
                                {{ item.product.author }}
                            </p>
                            <p class="text-gray-800">
                                KES {{ item.product.price.toFixed(2) }}
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center space-x-4">
                        <!-- Quantity -->
                        <div class="flex items-center border rounded">
                            <button
                                @click="
                                    cartStore.updateQuantity(
                                        item.id,
                                        item.quantity - 1,
                                    )
                                "
                                :disabled="item.quantity <= 1"
                                class="px-2 py-1"
                            >
                                -
                            </button>
                            <span class="px-3">{{ item.quantity }}</span>
                            <button
                                @click="
                                    cartStore.updateQuantity(
                                        item.id,
                                        item.quantity + 1,
                                    )
                                "
                                class="px-2 py-1"
                            >
                                +
                            </button>
                        </div>
                        <!-- Remove -->
                        <button
                            @click="cartStore.removeFromCart(item.id)"
                            class="text-red-500 hover:text-red-700"
                        >
                            <svg
                                class="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Cart Summary -->
            <div class="mt-6 p-4 border rounded-lg">
                <div class="flex justify-between mb-2">
                    <span class="text-gray-600">Subtotal</span>
                    <span class="font-semibold">
                        KES {{ cartStore.subtotal.toFixed(2) }}
                    </span>
                </div>
                <div class="flex justify-between mb-2">
                    <span class="text-gray-600">Tax (estimated)</span>
                    <span class="font-semibold">
                        KES {{ cartStore.tax.toFixed(2) }}
                    </span>
                </div>
                <hr class="my-2" />
                <div class="flex justify-between mb-2">
                    <span class="text-lg font-semibold">Total</span>
                    <span class="text-lg font-semibold">
                        KES {{ cartStore.total.toFixed(2) }}
                    </span>
                </div>
                <button
                    @click="checkout"
                    class="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition duration-200"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useCartStore } from "../stores/cart";
import { useRouter } from "vue-router";
import { computed } from "vue";

const cartStore = useCartStore();
const router = useRouter();

// Fetch cart items when the component is mounted
cartStore.fetchCartItems();

const checkout = () => {
    // Replace this with your actual checkout logic
    // alert("Proceeding to checkout...");
    // You might want to clear the cart or redirect to a checkout page
    // cartStore.clearCart();
    router.push("/checkout");
};

const getImageUrl = computed(() => (coverImageUrl) => {
    if (!coverImageUrl) return "";
    if (coverImageUrl.startsWith("http")) {
        return coverImageUrl;
    } else {
        const baseUrl = import.meta.env.DEV
            ? "http://localhost:3000"
            : "https://u888w80wkcwg8g0wc444so0o.cloud.elevatika.com";
        return `${baseUrl}${coverImageUrl}`;
    }
});
</script>
