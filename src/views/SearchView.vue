<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl sm:text-3xl font-bold mb-4">
            Search Results for "{{ searchQuery }}"
        </h1>

        <div v-if="isLoading" class="text-center">Loading...</div>
        <div v-else-if="searchResults.length === 0" class="text-center">
            No results found.
        </div>
        <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
            <ProductCard
                v-for="product in searchResults"
                :key="product.id"
                :product="product"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import ProductCard from "../components/ProductCard.vue"; // Assuming you want to use the ProductCard component

const route = useRoute();
const searchQuery = ref(route.query.q);
const searchResults = ref([]);
const isLoading = ref(false);

onMounted(async () => {
    await searchProducts();
});

watch(
    () => route.query.q,
    async (newQuery) => {
        searchQuery.value = newQuery;
        await searchProducts();
    },
);

async function searchProducts() {
    isLoading.value = true;
    try {
        const response = await axios.get("/products/search", {
            params: {
                searchQuery: searchQuery.value,
            },
        });
        searchResults.value = response.data.products;
    } catch (error) {
        console.error("Error searching products:", error);
        searchResults.value = [];
    } finally {
        isLoading.value = false;
    }
}
</script>
