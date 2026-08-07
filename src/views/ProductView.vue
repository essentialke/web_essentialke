<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import axios from "axios";
import ProductCard from "../components/ProductCard.vue";
import { activeLeafCategories, copyDefaultCategories } from "../config/catalog";

const route = useRoute();

const products = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(12);
const totalProducts = ref(0);
const selectedCategory = ref("");
const minPrice = ref("");
const maxPrice = ref("");
const selectedAuthor = ref("");
const selectedSortBy = ref("");
const selectedSortOrder = ref("asc");
const isMobileFilterOpen = ref(false);

// Replace hardcoded categories with a dynamic ref
const categories = ref([]);

// Track active filters for UI indicators
const hasActiveFilters = computed(() => {
    return (
        selectedCategory.value ||
        minPrice.value ||
        maxPrice.value ||
        selectedAuthor.value ||
        selectedSortBy.value ||
        selectedSortOrder.value !== "asc"
    );
});

// Computed property for total pages
const totalPages = computed(() => {
    return Math.ceil(totalProducts.value / pageSize.value);
});

// Computed property for pagination array
const paginationArray = computed(() => {
    const result = [];
    const maxVisiblePages = 5;

    if (totalPages.value <= maxVisiblePages) {
        // Show all pages if we have less than maxVisiblePages
        for (let i = 1; i <= totalPages.value; i++) {
            result.push(i);
        }
    } else {
        // Always include first page
        result.push(1);

        // Calculate start and end of visible page numbers
        let start = Math.max(2, currentPage.value - 1);
        let end = Math.min(totalPages.value - 1, start + maxVisiblePages - 3);

        // Adjust start if end is maxed out
        start = Math.max(2, end - (maxVisiblePages - 3));

        // Add ellipsis if needed
        if (start > 2) {
            result.push("...");
        }

        // Add visible page numbers
        for (let i = start; i <= end; i++) {
            result.push(i);
        }

        // Add ellipsis if needed
        if (end < totalPages.value - 1) {
            result.push("...");
        }

        // Always include last page if there's more than one page
        if (totalPages.value > 1) {
            result.push(totalPages.value);
        }
    }

    return result;
});

onMounted(async () => {
    selectedCategory.value = route.query.category?.toString() || "";
    selectedSortBy.value = route.query.sortBy?.toString() || "";
    selectedSortOrder.value = route.query.sortOrder?.toString() || "asc";
    await fetchCategories();
    await loadProducts();

    // Add event listener to close filter on body click on mobile
    document.body.addEventListener("click", (e) => {
        if (isMobileFilterOpen.value && window.innerWidth < 1024) {
            // Check if the click was outside the filter panel
            const filterPanel = document.getElementById("mobile-filter-panel");
            const mobileFilterButton = document.getElementById(
                "mobile-filter-button",
            );

            if (
                filterPanel &&
                !filterPanel.contains(e.target) &&
                mobileFilterButton &&
                !mobileFilterButton.contains(e.target)
            ) {
                isMobileFilterOpen.value = false;
            }
        }
    });
});

// New function to fetch categories from the CMS
async function fetchCategories() {
    try {
        const response = await axios.get("/contents/categories");
        if (
            response.data &&
            response.data.content &&
            response.data.content.categories
        ) {
            // Get only active categories
            categories.value = activeLeafCategories(response.data.content.categories);
        } else {
            // Fallback to default categories if none are found
            categories.value = activeLeafCategories(copyDefaultCategories());
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to default categories if there's an error
        categories.value = activeLeafCategories(copyDefaultCategories());
    }
}

async function loadProducts() {
    isLoading.value = true;
    try {
        const response = await axios.get("/products", {
            params: {
                page: currentPage.value,
                limit: pageSize.value,
                category: selectedCategory.value,
                minPrice: minPrice.value,
                maxPrice: maxPrice.value,
                author: selectedAuthor.value,
                sortBy: selectedSortBy.value,
                sortOrder: selectedSortOrder.value,
                minQuantityShop: 0,
            },
        });
        products.value = response.data.products;
        totalProducts.value = response.data.total;
    } catch (error) {
        console.error("Error loading products:", error);
    } finally {
        isLoading.value = false;
    }
}

function goToPage(page) {
    if (page === "..." || page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetFilters() {
    selectedCategory.value = "";
    minPrice.value = "";
    maxPrice.value = "";
    selectedAuthor.value = "";
    selectedSortBy.value = "";
    selectedSortOrder.value = "asc";
    currentPage.value = 1;
    loadProducts();
    closeMobileFilter();
}

async function handleFilterChange() {
    currentPage.value = 1;
    await loadProducts();
}

function closeMobileFilter() {
    if (window.innerWidth < 1024) {
        isMobileFilterOpen.value = false;
    }
}

function selectCategory(categoryName) {
    selectedCategory.value =
        categoryName === selectedCategory.value ? "" : categoryName;
    handleFilterChange();
    closeMobileFilter();
}

// Function to apply a filter change and close mobile panel
async function applyFilterAndClose() {
    await handleFilterChange();
    closeMobileFilter();
}

// Watch for page changes to reload products
watch(currentPage, async () => {
    await loadProducts();
});

// Watch for page size changes to reset to first page and reload
watch(pageSize, async () => {
    currentPage.value = 1;
    await loadProducts();
    closeMobileFilter();
});

watch(
    () => route.query,
    async (query) => {
        selectedCategory.value = query.category?.toString() || "";
        selectedSortBy.value = query.sortBy?.toString() || "";
        selectedSortOrder.value = query.sortOrder?.toString() || "asc";
        currentPage.value = 1;
        await loadProducts();
    },
);
</script>

<template>
    <div class="min-h-screen bg-gray-50 py-8 md:py-12">
        <div class="container mx-auto px-4 max-w-7xl">
            <!-- Header Section -->
            <h1
                class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8 tracking-tight"
            >
                Explore Products For Sale
                <span
                    class="block text-base md:text-lg font-normal text-gray-600 mt-2"
                >
                    Discover your next favorite read
                </span>
            </h1>

            <!-- Main Content with Sidebar Layout -->
            <div class="flex flex-col lg:flex-row gap-6 md:gap-8">
                <!-- Mobile Filter Button with badge for active filters -->
                <button
                    id="mobile-filter-button"
                    @click.stop="isMobileFilterOpen = !isMobileFilterOpen"
                    class="lg:hidden w-full mb-4 px-4 py-3 bg-white rounded-lg shadow-sm text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                    </svg>
                    {{ isMobileFilterOpen ? "Hide Filters" : "Show Filters" }}
                    <span
                        v-if="hasActiveFilters && !isMobileFilterOpen"
                        class="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full ml-1"
                    >
                        •
                    </span>
                </button>

                <!-- Sidebar Filters -->
                <aside
                    id="mobile-filter-panel"
                    :class="{
                        'transform translate-x-0': isMobileFilterOpen,
                        'transform -translate-x-full': !isMobileFilterOpen,
                    }"
                    class="lg:w-64 flex-shrink-0 fixed lg:sticky lg:transform-none lg:translate-x-0 top-0 lg:top-24 left-0 h-full lg:h-auto z-40 bg-gray-50 lg:bg-transparent transition-transform duration-300 ease-in-out"
                >
                    <div
                        class="bg-white p-6 rounded-xl shadow-sm h-full lg:h-auto overflow-y-auto"
                    >
                        <!-- Close button for mobile -->
                        <div
                            class="flex justify-between items-center mb-6 lg:hidden pt-14"
                        >
                            <h2 class="text-lg font-semibold text-gray-900">
                                Filters
                            </h2>
                            <button
                                @click.stop="isMobileFilterOpen = false"
                                class="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <svg
                                    class="w-6 h-6"
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

                        <!-- Filter Content -->
                        <div class="space-y-6">
                            <!-- Category Section Header with clear option -->
                            <div class="flex items-center justify-between">
                                <div
                                    class="font-semibold text-gray-800 uppercase text-sm tracking-wider"
                                >
                                    CATEGORY
                                </div>
                                <button
                                    v-if="selectedCategory"
                                    @click="
                                        selectedCategory = '';
                                        applyFilterAndClose();
                                    "
                                    class="text-xs text-primary hover:text-secondary font-medium"
                                >
                                    Clear
                                </button>
                            </div>

                            <!-- Categories List -->
                            <div class="space-y-1 -mt-3 pl-1">
                                <!-- All Categories Option -->
                                <div
                                    @click="selectCategory('')"
                                    :class="[
                                        'category-link',
                                        !selectedCategory
                                            ? 'font-medium text-primary'
                                            : '',
                                    ]"
                                >
                                    <span
                                        class="category-check"
                                        v-if="!selectedCategory"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            class="w-4 h-4"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                    All Categories
                                </div>

                                <!-- Individual Categories -->
                                <div
                                    v-for="category in categories"
                                    :key="category.id"
                                    @click="selectCategory(category.name)"
                                    :class="[
                                        'category-link',
                                        selectedCategory === category.name
                                            ? 'font-medium text-primary'
                                            : '',
                                    ]"
                                >
                                    <span
                                        class="category-check"
                                        v-if="
                                            selectedCategory === category.name
                                        "
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            class="w-4 h-4"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                    {{ category.name }}
                                </div>
                            </div>

                            <div class="border-t border-gray-200 my-4"></div>

                            <!-- Price Range with clear option -->
                            <div class="filter-section">
                                <div class="flex items-center justify-between">
                                    <label class="filter-label"
                                        >PRICE RANGE (KES)</label
                                    >
                                    <button
                                        v-if="minPrice || maxPrice"
                                        @click="
                                            minPrice = '';
                                            maxPrice = '';
                                            applyFilterAndClose();
                                        "
                                        class="text-xs text-primary hover:text-secondary font-medium"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div class="grid grid-cols-2 gap-3 mt-2">
                                    <div class="relative">
                                        <input
                                            type="number"
                                            v-model="minPrice"
                                            @change="applyFilterAndClose"
                                            class="filter-input pl-7"
                                            placeholder="Min"
                                        />
                                    </div>
                                    <div class="relative">
                                        <input
                                            type="number"
                                            v-model="maxPrice"
                                            @change="applyFilterAndClose"
                                            class="filter-input pl-7"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="border-t border-gray-200 my-4"></div>

                            <div class="border-t border-gray-200 my-4"></div>

                            <!-- Sort Controls with clear option -->
                            <div class="filter-section">
                                <div class="flex items-center justify-between">
                                    <label class="filter-label">SORT BY</label>
                                    <button
                                        v-if="
                                            selectedSortBy ||
                                            selectedSortOrder !== 'asc'
                                        "
                                        @click="
                                            selectedSortBy = '';
                                            selectedSortOrder = 'asc';
                                            applyFilterAndClose();
                                        "
                                        class="text-xs text-primary hover:text-secondary font-medium"
                                    >
                                        Reset
                                    </button>
                                </div>
                                <select
                                    v-model="selectedSortBy"
                                    @change="applyFilterAndClose"
                                    class="filter-select mt-2"
                                >
                                    <option value="">None</option>
                                    <option value="title">Title</option>
                                    <option value="price">Price</option>
                                </select>

                                <!-- Order Direction -->
                                <div
                                    class="flex items-center justify-between mt-4"
                                    v-if="selectedSortBy"
                                >
                                    <div class="text-xs text-gray-500">
                                        Order
                                    </div>
                                    <div class="flex space-x-2">
                                        <button
                                            @click="
                                                selectedSortOrder = 'asc';
                                                applyFilterAndClose();
                                            "
                                            :class="[
                                                'px-2 py-1 text-xs rounded-md',
                                                selectedSortOrder === 'asc'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                                            ]"
                                        >
                                            Ascending
                                        </button>
                                        <button
                                            @click="
                                                selectedSortOrder = 'desc';
                                                applyFilterAndClose();
                                            "
                                            :class="[
                                                'px-2 py-1 text-xs rounded-md',
                                                selectedSortOrder === 'desc'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                                            ]"
                                        >
                                            Descending
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="border-t border-gray-200 my-4"></div>

                            <!-- Page Size -->
                            <div class="filter-section">
                                <label class="filter-label"
                                    >PRODUCTS PER PAGE</label
                                >
                                <div class="flex space-x-2 mt-2">
                                    <button
                                        v-for="size in [12, 24, 48]"
                                        :key="size"
                                        @click="pageSize = size"
                                        :class="[
                                            'px-3 py-1 text-sm rounded-md transition-colors',
                                            pageSize === size
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                                        ]"
                                    >
                                        {{ size }}
                                    </button>
                                </div>
                            </div>

                            <!-- Reset Button -->
                            <button
                                @click="resetFilters"
                                :class="[
                                    'w-full mt-6 px-6 py-3 font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2',
                                    hasActiveFilters
                                        ? 'bg-primary hover:bg-secondary text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-500',
                                ]"
                                :disabled="!hasActiveFilters"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Reset All Filters
                            </button>
                        </div>
                    </div>
                </aside>

                <!-- Overlay for mobile filter - click anywhere to close -->
                <div
                    v-if="isMobileFilterOpen"
                    @click.stop="isMobileFilterOpen = false"
                    class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                ></div>

                <!-- Main Content -->
                <main class="flex-1">
                    <!-- Active Filters Summary (only show if filters active) -->
                    <div
                        v-if="hasActiveFilters"
                        class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center gap-2"
                    >
                        <span class="text-sm font-medium text-gray-700 mr-1"
                            >Active Filters:</span
                        >

                        <div v-if="selectedCategory" class="filter-tag">
                            <span>{{ selectedCategory }}</span>
                            <button
                                @click="
                                    selectedCategory = '';
                                    handleFilterChange();
                                "
                                class="ml-1"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-3 w-3"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div v-if="minPrice || maxPrice" class="filter-tag">
                            <span
                                >Price: {{ minPrice ? "$" + minPrice : "$0" }} -
                                {{ maxPrice ? "$" + maxPrice : "Any" }}</span
                            >
                            <button
                                @click="
                                    minPrice = '';
                                    maxPrice = '';
                                    handleFilterChange();
                                "
                                class="ml-1"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-3 w-3"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>


                        <div v-if="selectedSortBy" class="filter-tag">
                            <span
                                >Sort: {{ selectedSortBy }} ({{
                                    selectedSortOrder === "asc"
                                        ? "Asc"
                                        : "Desc"
                                }})</span
                            >
                            <button
                                @click="
                                    selectedSortBy = '';
                                    selectedSortOrder = 'asc';
                                    handleFilterChange();
                                "
                                class="ml-1"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-3 w-3"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>

                        <button
                            @click="resetFilters"
                            class="ml-auto text-xs text-primary hover:text-secondary font-medium"
                        >
                            Clear All
                        </button>
                    </div>

                    <!-- Product Grid -->
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
                    >
                        <ProductCard
                            v-for="product in products"
                            :key="product.id"
                            :product="product"
                        />
                    </div>

                    <!-- Loading State -->
                    <div
                        v-if="isLoading"
                        class="flex justify-center items-center py-12"
                    >
                        <div
                            class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
                        ></div>
                    </div>

                    <!-- Empty State -->
                    <div
                        v-if="!isLoading && products.length === 0"
                        class="flex flex-col items-center justify-center py-12 text-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-16 w-16 text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13c-1.168-.776-2.754-1.253-4.5-1.253-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                        <h3 class="text-xl font-medium text-gray-900 mb-2">
                            No products found
                        </h3>
                        <p class="text-gray-600 max-w-md">
                            We couldn't find any products matching your current
                            filters. Try adjusting your search criteria or
                            browsing our other categories.
                        </p>
                        <button
                            @click="resetFilters"
                            class="mt-6 px-6 py-2 bg-primary hover:bg-secondary text-white font-medium rounded-lg transition"
                        >
                            Reset Filters
                        </button>
                    </div>

                    <!-- Pagination -->
                    <div
                        v-if="!isLoading && products.length > 0"
                        class="mt-12 flex flex-col md:flex-row justify-between items-center gap-4"
                    >
                        <!-- Results summary -->
                        <div class="text-sm text-gray-600">
                            Showing {{ (currentPage - 1) * pageSize + 1 }}-{{
                                Math.min(currentPage * pageSize, totalProducts)
                            }}
                            of {{ totalProducts }} products
                        </div>

                        <!-- Pagination controls -->
                        <div class="flex items-center">
                            <!-- Previous page button -->
                            <button
                                @click="goToPage(currentPage - 1)"
                                :disabled="currentPage === 1"
                                :class="{
                                    'opacity-50 cursor-not-allowed':
                                        currentPage === 1,
                                }"
                                class="pagination-button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </button>

                            <!-- Page numbers -->
                            <div class="flex mx-1">
                                <button
                                    v-for="page in paginationArray"
                                    :key="page"
                                    @click="goToPage(page)"
                                    :class="[
                                        'pagination-button',
                                        page === currentPage
                                            ? 'bg-primary text-white'
                                            : 'bg-white text-gray-700',
                                        page === '...' ? 'cursor-default' : '',
                                    ]"
                                >
                                    {{ page }}
                                </button>
                            </div>

                            <!-- Next page button -->
                            <button
                                @click="goToPage(currentPage + 1)"
                                :disabled="currentPage === totalPages"
                                :class="{
                                    'opacity-50 cursor-not-allowed':
                                        currentPage === totalPages,
                                }"
                                class="pagination-button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<style scoped>
.filter-group {
    @apply flex flex-col gap-2;
}

.filter-label {
    @apply text-xs font-semibold text-gray-700 tracking-wider uppercase;
}

.filter-select {
    @apply block w-full pl-3 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm;
}

.filter-input {
    @apply block w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm;
}

.pagination-button {
    @apply w-10 h-10 flex items-center justify-center rounded-md mx-1 border border-gray-300 transition-colors hover:bg-gray-100;
}

.category-link {
    @apply py-2 cursor-pointer text-gray-700 hover:text-primary transition-colors flex items-center touch-manipulation;
}

.category-check {
    @apply text-primary mr-2 inline-block;
}

.filter-section {
    @apply space-y-1;
}

.filter-tag {
    @apply bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full flex items-center;
}

/* Add smooth scrolling to the body when mobile filter is open */
:global(body) {
    @apply scroll-smooth;
}

:global(body.filter-open) {
    @apply overflow-hidden;
}

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

/* Simple sticky behavior - no special scrollbar needed */
</style>
