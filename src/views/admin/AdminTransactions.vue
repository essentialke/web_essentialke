<template>
    <div class="container mx-auto">
        <h2 class="text-2xl font-bold mb-4">Transactions</h2>

        <!-- Filtering and Search -->
        <div class="bg-white p-4 rounded-lg shadow mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">                
                <div>
                    <label
                        for="status"
                        class="block text-sm font-medium text-gray-700"
                        >Status</label
                    >
                    <select
                        id="status"
                        v-model="filters.status"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                        <option value="active">Active</option>
                        <option value="returned">Returned</option>
                    </select>
                </div>
                <div>
                    <label
                        for="search"
                        class="block text-sm font-medium text-gray-700"
                        >Search</label
                    >
                    <input
                        type="text"
                        id="search"
                        v-model="filters.search"
                        placeholder="Search by ID, user, product..."
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        for="pageSize"
                        class="block text-sm font-medium text-gray-700"
                        >Items Per Page</label
                    >
                    <select
                        id="pageSize"
                        v-model="pagination.pageSize"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                        <option :value="10">10</option>
                        <option :value="25">25</option>
                        <option :value="50">50</option>
                        <option :value="100">100</option>
                    </select>
                </div>
            </div>
            <div class="mt-4 flex justify-end">
                <button
                    @click="applyFilters"
                    class="mr-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    Apply Filters
                </button>
                <button
                    @click="resetFilters"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    Reset Filters
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-10">
            <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
            ></div>
        </div>

        <!-- Empty State -->
        <div
            v-else-if="!transactions.length"
            class="bg-white p-8 rounded-lg shadow text-center"
        >
            <p class="text-lg text-gray-600">No transactions found</p>
        </div>

        <!-- Transactions Table -->
        <Table
            v-else
            :headers="transactionHeaders"
            :items="transactions"
            :itemsPerPage="pagination.pageSize"
            :totalItems="pagination.totalItems"
            :currentPage="pagination.page"
            @page-changed="handlePageChange"
        >
            <template #actions="{ item }">
                <button
                    @click="viewDetails(item)"
                    class="text-blue-500 hover:text-blue-700"
                >
                    View Details
                </button>
            </template>
        </Table>

        <!-- Transaction Details Modal -->
        <Modal :show="showDetailsModal" @close="closeDetailsModal">
            <template #header>
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                    Transaction Details
                </h3>
            </template>
            <TransactionDetails :transaction="selectedTransaction" />
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import Table from "../../components/admin/TableTx.vue";
import Modal from "../../components/Modal.vue";
import TransactionDetails from "../../components/admin/TransactionDetails.vue";

const transactions = ref([]);
const showDetailsModal = ref(false);
const selectedTransaction = ref(null);
const loading = ref(false);

const filters = ref({
    type: "",
    status: "",
    search: "",
});

const pagination = ref({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
});

const transactionHeaders = ref([
    { title: "ID", key: "id" },
    { title: "User", key: "member.name" },
    { title: "Product", key: "orderItems[0].product.title" },
    { title: "Type", key: "type" },
    { title: "Status", key: "status" },
    { title: "Amount", key: "amount", format: "currency" },
    { title: "Date", key: "transactionDate", format: "datetime" },
    { title: "Actions", key: "actions" },
]);

onMounted(async () => {
    await fetchTransactions();
});

async function fetchTransactions() {
    loading.value = true;
    try {
        // Prepare query parameters for API request
        const params = {
            page: pagination.value.page,
            pageSize: pagination.value.pageSize,
            ...filters.value,
        };

        // Remove empty filters
        Object.keys(params).forEach((key) => {
            if (params[key] === "") {
                delete params[key];
            }
        });

        const response = await axios.get("/transactions", { params });

        // Update with paginated data from backend
        transactions.value = response.data.data;

        // Update pagination info
        pagination.value.totalItems = response.data.pagination.totalCount;
        pagination.value.totalPages = response.data.pagination.totalPages;
    } catch (error) {
        console.error("Error fetching transactions:", error);
    } finally {
        loading.value = false;
    }
}

function viewDetails(transaction) {
    selectedTransaction.value = transaction;
    showDetailsModal.value = true;
}

function closeDetailsModal() {
    showDetailsModal.value = false;
    selectedTransaction.value = null;
    fetchTransactions();
}

function resetFilters() {
    filters.value.type = "";
    filters.value.status = "";
    filters.value.search = "";
    pagination.value.page = 1;
    fetchTransactions();
}

function applyFilters() {
    pagination.value.page = 1; // Reset to first page when applying new filters
    fetchTransactions();
}

function handlePageChange(page) {
    pagination.value.page = page;
    fetchTransactions();
}

// Watch for page size changes
watch(
    () => pagination.value.pageSize,
    () => {
        pagination.value.page = 1; // Reset to first page when changing page size
        fetchTransactions();
    },
);
</script>
