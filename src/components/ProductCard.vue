<template>
    <div
        class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 flex flex-col h-full"
        :class="{ 'product-card--compact': compact }"
    >
        <!-- Image Container - Fixed aspect ratio -->
        <div class="relative overflow-hidden product-cover-container">
            <span v-if="isOnSale" class="sale-badge">{{ discountPercent }}% off</span>
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
                <p v-if="product.author" class="text-gray-600 text-sm">
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
                            class="product-card-price text-sm font-bold text-primary font-display-serif"
                        >
                            <del v-if="isOnSale">KES {{ Number(product.price).toFixed(2) }}</del>
                            <b>KES {{ effectivePrice.toFixed(2) }}</b>
                        </span>
                    </div>
                    <button
                        :disabled="product.quantityShop <= 0 || isAdding"
                        @click="handleAddToCart"
                        class="add-cart-button"
                        title="Add to Cart"
                        :class="{
                            'is-disabled': product.quantityShop <= 0,
                            'is-added': added,
                        }"
                    >
                        <font-awesome-icon :icon="['fas', added ? 'check' : 'cart-plus']" aria-hidden="true" />
                        <span>{{ buttonLabel }}</span>
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
import { faCartPlus, faCheck, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, ref } from "vue";
import { resolveAssetUrl } from "../utils/assetUrl";

library.add(faCartPlus, faCheck, faHeart);

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
    compact: {
        type: Boolean,
        default: false,
    },
});

const cartStore = useCartStore();
const userStore = useUserStore();
const wishlistStore = useWishlistStore();
const snackbarStore = useSnackbarStore();

const imageUrl = computed(() => resolveAssetUrl(props.product.coverImageUrl));
const isOnSale = computed(() => Number(props.product.salePrice) > 0 && Number(props.product.salePrice) < Number(props.product.price));
const effectivePrice = computed(() => isOnSale.value ? Number(props.product.salePrice) : Number(props.product.price || 0));
const discountPercent = computed(() => Math.round((1 - Number(props.product.salePrice) / Number(props.product.price)) * 100));
const isAdding = ref(false);
const added = ref(false);
const buttonLabel = computed(() => {
    if (props.product.quantityShop <= 0) return "Out of stock";
    if (isAdding.value) return "Adding…";
    if (added.value) return "Added";
    return "Add to cart";
});

async function handleAddToCart() {
    if (!userStore.isAuthenticated) {
        snackbarStore.addSnackbar({
            message: "Please login to add items to your cart.",
            type: "warning",
        });
        return;
    }
    isAdding.value = true;
    try {
        await cartStore.addToCart(props.product, 1);
        added.value = true;
        snackbarStore.addSnackbar({ message: "Product added to cart successfully!", type: "success" });
        window.setTimeout(() => { added.value = false; }, 1800);
    } finally {
        isAdding.value = false;
    }
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

.product-card--compact {
    border-radius: 0.5rem;
}

.product-card--compact .product-cover-container {
    aspect-ratio: 4/5;
}

.product-card--compact > div:last-child {
    padding: 1rem;
}

.product-card--compact h2 {
    font-size: 1rem;
    margin-bottom: 0;
}

.product-card--compact .line-clamp-3 {
    -webkit-line-clamp: 2;
    font-size: 0.75rem;
    line-height: 1.4;
    margin-bottom: 0.75rem;
}

.product-card--compact button {
    padding: 0.55rem 0.7rem;
    font-size: 0.75rem;
}

.product-card--compact .product-cover-container > button {
    top: 0.65rem;
    right: 0.65rem;
    padding: 0.45rem;
}

.product-card--compact .mt-auto {
    padding-top: 0.75rem;
}
.product-card-price del{display:block;color:#999189;font-size:.68rem;font-weight:400}.product-card-price b{display:block}.product-card-price:has(del) b{color:#9b633b}
.sale-badge{position:absolute;z-index:9;left:12px;top:12px;padding:6px 9px;background:#8f543a;color:#fff;font:650 8px 'Geist',sans-serif;letter-spacing:.12em;text-transform:uppercase}

.add-cart-button {
    min-width: 9.25rem;
    min-height: 2.9rem;
    padding: 0.7rem 1rem;
    border: 1px solid #1d1d1b;
    border-radius: 0.55rem;
    background: #1d1d1b;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    white-space: nowrap;
    font-family: 'Geist', sans-serif;
    font-size: 0.78rem;
    font-weight: 650;
    letter-spacing: 0.035em;
    box-shadow: 0 5px 14px rgba(29, 29, 27, 0.12);
    transition: transform .2s ease, background-color .2s ease, color .2s ease, box-shadow .2s ease;
}
.add-cart-button:hover:not(:disabled) { background:#b08d57;border-color:#b08d57;box-shadow:0 8px 20px rgba(128,95,47,.22);transform:translateY(-1px) }
.add-cart-button:focus-visible { outline:2px solid #b08d57;outline-offset:3px }
.add-cart-button.is-added { background:#536646;border-color:#536646 }
.add-cart-button.is-disabled { background:#dedbd5;border-color:#dedbd5;color:#77736c;box-shadow:none;cursor:not-allowed }
.product-card--compact .add-cart-button { min-width:8.75rem;padding:.65rem .85rem;font-size:.75rem }
@media(max-width:520px){.mt-auto>div{align-items:flex-end;gap:.65rem}.add-cart-button,.product-card--compact .add-cart-button{min-width:0;padding:.65rem .75rem}}
</style>
