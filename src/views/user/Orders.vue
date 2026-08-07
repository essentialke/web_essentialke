<template>
    <div class="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-gray-900">
            My Account Activity
        </h1>

        <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
            <div class="bg-white rounded-lg shadow p-4 sm:p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs sm:text-sm font-medium text-gray-600">
                            Total Orders
                        </p>
                        <p class="text-xl sm:text-2xl font-bold text-gray-900">
                            {{ totalOrdersCount }}
                        </p>
                    </div>
                    <div class="p-2 sm:p-3 bg-blue-50 rounded-full">
                        <font-awesome-icon
                            :icon="faReceipt"
                            class="h-4 w-4 sm:h-6 sm:w-6 text-blue-600"
                        />
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-4 sm:p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs sm:text-sm font-medium text-gray-600">
                            Vouchers Purchased
                        </p>
                        <p class="text-xl sm:text-2xl font-bold text-gray-900">
                            {{ userStats._count?.purchasedVouchers || 0 }}
                        </p>
                    </div>
                    <div class="p-2 sm:p-3 bg-green-50 rounded-full">
                        <font-awesome-icon
                            :icon="faTicketAlt"
                            class="h-4 w-4 sm:h-6 sm:w-6 text-green-600"
                        />
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-4 sm:p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs sm:text-sm font-medium text-gray-600">
                            Reviews Written
                        </p>
                        <p class="text-xl sm:text-2xl font-bold text-gray-900">
                            {{ userStats._count?.reviewsAuthored || 0 }}
                        </p>
                    </div>
                    <div class="p-2 sm:p-3 bg-indigo-50 rounded-full">
                        <font-awesome-icon
                            :icon="faPen"
                            class="h-4 w-4 sm:h-6 sm:w-6 text-indigo-600"
                        />
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-4 sm:p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs sm:text-sm font-medium text-gray-600">
                            Wishlist Items
                        </p>
                        <p class="text-xl sm:text-2xl font-bold text-gray-900">
                            {{ userStats._count?.wishlistItems || 0 }}
                        </p>
                    </div>
                    <div class="p-2 sm:p-3 bg-pink-50 rounded-full">
                        <font-awesome-icon
                            :icon="faHeart"
                            class="h-4 w-4 sm:h-6 sm:w-6 text-pink-600"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow">
            <div class="p-4 sm:p-6 border-b border-gray-200">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-900">
                    Order History
                </h2>
            </div>

            <div class="p-4 sm:p-6">
                <div v-if="isLoading" class="text-center py-8 text-gray-500">
                    Loading orders...
                </div>
                <div
                    v-else-if="orders.length === 0"
                    class="text-center py-8 text-gray-500"
                >
                    You haven't placed any orders yet.
                </div>

                <div v-else class="space-y-4 sm:space-y-6">
                    <div
                        v-for="transaction in orders"
                        :key="transaction.id"
                        class="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                        <div
                            class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2"
                        >
                            <div class="flex-1">
                                <span class="text-xs sm:text-sm text-gray-600"
                                    >Order ID: {{ transaction.id }} | Reference:
                                    #{{
                                        transaction.pesapalMerchantReference ||
                                        transaction.paymentReference ||
                                        "N/A"
                                    }}</span
                                >
                                <p class="text-sm text-gray-500">
                                    Placed on:
                                    {{
                                        formatDate(transaction.transactionDate)
                                    }}
                                </p>
                                <p
                                    class="text-base sm:text-lg font-medium text-gray-900 mt-1"
                                >
                                    KES
                                    {{
                                        transaction.amount?.toFixed(2) || "0.00"
                                    }}
                                </p>
                            </div>
                            <div
                                class="flex flex-col sm:items-end gap-1 mt-2 sm:mt-0 w-full sm:w-auto"
                            >
                                <span
                                    :class="getStatusClass(transaction.status)"
                                    class="px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-center w-full sm:w-auto"
                                >
                                    Order: {{ transaction.status || "N/A" }}
                                </span>
                                <span
                                    :class="
                                        getStatusClass(
                                            transaction.paymentStatus,
                                        )
                                    "
                                    class="px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-center w-full sm:w-auto"
                                >
                                    Payment:
                                    {{ transaction.paymentStatus || "N/A" }}
                                </span>
                            </div>
                        </div>

                        <div
                            v-if="
                                transaction.orderItems &&
                                transaction.orderItems.length > 0
                            "
                            class="space-y-4 border-t pt-4 mt-4"
                        >
                            <h4 class="text-sm font-medium text-gray-700 mb-2">
                                Items in this order:
                            </h4>
                            <div
                                v-for="item in transaction.orderItems"
                                :key="item.id"
                                class="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
                            >
                                <img
                                    :src="
                                        getImageUrl(
                                            item.product?.coverImageUrl,
                                        ) || '/placeholder.jpg'
                                    "
                                    class="w-full sm:w-16 h-40 sm:h-24 object-cover rounded border flex-shrink-0"
                                    alt="Product image"
                                    @error="onImageError"
                                />
                                <div class="flex-1 min-w-0">
                                    <h4
                                        class="font-medium text-gray-900 truncate"
                                    >
                                        {{
                                            item.product?.title ||
                                            "Product Information Unavailable"
                                        }}
                                    </h4>
                                    <p
                                        v-if="item.product?.author"
                                        class="text-sm text-gray-600 truncate"
                                    >
                                        {{ item.product?.author }}
                                    </p>
                                    <p
                                        v-if="item.product?.category"
                                        class="text-sm text-gray-500 truncate"
                                    >
                                        Category: {{ item.product?.category }}
                                    </p>
                                    <p class="text-sm text-gray-500 mt-1">
                                        Qty: {{ item.quantity }} × KES
                                        {{ item.price?.toFixed(2) || "0.00" }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div
                            v-else
                            class="text-sm text-gray-500 border-t pt-4 mt-4"
                        >
                            Order item details are not available for this
                            transaction.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../../stores/user";
import axios from "axios";
import {
    faReceipt,
    faTicketAlt,
    faHeart,
    faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const userStore = useUserStore();
const orders = ref([]);
const userStats = ref({ _count: {} });
const isLoading = ref(true);

const totalOrdersCount = computed(() => {
    return userStats.value?._count?.memberTransactions ?? orders.value.length;
});

onMounted(async () => {
    isLoading.value = true;
    if (userStore.isAuthenticated && userStore.user?.userId) {
        try {
            await Promise.all([fetchUserOrders(), fetchUserStats()]);
        } catch (error) {
            console.error("Error during initial data fetch:", error);
        } finally {
            isLoading.value = false;
        }
    } else {
        console.warn("User not authenticated or userId missing.");
        isLoading.value = false;
    }
});

async function fetchUserStats() {
    if (!userStore.user?.userId) return;
    try {
        const response = await axios.get("/users/my-stats");
        userStats.value =
            response.data && response.data._count
                ? response.data
                : { _count: {} };
        console.log("User stats fetched:", userStats.value);
    } catch (error) {
        console.error("Error fetching user stats:", error);
        userStats.value = { _count: {} };
    }
}

async function fetchUserOrders() {
    if (!userStore.user?.userId) return;
    try {
        const response = await axios.get(
            `/transactions/user/${userStore.user.userId}`,
        );
        orders.value = response.data
            .filter((t) => t.type?.toLowerCase() === "purchase")
            .sort(
                (a, b) =>
                    new Date(b.transactionDate) - new Date(a.transactionDate),
            );
        console.log("Purchase orders found:", orders.value.length);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        orders.value = [];
    }
}

function formatDate(dateString) {
    if (!dateString) return "N/A";
    try {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return "Invalid Date";
    }
}

function getStatusClass(status) {
    const lowerStatus = status?.toLowerCase() || "unknown";
    switch (lowerStatus) {
        case "completed":
            return "bg-green-100 text-green-800";
        case "pending":
            return "bg-yellow-100 text-yellow-800";
        case "failed":
        case "invalid":
        case "reversed":
            return "bg-red-100 text-red-800";
        case "processing":
            return "bg-blue-100 text-blue-800";
        case "shipped":
            return "bg-purple-100 text-purple-800";
        case "delivered":
            return "bg-teal-100 text-teal-800";
        case "cancelled":
            return "bg-gray-100 text-gray-500";
        default:
            return "bg-gray-100 text-gray-800";
    }
}

const getImageUrl = computed(() => (coverImageUrl) => {
    if (!coverImageUrl) return "/placeholder.jpg";
    if (coverImageUrl.startsWith("http")) {
        return coverImageUrl;
    } else {
        const baseUrl = import.meta.env.DEV
            ? "http://localhost:3000"
            : import.meta.env.VITE_ASSET_URL;
        return `${baseUrl}${coverImageUrl}`;
    }
});

function onImageError(event) {
    event.target.src = "/placeholder.jpg";
}
</script>

<style scoped>
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
