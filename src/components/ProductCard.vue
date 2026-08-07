<template>
    <div
        class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 flex flex-col h-full"
    >
        <!-- Image Container - Fixed aspect ratio -->
        <div class="relative overflow-hidden product-cover-container">
            <!-- Wishlist Button - Outside RouterLink -->
            <button
                @click="handleAddToWishlist"
                class="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-200 shadow-sm"
                :class="
                    wishlistStore.isInWishlist(product.id)
                        ? 'text-red-500'
                        : 'text-gray-600'
                "
                title="Add to Wishlist"
            >
                <font-awesome-icon :icon="['fas', 'heart']" class="text-lg" />
            </button>

            <RouterLink
                :to="`/product/${product.id}/${product.slug}`"
                class="absolute inset-0"
            >


            <!-- Centered product cover image -->
            <div
                class="absolute inset-0 flex items-center justify-center bg-white"
            >
                <img
                    :src="imageUrl"
                    :alt="product.title"
                    class="w-full h-full object-cover shadow-xl transform group-hover:scale-105 transition duration-500 z-[1]"
                    loading="lazy"
                />
            </div>

            <div
                class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[2]"
            ></div>
            </RouterLink>
        </div>

        <!-- Content Container -->
        <div class="p-6 flex flex-col flex-grow">
            <!-- Category Badge -->
            <div class="mb-2">
                <span
                    class="text-xs font-medium px-2.5 py-1 bg-primary/10 text-primary rounded-full"
                >
                    {{ product.category || "Fiction" }}
                </span>
            </div>

            <!-- Title and Author -->
            <div class="mb-3">
                <h2
                    class="text-lg font-bold text-gray-900 mb-1 line-clamp-1 font-display-serif"
                >
                    <RouterLink
                        :to="`/product/${product.id}/${product.slug}`"
                        class="hover:text-primary transition-colors duration-200"
                    >
                        {{ product.title }}
                    </RouterLink>
                </h2>
                <p class="text-gray-600 text-sm">
                    by <span class="font-medium">{{ product.author }}</span>
                </p>
            </div>

            <!-- Description -->
            <p class="text-gray-600 text-sm line-clamp-3 font-serif mb-4">
                {{ product.description }}
            </p>

            <!-- Price and Actions -->
            <div class="mt-auto pt-4 border-t border-gray-100">
                <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                        <span class="text-sm text-gray-500">Price</span>
                        <span
                            class="text-sm font-bold text-primary font-display-serif"
                        >
                            KES {{ product.price.toFixed(2) }}
                        </span>
                    </div>
                    <button
                        :disabled="product.quantityShop <= 0"
                        @click="handleAddToCart"
                        class="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-200 hover:shadow-md flex items-center gap-2 text-sm font-medium"
                        title="Add to Cart"
                        :class="{
                            'opacity-50 cursor-not-allowed':
                                product.quantityShop <= 0,
                        }"
                    >
                        <font-awesome-icon :icon="['fas', 'cart-plus']" />
                        <span>{{
                            product.quantityShop > 0
                                ? "Add to Cart"
                                : "Out of Stock"
                        }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { useCartStore } from "../stores/cart";
import { useUserStore } from "../stores/user";
import { useWishlistStore } from "../stores/wishlist";
import { useSnackbarStore } from "../stores/snackbar";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCartPlus, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed } from "vue";

library.add(faCartPlus, faHeart);

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
});

const cartStore = useCartStore();
const userStore = useUserStore();
const wishlistStore = useWishlistStore();
const snackbarStore = useSnackbarStore();

const imageUrl = computed(() => {
    if (props.product.coverImageUrl.startsWith("http")) {
        return props.product.coverImageUrl;
    } else {
        const baseUrl = import.meta.env.DEV
            ? "http://localhost:3000"
            : "https://u888w80wkcwg8g0wc444so0o.cloud.elevatika.com";
        return `${baseUrl}${props.product.coverImageUrl}`;
    }
});

async function handleAddToCart() {
    if (!userStore.isAuthenticated) {
        snackbarStore.addSnackbar({
            message: "Please login to add items to your cart.",
            type: "warning",
        });
        return;
    }
    await cartStore.addToCart(props.product, 1);
    snackbarStore.addSnackbar({
        message: "Product added to cart successfully!",
        type: "success",
    });
}

async function handleAddToWishlist() {
    if (!userStore.isAuthenticated) {
        snackbarStore.addSnackbar({
            message: "Please login to add items to your wishlist.",
            type: "warning",
        });
        return;
    }

    if (wishlistStore.isInWishlist(props.product.id)) {
        await wishlistStore.removeFromWishlist(props.product.id);
        snackbarStore.addSnackbar({
            message: "Product removed from wishlist.",
            type: "success",
        });
    } else {
        await wishlistStore.addToWishlist(props.product.id);
        snackbarStore.addSnackbar({
            message: "Product added to wishlist!",
            type: "success",
        });
    }
}
</script>

<style scoped>
.line-clamp-1 {
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Product cover container with proper aspect ratio */
.product-cover-container {
    aspect-ratio: 3/4;
    width: 100%;
    background-color: #f3f4f6; /* Fallback color */
}

/* Blur effect for background image */
.blur-effect {
    filter: blur(15px);
    transform: scale(1.1); /* Slightly scale up to avoid seeing edges */
}

/* Optional: Add smooth transition for hover effects */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}
</style>
