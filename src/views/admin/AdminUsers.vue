<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Users</h2>
            <button
                @click="openCreateModal"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
                Create User
            </button>
        </div>
        <!-- Filtering Section -->
        <div class="bg-white p-4 rounded-lg shadow mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label
                        for="name"
                        class="block text-sm font-medium text-gray-700"
                        >Name</label
                    >
                    <input
                        type="text"
                        id="name"
                        v-model="filters.name"
                        placeholder="Search by name"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium text-gray-700"
                        >Email</label
                    >
                    <input
                        type="email"
                        id="email"
                        v-model="filters.email"
                        placeholder="Search by email"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        for="userType"
                        class="block text-sm font-medium text-gray-700"
                        >Role</label
                    >
                    <select
                        id="userType"
                        v-model="filters.userType"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                        <option value="">All</option>
                        <option value="ADMIN">Admin</option>
                        <option value="MEMBER">Member</option>
                        <option value="CHILD">Child</option>
                    </select>
                </div>
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
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>
            <div class="mt-4 flex justify-end space-x-2">
                <button
                    @click="resetFilters"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    Reset
                </button>
                <button
                    @click="fetchUsers"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    Apply Filters
                </button>
            </div>
        </div>

        <!-- Table with Pagination -->
        <Table
            :headers="userHeaders"
            :items="users"
            :total-items="totalUsers"
            :items-per-page="pagination.limit"
            :current-page="pagination.page"
            @page-changed="onPageChange"
        >
            <template #actions="{ item }">
                <button
                    @click="editUser(item)"
                    class="text-blue-500 hover:text-blue-700 mr-2"
                >
                    Edit
                </button>
                <button
                    @click="deleteUser(item.id)"
                    class="text-red-500 hover:text-red-700"
                >
                    Delete
                </button>
            </template>
        </Table>

        <!-- Create/Edit User Modal -->
        <Modal :show="showModal" @close="closeModal">
            <template #header>
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                    {{ editingUser ? "Edit User" : "Create User" }}
                </h3>
            </template>

            <UserForm
                :user="editingUser"
                @save="saveUser"
                @cancel="closeModal"
            />
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import axios from "axios";
import Modal from "../../components/Modal.vue";
import UserForm from "../../components/admin/UserForm.vue";
import Table from "../../components/admin/Table.vue"; // Import the Table component

const users = ref([]);
const showModal = ref(false);
const editingUser = ref(null);
const totalUsers = ref(0);

const filters = ref({
    name: "",
    email: "",
    userType: "",
    status: "",
});

const pagination = reactive({
    page: 1,
    limit: 10,
});

// Define the table headers
const userHeaders = ref([
    { title: "ID", key: "id" },
    { title: "Name", key: "name" },
    { title: "Email", key: "email" },
    { title: "Role", key: "userType" },
    { title: "Status", key: "status" }, // Add status to table headers
    { title: "Actions", key: "actions" },
]);

onMounted(async () => {
    await fetchUsers();
});

async function fetchUsers() {
    try {
        const response = await axios.get("/users", {
            params: {
                ...filters.value,
                page: pagination.page,
                limit: pagination.limit,
            },
        });
        users.value = response.data.users;
        totalUsers.value = response.data.total;
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

function openCreateModal() {
    editingUser.value = null; // Reset in case of previous edits
    showModal.value = true;
}

function editUser(user) {
    editingUser.value = { ...user }; // Copy to avoid direct modification
    showModal.value = true;
}

async function saveUser(userData) {
    try {
        if (editingUser.value) {
            // Update existing user
            await axios.put(`/users/${editingUser.value.id}`, userData);
        } else {
            // Create new user
            await axios.post("/users/register", userData);
        }
        await fetchUsers(); // Refresh the user list
        closeModal();
    } catch (error) {
        console.error("Error saving user:", error);
    }
}

async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
        await axios.delete(`/users/${userId}`);
        await fetchUsers(); // Refresh the user list
    } catch (error) {
        console.error("Error deleting user:", error);
    }
}

function closeModal() {
    showModal.value = false;
}

function onPageChange(newPage) {
    pagination.page = newPage;
    fetchUsers();
}

function resetFilters() {
    filters.value.name = "";
    filters.value.email = "";
    filters.value.userType = "";
    filters.value.status = "";
    fetchUsers();
}

// Watch for filter changes
watch(filters, () => {
    // Reset to page 1 when filters change
    pagination.page = 1;
    fetchUsers();
});
</script>
