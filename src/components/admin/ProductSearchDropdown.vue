<template>
    <div class="relative">
        <label :for="id" class="block text-sm font-medium text-gray-700">{{
            label
        }}</label>

        <div class="mt-1 relative">
            <input
                :id="id"
                type="text"
                v-model="searchText"
                @focus="showDropdown = true"
                @input="debounceSearch"
                placeholder="Search for a product..."
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />

            <div v-if="isLoading" class="absolute right-2 top-2">
                <svg
                    class="animate-spin h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    ></circle>
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            </div>
        </div>

        <div
            v-if="showDropdown && filteredBooks.length > 0"
            class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
        >
            <div
                v-for="product in filteredBooks"
                :key="product.id"
                @click="selectBook(product)"
                class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
            >
                <div class="flex items-center">
                    <span class="ml-3 block truncate">{{ product.title }}</span>
                </div>

                <span
                    v-if="modelValue === product.id"
                    class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600"
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
                </span>
            </div>
        </div>

        <div
            v-else-if="
                showDropdown &&
                searchText &&
                !isLoading &&
                filteredBooks.length === 0
            "
            class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 sm:text-sm"
        >
            <div class="py-2 px-3 text-gray-500">
                No products found matching your search
            </div>
        </div>

        <span v-if="errorMessage" class="text-red-500 text-xs">{{
            errorMessage
        }}</span>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import axios from "axios";

const props = defineProps({
    modelValue: [String, Number],
    label: {
        type: String,
        default: "Book",
    },
    id: {
        type: String,
        default: "productSearch",
    },
    required: {
        type: Boolean,
        default: false,
    },
    errorMessage: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["update:modelValue"]);

const searchText = ref("");
const showDropdown = ref(false);
const isLoading = ref(false);
const products = ref([]);
const timeoutId = ref(null);
const selectedBook = ref(null);

// Initial products fetch (minimal amount)
onMounted(async () => {
    await fetchInitialBooks();
    if (props.modelValue) {
        await fetchSelectedBook(props.modelValue);
    }
});

watch(
    () => props.modelValue,
    async (newValue) => {
        if (
            newValue &&
            (!selectedBook.value || selectedBook.value.id !== newValue)
        ) {
            await fetchSelectedBook(newValue);
        } else if (!newValue) {
            selectedBook.value = null;
            searchText.value = "";
        }
    },
);

const filteredBooks = computed(() => {
    return products.value;
});

// Fetch initial set of products (e.g., most popular or recently added)
async function fetchInitialBooks() {
    isLoading.value = true;
    try {
        const response = await axios.get("/products", {
            params: {
                limit: 10, // Fetch a limited amount initially
            },
        });
        products.value = response.data.products || [];
    } catch (error) {
        console.error("Error fetching initial products:", error);
    } finally {
        isLoading.value = false;
    }
}

// Fetch the selected product details if we only have the ID
async function fetchSelectedBook(productId) {
    if (!productId) return;

    try {
        const response = await axios.get(`/products/${productId}`);
        if (response.data) {
            selectedBook.value = response.data;
            searchText.value = response.data.title;

            // Add to products list if not already there
            if (
                !products.value.some(
                    (product) => product.id === response.data.id,
                )
            ) {
                products.value.push(response.data);
            }
        }
    } catch (error) {
        console.error("Error fetching selected product:", error);
    }
}

// Debounce search to prevent too many API calls
function debounceSearch() {
    if (timeoutId.value) {
        clearTimeout(timeoutId.value);
    }

    timeoutId.value = setTimeout(() => {
        searchBooks();
    }, 300);
}

// Search products from API
async function searchBooks() {
    if (!searchText.value || searchText.value.trim() === "") {
        await fetchInitialBooks();
        return;
    }

    isLoading.value = true;
    try {
        const response = await axios.get("/products/search", {
            params: {
                searchQuery: searchText.value,
            },
        });
        products.value = response.data.products || [];
    } catch (error) {
        console.error("Error searching products:", error);
    } finally {
        isLoading.value = false;
    }
}

// Handle product selection
function selectBook(product) {
    selectedBook.value = product;
    searchText.value = product.title;
    emit("update:modelValue", product.id);
    showDropdown.value = false;
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
    if (event.target.closest(`#${props.id}`) === null) {
        showDropdown.value = false;
    }
}

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>
