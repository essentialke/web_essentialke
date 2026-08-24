<template>
    <div class="container mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                v-for="(stat, index) in formattedStats"
                :key="index"
                :title="stat.title"
                :value="stat.value"
                :icon="stat.icon"
                :icon-color="stat.iconColor"
            />
        </div>

        <div class="mt-8">
            <HeroImageUploader />
        </div>

        <section class="mt-8" aria-labelledby="intasend-settings-heading">
            <AdminPaymentSettings
                heading-id="intasend-settings-heading"
                :embedded="true"
            />
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import StatCard from "../../components/admin/StatCard.vue";
import HeroImageUploader from "../../components/admin/HeroImageUploader.vue";
import AdminPaymentSettings from "./AdminPaymentSettings.vue";
import axios from "axios";

const stats = ref({
    totalUsers: 0,
    totalProducts: 0,
    totalTransactions: 0,
});

onMounted(async () => {
    await fetchDashboardStats();
});

async function fetchDashboardStats() {
    try {
        const [
            usersResponse,
            productsResponse,
            transactionsResponse,
        ] = await Promise.all([
            axios.get("/users/stats"), // Call the new endpoint
            axios.get("/products/stats"), // Call the new endpoint
            axios.get("/transactions/stats"), // Call the new endpoint
        ]);

        stats.value.totalUsers = usersResponse.data.totalUsers;
        stats.value.totalProducts = productsResponse.data.totalProducts;
        stats.value.totalTransactions =
            transactionsResponse.data.totalTransactions;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
    }
}

const formattedStats = computed(() => [
    {
        title: "Total Users",
        value: stats.value.totalUsers,
        icon: "users",
        iconColor: "text-blue-500",
    },
    {
        title: "Total Products",
        value: stats.value.totalProducts,
        icon: "product",
        iconColor: "text-green-500",
    },
    {
        title: "Total Transactions",
        value: stats.value.totalTransactions,
        icon: "shopping-cart",
        iconColor: "text-yellow-500",
    },
]);
</script>
