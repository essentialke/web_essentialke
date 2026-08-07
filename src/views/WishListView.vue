<template>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-6">My Wishlist</h1>

        <div
            v-if="wishlistStore.wishlistItems.length === 0"
            class="text-center py-12"
        >
            <div class="mb-4">
                <font-awesome-icon
                    :icon="['far', 'heart']"
                    class="text-gray-400 text-5xl mb-4"
                />
            </div>
            <p class="text-gray-600 mb-4">Your wishlist is empty</p>
            <RouterLink
                to="/products"
                class="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition duration-200"
            >
                Discover Books
            </RouterLink>
        </div>

        <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
            <div
                v-for="item in wishlistStore.wishlistItems"
                :key="item.id"
                class="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 overflow-hidden group"
            >
                <div class="relative">
                    <RouterLink :to="`/product/${item.product.id}/${item.product.slug}`">
                        <img
                            :src="getImageUrl(item.product.coverImageUrl)"
                            :alt="item.product.title"
                            class="w-full h-64 object-cover"
                        />
                    </RouterLink>
                    <button
                        @click="removeFromWishlist(item.productId)"
                        class="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full p-2 transition duration-200 opacity-0 group-hover:opacity-100"
                        title="Remove from Wishlist"
                    >
                        <font-awesome-icon :icon="['fas', 'times']" />
                    </button>
                </div>

                <div class="p-6">
                    <h3 class="text-xl font-semibold mb-2">
                        <RouterLink
                            :to="`/product/${item.product.id}/${item.product.slug}`"
                            class="hover:text-primary transition duration-200"
                        >
                            {{ item.product.title }}
                        </RouterLink>
                    </h3>
                    <p class="text-gray-600 mb-3">
                        by {{ item.product.author }}
                    </p>
                    <p
                        v-if="item.product.description"
                        class="text-gray-500 text-sm line-clamp-3 mb-4"
                    >
                        {{ item.product.description }}
                    </p>

                    <div class="mt-auto">
                        <RouterLink
                            :to="`/product/${item.product.id}/${item.product.slug}`"
                            class="inline-flex items-center text-primary hover:text-primary-dark transition duration-200"
                        >
                            View Details
                            <font-awesome-icon
                                :icon="['fas', 'arrow-right']"
                                class="ml-2 text-sm"
                            />
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useWishlistStore } from "../stores/wishlist";
import { RouterLink } from "vue-router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faTimes, faHeart, faArrowRight);

const wishlistStore = useWishlistStore();

onMounted(() => {
    wishlistStore.fetchWishlistItems();
});

const removeFromWishlist = async (productId) => {
    try {
        await wishlistStore.removeFromWishlist(productId);
    } catch (error) {
        console.error("Error removing from wishlist:", error);
    }
};

const getImageUrl = computed(() => (coverImageUrl) => {
    if (!coverImageUrl) return "";
    if (coverImageUrl.startsWith("http")) {
        return coverImageUrl;
    } else {
        const baseUrl = import.meta.env.DEV
            ? "http://localhost:3000"
            : import.meta.env.VITE_ASSET_URL;
        return `${baseUrl}${coverImageUrl}`;
    }
});
</script>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
