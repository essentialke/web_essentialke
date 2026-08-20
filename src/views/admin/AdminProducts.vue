<template>
    <div class="container mx-auto">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Products</h2>
            <button
                @click="openCreateModal"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
                Create Product
            </button>
        </div>

        <!-- Filtering Section -->
        <div class="bg-white p-4 rounded-lg shadow mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Title Filter -->
                <div>
                    <label
                        for="title"
                        class="block text-sm font-medium text-gray-700"
                        >Title</label
                    >
                    <input
                        type="text"
                        id="title"
                        v-model="filters.title"
                        placeholder="Search by title"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>

                <!-- Category Filter -->
                <div>
                    <label
                        for="category"
                        class="block text-sm font-medium text-gray-700"
                        >Category</label
                    >
                    <select
                        id="category"
                        v-model="filters.category"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                        <option value="">All Categories</option>
                        <option
                            v-for="category in categories"
                            :key="category.id"
                            :value="category.name"
                        >
                            {{ category.name }}
                        </option>
                    </select>
                </div>

                <!-- Shop Quantity Filter -->
                <div>
                    <label
                        for="shopQuantity"
                        class="block text-sm font-medium text-gray-700"
                        >Shop Stock</label
                    >
                    <select
                        id="shopQuantity"
                        v-model="filters.shopQuantity"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                        <option value="">All</option>
                        <option value="inStock">In Stock</option>
                        <option value="outOfStock">Out of Stock</option>
                        <option value="lowStock">Low Stock (< 5)</option>
                    </select>
                </div>

                <!-- Price Range Filters -->
                <div class="flex space-x-4 col-span-1 md:col-span-2">
                    <div class="flex-1">
                        <label
                            for="min-price"
                            class="block text-sm font-medium text-gray-700"
                            >Min Price</label
                        >
                        <input
                            type="number"
                            id="min-price"
                            v-model="filters.minPrice"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="KSh 0"
                        />
                    </div>
                    <div class="flex-1">
                        <label
                            for="max-price"
                            class="block text-sm font-medium text-gray-700"
                            >Max Price</label
                        >
                        <input
                            type="number"
                            id="max-price"
                            v-model="filters.maxPrice"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="KSh 999"
                        />
                    </div>
                </div>
            </div>

            <!-- Filter and Reset Buttons -->
            <div class="mt-4 flex justify-end space-x-2">
                <button
                    @click="resetFilters"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    Reset Filters
                </button>
                <button
                    @click="fetchProducts"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    Apply Filters
                </button>
            </div>
        </div>

        <!-- Table with Pagination -->
        <ProductTable
            :headers="productHeaders"
            :items="products"
            :total-items="totalProducts"
            :items-per-page="pagination.limit"
            :current-page="pagination.page"
            @page-changed="onPageChange"
        >
            <template #actions="{ item }">
                <div class="flex items-center space-x-2">
                    <button
                        @click="editProduct(item)"
                        class="text-blue-500 hover:text-blue-700"
                    >
                        Edit
                    </button>
                    <button
                        @click="deleteProduct(item.id)"
                        class="text-red-500 hover:text-red-700"
                    >
                        Delete
                    </button>
                </div>
            </template>
        </ProductTable>

        <!-- Create/Edit Product Modal -->
        <Modal :show="showModal" @close="closeModal">
            <template #header>
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                    {{ editingProduct ? "Edit Product" : "Create Product" }}
                </h3>
            </template>

            <ProductForm
                :product="editingProduct"
                :categories="categories"
                @save="saveProduct"
                @cancel="closeModal"
            />
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import axios from "axios";
import { activeLeafCategories, copyDefaultCategories } from "../../config/catalog";
import { useSnackbarStore } from "../../stores/snackbar";
import Modal from "../../components/Modal.vue";
import ProductForm from "../../components/admin/ProductForm.vue";
import ProductTable from "../../components/admin/ProductTable.vue";

const products = ref([]);
const snackbar = useSnackbarStore();
const showModal = ref(false);
const editingProduct = ref(null);
const totalProducts = ref(0);

const filters = ref({
    title: "",
    author: "",
    isbn: "",
    category: "",
    minPrice: null,
    maxPrice: null,
    ageRange: "",
    shopQuantity: "",
    libraryQuantity: "",
});

const pagination = reactive({
    page: 1,
    limit: 10,
});

const categories = ref([]);

// Define the table headers
const productHeaders = ref([
    { title: "ID", key: "id" },
    { title: "Title", key: "title" },
    { title: "Category", key: "category" },
    { title: "Price", key: "price" },
    { title: "Stock", key: "quantityShop" },
    { title: "Actions", key: "actions" },
]);

onMounted(async () => {
    await fetchCategories();
    await fetchProducts();
});

// Fetch categories from the CMS
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

async function fetchProducts() {
    try {
        // Build parameters for the API request
        const params = {
            ...filters.value,
            page: pagination.page,
            limit: pagination.limit,
        };

        // Remove shopQuantity and libraryQuantity as they're not direct API parameters
        delete params.shopQuantity;
        delete params.libraryQuantity;

        // Handle shop quantity filter
        if (filters.value.shopQuantity === "inStock") {
            params.minQuantityShop = 1; // At least 1 in stock
        } else if (filters.value.shopQuantity === "outOfStock") {
            params.minQuantityShop = 0;
            params.maxQuantityShop = 0; // Exactly 0 in stock
        } else if (filters.value.shopQuantity === "lowStock") {
            params.minQuantityShop = 1; // At least 1 in stock
            params.maxQuantityShop = 4; // But no more than 4
        }

        // Handle library quantity filter
        if (filters.value.libraryQuantity === "inStock") {
            params.minQuantityLibrary = 1; // At least 1 in stock
        } else if (filters.value.libraryQuantity === "outOfStock") {
            params.minQuantityLibrary = 0;
            params.maxQuantityLibrary = 0; // Exactly 0 in stock
        } else if (filters.value.libraryQuantity === "lowStock") {
            params.minQuantityLibrary = 1; // At least 1 in stock
            params.maxQuantityLibrary = 4; // But no more than 4
        }

        const response = await axios.get("/products", { params });

        // If backend doesn't support maxQuantity params, we'll need client-side filtering
        let filteredProducts = response.data.products;

        // Client-side filter for Shop quantity if needed
        if (
            filters.value.shopQuantity === "outOfStock" &&
            !params.maxQuantityShop
        ) {
            filteredProducts = filteredProducts.filter(
                (product) => product.quantityShop === 0,
            );
        } else if (
            filters.value.shopQuantity === "lowStock" &&
            !params.maxQuantityShop
        ) {
            filteredProducts = filteredProducts.filter(
                (product) =>
                    product.quantityShop > 0 && product.quantityShop < 5,
            );
        }

        // Client-side filter for Library quantity if needed
        if (
            filters.value.libraryQuantity === "outOfStock" &&
            !params.maxQuantityLibrary
        ) {
            filteredProducts = filteredProducts.filter(
                (product) => product.quantityLibraryTotal === 0,
            );
        } else if (
            filters.value.libraryQuantity === "lowStock" &&
            !params.maxQuantityLibrary
        ) {
            filteredProducts = filteredProducts.filter(
                (product) =>
                    product.quantityLibraryTotal > 0 &&
                    product.quantityLibraryTotal < 5,
            );
        }

        products.value = filteredProducts;

        // Update total count
        // If we've applied client-side filtering, use the filtered length
        // Otherwise use the total from the API
        if (
            (filters.value.shopQuantity && !params.maxQuantityShop) ||
            (filters.value.libraryQuantity && !params.maxQuantityLibrary)
        ) {
            totalProducts.value = filteredProducts.length;
        } else {
            totalProducts.value = response.data.total;
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function openCreateModal() {
    editingProduct.value = null;
    showModal.value = true;
}

function editProduct(product) {
    editingProduct.value = { ...product };
    showModal.value = true;
}

async function saveProduct(productData) {
    try {
        const headers = {
            "Content-Type": "multipart/form-data",
        };

        if (editingProduct.value) {
            // Update existing product
            await axios.put(
                `/products/${editingProduct.value.id}`,
                productData,
                {
                    headers,
                },
            );
        } else {
            // Create new product
            await axios.post("/products", productData, { headers });
        }
        await fetchProducts();
        closeModal();
        snackbar.addSnackbar({
            message: editingProduct.value
                ? "Product updated successfully"
                : "Product created successfully",
            type: "success",
        });
    } catch (error) {
        console.error("Error saving product:", error);
        snackbar.addSnackbar({
            message:
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Could not save product",
            type: "error",
        });
    }
}

async function deleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
        await axios.delete(`/products/${productId}`);
        await fetchProducts();
    } catch (error) {
        console.error("Error deleting product:", error);
    }
}

function closeModal() {
    showModal.value = false;
}

function onPageChange(newPage) {
    pagination.page = newPage;
    fetchProducts();
}

function resetFilters() {
    filters.value.title = "";
    filters.value.author = "";
    filters.value.isbn = "";
    filters.value.category = "";
    filters.value.minPrice = null;
    filters.value.maxPrice = null;
    filters.value.ageRange = "";
    filters.value.shopQuantity = "";
    filters.value.libraryQuantity = "";
    fetchProducts();
}

// Watch for filter changes
watch(
    filters,
    () => {
        // Reset to page 1 when filters change
        pagination.page = 1;
    },
    { deep: true },
);
</script>
