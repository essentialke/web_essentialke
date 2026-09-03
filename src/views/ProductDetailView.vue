<template>
    <div class="product-detail-page py-12">
        <div class="container mx-auto px-4">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex justify-center items-center h-64">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
                ></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-12">
                <p class="text-red-600 text-lg mb-4">{{ error }}</p>
                <RouterLink
                    to="/products"
                    class="text-primary hover:text-secondary"
                >
                    Return to Home
                </RouterLink>
            </div>

            <!-- Product Details -->
            <div
                v-else-if="product"
                class="product-detail-grid"
            >
                <!-- Left Column: Image and Quick Actions -->
                <div class="product-media-column">
                    <!-- Product Image -->
                    <div class="product-image-card rounded-lg overflow-hidden mb-6">
                        <img
                            :src="resolveAssetUrl(product.coverImageUrl, { width: 1280 })"
                            :srcset="createImageSrcSet(product.coverImageUrl, [480, 720, 960, 1280])"
                            sizes="(max-width: 900px) 100vw, 50vw"
                            :alt="product.title"
                            class="product-detail-image"
                        />
                    </div>

                    <!-- Quick Actions -->
                    <div class="space-y-4">
                        <!-- Shop Actions -->
                        <div
                            v-if="product.quantityShop > 0"
                            class="product-card bg-white p-6 rounded-lg"
                        >
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-2xl font-bold text-gray-900">
                                    <del v-if="product.salePrice && product.salePrice < product.price" class="mr-2 text-base font-normal text-gray-400">KES {{ product.price?.toFixed(2) }}</del>
                                    KES {{ Number(product.salePrice && product.salePrice < product.price ? product.salePrice : product.price).toFixed(2) }}
                                </span>
                                <span
                                    :class="{
                                        'text-green-600':
                                            product.quantityShop > 10,
                                        'text-yellow-600':
                                            product.quantityShop <= 10 &&
                                            product.quantityShop > 0,
                                        'text-red-600':
                                            product.quantityShop === 0,
                                    }"
                                >
                                    {{
                                        product.quantityShop > 0
                                            ? `${product.quantityShop} in stock`
                                            : "Out of stock"
                                    }}
                                </span>
                            </div>

                            <!-- Quantity Selector -->
                            <div class="flex items-center mb-4">
                                <label for="quantity" class="mr-2"
                                    >Quantity:</label
                                >
                                <div class="flex items-center border rounded">
                                    <button
                                        @click="decrementQuantity"
                                        class="px-3 py-1 border-r hover:bg-gray-100"
                                        :disabled="quantity <= 1"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        v-model="quantity"
                                        min="1"
                                        :max="product.quantityShop"
                                        class="w-16 text-center focus:outline-none"
                                    />
                                    <button
                                        @click="incrementQuantity"
                                        class="px-3 py-1 border-l hover:bg-gray-100"
                                        :disabled="
                                            quantity >= product.quantityShop
                                        "
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <!-- Add to Cart Button -->
                            <button
                                @click="addToCart"
                                class="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-secondary transition duration-200"
                                :disabled="isAddingToCart"
                            >
                                <span v-if="isAddingToCart"
                                    >Adding to Cart...</span
                                >
                                <span v-else>Add to Cart</span>
                            </button>

                            <!-- Wishlist Button -->
                            <button
                                @click="toggleWishlist"
                                class="w-full mt-2 border border-primary text-primary py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-200"
                            >
                                {{
                                    isInWishlist
                                        ? "Remove from Wishlist"
                                        : "Add to Wishlist"
                                }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Product Information -->
                <div class="product-card product-information">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">
                        {{ product.title }}
                    </h1>
                    <p class="text-xl text-gray-600 mb-6">
                        by {{ product.author }}
                    </p>
                    <!-- Average Rating Display -->
                    <div v-if="product.averageRating > 0" class="mb-4">
                        <div class="flex items-center">
                            <span class="text-yellow-400 mr-1">
                                {{
                                    "★".repeat(
                                        Math.round(product.averageRating),
                                    )
                                }}
                            </span>
                            <span class="text-gray-300">
                                {{
                                    "★".repeat(
                                        5 - Math.round(product.averageRating),
                                    )
                                }}
                            </span>
                        </div>
                        <span class="text-sm text-gray-600">
                            (Average Rating:
                            {{ product.averageRating.toFixed(1) }})
                        </span>
                    </div>
                    <div v-else class="mb-4">
                        <span class="text-sm text-gray-600"
                            >No reviews yet.</span
                        >
                    </div>

                    <!-- Product Details -->
                    <div class="space-y-6">
                        <!-- Description -->
                        <div>
                            <h2
                                class="text-xl font-semibold text-gray-900 mb-2"
                            >
                                Description
                            </h2>
                            <p class="text-gray-700 leading-relaxed">
                                {{ product.description }}
                            </p>
                        </div>

                        <!-- Additional Details -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <h3 class="font-semibold text-gray-900">
                                    Category
                                </h3>
                                <p class="text-gray-700">
                                    {{ product.category }}
                                </p>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">
                                    SKU
                                </h3>
                                <p class="text-gray-700">
                                    {{ product.sku || "N/A" }}
                                </p>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">
                                    Brand
                                </h3>
                                <p class="text-gray-700">
                                    {{ product.brand || "N/A" }}
                                </p>
                            </div>
                        </div>

                        <!-- Reviews Section -->
                        <div class="mt-8">
                            <h2
                                class="text-xl font-semibold text-gray-900 mb-4"
                            >
                                Reviews
                            </h2>

                            <!-- Reviews List -->
                            <div
                                v-if="product.reviews?.length"
                                class="space-y-4 mb-5"
                            >
                                <div
                                    v-for="review in product.reviews"
                                    :key="review.id"
                                    class="review-card bg-white p-4 border-b-2 border-b-secondary"
                                >
                                    <div
                                        class="flex justify-between items-start"
                                    >
                                        <div>
                                            <div class="flex items-center">
                                                <span class="text-yellow-400">
                                                    {{
                                                        "★".repeat(
                                                            review.rating,
                                                        )
                                                    }}
                                                </span>
                                                <span class="text-gray-300">
                                                    {{
                                                        "★".repeat(
                                                            5 - review.rating,
                                                        )
                                                    }}
                                                </span>
                                            </div>
                                            <p
                                                class="font-medium text-gray-900"
                                            >
                                                {{ review.user.name }}
                                            </p>
                                        </div>
                                        <span class="text-sm text-gray-500">
                                            {{ formatDate(review.createdAt) }}
                                        </span>
                                    </div>
                                    <p class="mt-2 text-gray-700">
                                        {{ review.comment }}
                                    </p>
                                    <!-- Edit/Delete Buttons (Conditional) -->
                                    <div
                                        v-if="
                                            userStore.isAuthenticated &&
                                            userStore.user?.userId ===
                                                review.userId
                                        "
                                        class="mt-2 space-x-2"
                                    >
                                        <button
                                            @click="editReview(review)"
                                            class="text-blue-500 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            @click="deleteReview(review.id)"
                                            class="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- No Reviews Message -->
                            <p v-else class="text-gray-500 text-center py-4">
                                No reviews yet. Be the first to review this
                                product!
                            </p>

                            <!-- Review Form -->
                            <div
                                v-if="userStore.isAuthenticated"
                                class="mb-6 shadow p-5"
                            >
                                <!-- Add a v-if to show form if editing or not -->
                                <form
                                    v-if="!editingReview"
                                    @submit.prevent="submitReview"
                                    class="space-y-4"
                                >
                                    <div>
                                        <label
                                            class="block text-sm font-medium text-gray-700"
                                            >Rating</label
                                        >
                                        <div class="flex space-x-2 mt-1">
                                            <button
                                                v-for="star in 5"
                                                :key="star"
                                                type="button"
                                                @click="newReview.rating = star"
                                                class="text-2xl focus:outline-none"
                                                :class="
                                                    star <= newReview.rating
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                "
                                            >
                                                ★
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            class="block text-sm font-medium text-gray-700"
                                            >Your Review</label
                                        >
                                        <textarea
                                            v-model="newReview.comment"
                                            rows="3"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        class="bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition duration-200"
                                        :disabled="isSubmittingReview"
                                    >
                                        {{
                                            isSubmittingReview
                                                ? "Submitting..."
                                                : "Submit Review"
                                        }}
                                    </button>
                                </form>
                                <!-- Edit form -->
                                <form
                                    v-if="editingReview"
                                    @submit.prevent="updateReview"
                                    class="space-y-4"
                                >
                                    <div>
                                        <label
                                            class="block text-sm font-medium text-gray-700"
                                            >Rating</label
                                        >
                                        <div class="flex space-x-2 mt-1">
                                            <button
                                                v-for="star in 5"
                                                :key="star"
                                                type="button"
                                                @click="
                                                    editedReview.rating = star
                                                "
                                                class="text-2xl focus:outline-none"
                                                :class="
                                                    star <= editedReview.rating
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                "
                                            >
                                                ★
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            class="block text-sm font-medium text-gray-700"
                                            >Your Review</label
                                        >
                                        <textarea
                                            v-model="editedReview.comment"
                                            rows="3"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        class="bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition duration-200"
                                        :disabled="isUpdatingReview"
                                    >
                                        {{
                                            isUpdatingReview
                                                ? "Updating..."
                                                : "Update Review"
                                        }}
                                    </button>
                                    <button
                                        type="button"
                                        @click="cancelEdit"
                                        class="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200 ml-2"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Related Products Section -->
            <section v-if="relatedProducts.length > 0" class="related-products">
                <div class="related-heading">
                    <div>
                        <p class="related-kicker">You may also love</p>
                        <h2>Complete your collection</h2>
                    </div>
                    <RouterLink to="/products" class="related-link">View all pieces <span>→</span></RouterLink>
                </div>
                <div class="related-grid">
                    <div v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" class="related-card">
                        <FeaturedProductCard :product="relatedProduct" />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { useCartStore } from "../stores/cart";
import { useWishlistStore } from "../stores/wishlist";
import { useSnackbarStore } from "../stores/snackbar";
import { useAuthPromptStore } from "../stores/authPrompt";
import FeaturedProductCard from "../components/FeaturedProductCard.vue";

import axios from "axios";
import { createImageSrcSet, resolveAssetUrl } from "../utils/assetUrl";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const snackbarStore = useSnackbarStore();
const authPromptStore = useAuthPromptStore();

const product = ref(null);
const relatedProducts = ref([]);
const isLoading = ref(true);
const error = ref(null);
const quantity = ref(1);
const isAddingToCart = ref(false);
const isBorrowing = ref(false);
const isSubmittingReview = ref(false);
const isFromLibrary = ref(false); // Track if coming from /library
const isUpdatingReview = ref(false);
const editingReview = ref(false);
const editedReview = ref({
    id: null,
    rating: 0,
    comment: "",
});

const newReview = ref({
    rating: 0,
    comment: "",
});

// Check if coming from /library route using query parameter
isFromLibrary.value = route.query.from === "library";

// Fetch product details and related products
onMounted(async () => {
    await loadProductDetails();
    console.log(route.params);
});

async function loadProductDetails() {
    isLoading.value = true;
    try {
        const response = await axios.get(`/products/${route.params.id}`);
        // product.value = response.data;

        // Fetch the wishlist items to update the isInWishlist status
        if (userStore.isAuthenticated) {
            await wishlistStore.fetchWishlistItems();
        }
        // Force reactivity update
        if (response.data) {
            // Assuming the product object has a reviews array
            const updatedReviews = response.data.reviews || [];
            // Assign the new reviews array to the product object
            product.value = {
                ...response.data,
                reviews: updatedReviews,
            };

            // Fetch related products
            if (product.value.category) {
                const relatedResponse = await axios.get('/products/related', {
                    params: {
                        category: product.value.category,
                        currentProductId: product.value.id,
                        limit: 4
                    }
                });
                relatedProducts.value = relatedResponse.data;
            }
        }
    } catch (err) {
        console.error("Error loading product:", err);
        error.value = "Error loading product details. Please try again later.";
    } finally {
        isLoading.value = false;
    }
}

const isInWishlist = computed(() => {
    return wishlistStore.isInWishlist(product.value?.id);
});

async function addToCart() {
    if (!userStore.isAuthenticated) {
        authPromptStore.open(route.fullPath, product.value.id, quantity.value);
        return;
    }

    try {
        isAddingToCart.value = true;
        await cartStore.addToCart(product.value, quantity.value); // Use cart store action
        snackbarStore.addSnackbar({
            message: "Product added to cart successfully!",
            type: "success"
        });
    } catch (err) {
        console.error("Error adding to cart:", err);
        snackbarStore.addSnackbar({
            message: "Failed to add product to cart. Please try again.",
            type: "error"
        });
    } finally {
        isAddingToCart.value = false;
    }
}


async function toggleWishlist() {
    if (!userStore.isAuthenticated) {
        router.push("/login");
        return;
    }

    try {
        if (isInWishlist.value) {
            await wishlistStore.removeFromWishlist(product.value.id);
        } else {
            await wishlistStore.addToWishlist(product.value.id);
        }
        // No need to update isInWishlist.value here since we're using the computed property
    } catch (err) {
        console.error("Error updating wishlist:", err);
        snackbarStore.addSnackbar({
            message: "Failed to update wishlist. Please try again.",
            type: "error"
        });
    }
}

async function submitReview() {
    if (!userStore.isAuthenticated) {
        router.push("/login");
        return;
    }

    if (!newReview.value.rating || !newReview.value.comment.trim()) {
        snackbarStore.addSnackbar({
            message: "Please provide both a rating and a comment.",
            type: "warning"
        });
        return;
    }

    try {
        isSubmittingReview.value = true;

        console.log("Submitting review:", newReview.value); // Log the review data
        console.log("User ID:", userStore.user.userId); // Log the user ID
        console.log("Product ID:", parseInt(product.value.id, 10));

        const response = await axios.post("/reviews", {
            productId: parseInt(product.value.id, 10),
            userId: userStore.user.userId,
            rating: newReview.value.rating,
            comment: newReview.value.comment,
            status: "approved",
        });

        console.log("Review submitted successfully:", response); // Log the response

        // Fetch product details again to update the reviews
        await loadProductDetails();

        // Reset form
        newReview.value = {
            rating: 0,
            comment: "",
        };

        snackbarStore.addSnackbar({
            message: "Review submitted successfully!",
            type: "success"
        });
    } catch (err) {
        console.error("Error submitting review:", err);
        snackbarStore.addSnackbar({
            message: "Failed to submit review. Please try again.",
            type: "error"
        });
    } finally {
        isSubmittingReview.value = false;
    }
}
function editReview(review) {
    editingReview.value = true;
    // Copy the review data to editedReview for editing
    editedReview.value = {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
    };
}

function cancelEdit() {
    editingReview.value = false;
    // Reset the editedReview object
    editedReview.value = {
        id: null,
        rating: 0,
        comment: "",
    };
}

async function updateReview() {
    if (!editedReview.value.rating || !editedReview.value.comment.trim()) {
        snackbarStore.addSnackbar({
            message: "Please provide both a rating and a comment.",
            type: "warning"
        });
        return;
    }

    try {
        isUpdatingReview.value = true;
        const response = await axios.put(`/reviews/${editedReview.value.id}`, {
            rating: editedReview.value.rating,
            comment: editedReview.value.comment,
            status: "approved",
        });

        // Refresh the reviews list
        await loadProductDetails();

        // Exit edit mode
        cancelEdit();

        snackbarStore.addSnackbar({
            message: "Review updated successfully!",
            type: "success"
        });
    } catch (err) {
        console.error("Error updating review:", err);
        snackbarStore.addSnackbar({
            message: "Failed to update review. Please try again.",
            type: "error"
        });
    } finally {
        isUpdatingReview.value = false;
    }
}

async function deleteReview(reviewId) {
    if (!confirm("Are you sure you want to delete this review?")) {
        return;
    }

    try {
        await axios.delete(`/reviews/${reviewId}`);
        // Refresh the reviews list
        await loadProductDetails();
        snackbarStore.addSnackbar({
            message: "Review deleted successfully!",
            type: "success"
        });
    } catch (err) {
        console.error("Error deleting review:", err);
        snackbarStore.addSnackbar({
            message: "Failed to delete review. Please try again.",
            type: "error"
        });
    }
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function incrementQuantity() {
    if (quantity.value < product.value.quantityShop) {
        quantity.value++;
    }
}

function decrementQuantity() {
    if (quantity.value > 1) {
        quantity.value--;
    }
}

watch(
    () => route.params.id,
    async (newId) => {
        isLoading.value = true;
        error.value = null;
        product.value = null;
        quantity.value = 1;

        await loadProductDetails();
    },
);
</script>

<style scoped>
.product-detail-page {
    min-height: 100vh;
    background: #fff;
    color: #1a1a1a;
}

.product-card,
.product-image-card,
.review-card {
    border: 1px solid #e7e0d6;
    box-shadow: 0 12px 32px rgba(53, 44, 34, 0.08);
}

.product-information {
    align-self: start;
    padding: clamp(24px, 4vw, 48px);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.82);
}

.product-detail-grid {
    width: min(100%, 1480px);
    margin-inline: auto;
    display: grid;
    grid-template-columns: minmax(360px, 0.82fr) minmax(0, 1.18fr);
    align-items: start;
    gap: clamp(32px, 5vw, 64px);
}

.product-media-column {
    width: min(100%, 560px);
    justify-self: end;
}

.product-image-card {
    position: relative;
    background: #eee9e1;
    border-color: rgba(176, 141, 87, 0.22);
    box-shadow: 0 22px 54px rgba(53, 44, 34, 0.13);
    aspect-ratio: 4 / 5;
    max-height: 610px;
}

.product-detail-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 700ms cubic-bezier(0.2, 0.6, 0.3, 1);
}

.product-image-card:hover .product-detail-image { transform: scale(1.015); }

.review-card {
    border-bottom-color: #b08d57;
    box-shadow: 0 8px 22px rgba(53, 44, 34, 0.06);
}

.related-products {
    margin-top: 96px;
    padding: 72px clamp(20px, 4vw, 58px);
    border: 1px solid #e7e0d6;
    background: #f7f3ed;
}

.related-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 42px;
}

.related-kicker {
    margin-bottom: 12px;
    color: #9a7c50;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
}

.related-heading h2 {
    color: #1a1a1a;
    font-family: "GFS Didot", Georgia, serif;
    font-size: clamp(34px, 4vw, 52px);
    font-weight: 400;
    line-height: 1;
}

.related-link {
    padding-bottom: 7px;
    border-bottom: 1px solid #b08d57;
    color: #36322d;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
}

.related-link span { margin-left: 14px; }
.related-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 28px 22px; }
.related-card {
    padding: 12px 12px 20px;
    border: 1px solid #e7e0d6;
    background: #fff;
    box-shadow: 0 10px 28px rgba(53, 44, 34, 0.07);
    transition: transform 300ms ease, box-shadow 300ms ease;
}
.related-card:hover { transform: translateY(-5px); box-shadow: 0 20px 42px rgba(53, 44, 34, 0.13); }

@media (max-width: 767px) {
    .product-detail-grid { grid-template-columns: 1fr; gap: 28px; }
    .product-media-column { width: min(100%, 420px); justify-self: center; }
    .product-image-card { width:100%;height:min(72vw,340px);max-height:none;aspect-ratio:auto; }
    .product-information {
        padding: 24px;
    }
    .related-products { margin-top: 64px; padding: 52px 18px; }
    .related-heading { align-items: flex-start; flex-direction: column; margin-bottom: 30px; }
    .related-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 12px; }
    .related-card { padding: 8px 8px 16px; }
}

@media (max-width: 480px) {
    .product-image-card { height:min(76vw,300px); }
    .product-detail-page{padding-top:24px;padding-bottom:36px}.product-detail-grid{gap:18px}.product-information{padding:20px}.product-information h1{font-size:28px;line-height:1.1}.product-information>p{font-size:17px;margin-bottom:18px}.product-card.bg-white{padding:18px}.related-products{margin-top:52px;padding:48px 0}.related-heading{padding:0 18px}.related-grid{display:flex;gap:14px;padding:0 18px 8px;overflow-x:auto;scroll-snap-type:x mandatory}.related-card{flex:0 0 78vw;scroll-snap-align:start}.related-grid::-webkit-scrollbar{display:none}
}
</style>
