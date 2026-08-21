<template>
    <div class="container mx-auto">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Discount Codes</h2>
            <button
                @click="openCreateModal"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
                Create Discount Code
            </button>
        </div>

        <Table :headers="discountCodeHeaders" :items="discountCodes">
            <template #actions="{ item }">
                <div class="flex items-center space-x-2">
                    <button
                        @click="editDiscountCode(item)"
                        class="text-blue-500 hover:text-blue-700"
                    >
                        Edit
                    </button>
                    <button
                        @click="deleteDiscountCode(item.id)"
                        class="text-red-500 hover:text-red-700"
                    >
                        Delete
                    </button>
                </div>
            </template>
        </Table>

        <Modal :show="showModal" @close="closeModal">
            <template #header>
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                    {{
                        editingDiscountCode
                            ? "Edit Discount Code"
                            : "Create Discount Code"
                    }}
                </h3>
            </template>

            <DiscountCodeForm
                :discountCode="editingDiscountCode"
                @save="saveDiscountCode"
                @cancel="closeModal"
            />
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Modal from "../../components/Modal.vue";
import DiscountCodeForm from "../../components/admin/DiscountCodeForm.vue";
import Table from "../../components/admin/Table.vue";

const discountCodes = ref([]);
const showModal = ref(false);
const editingDiscountCode = ref(null);

const discountCodeHeaders = ref([
    { title: "ID", key: "id" },
    { title: "Code", key: "code" },
    { title: "Type", key: "type" },
    { title: "Value", key: "value" },
    { title: "Valid From", key: "validFrom" },
    { title: "Valid Until", key: "validUntil" },
    { title: "Active", key: "isActive" },
    { title: "Actions", key: "actions" },
]);

onMounted(async () => {
    await fetchDiscountCodes();
});

async function fetchDiscountCodes() {
    try {
        const response = await axios.get("/discountcodes");
        discountCodes.value = response.data;
    } catch (error) {
        console.error("Error fetching discount codes:", error);
    }
}

function openCreateModal() {
    editingDiscountCode.value = null;
    showModal.value = true;
}

function editDiscountCode(discountCode) {
    editingDiscountCode.value = { ...discountCode };
    showModal.value = true;
}

async function saveDiscountCode(discountCodeData) {
    try {
        if (editingDiscountCode.value) {
            await axios.put(
                `/discountcodes/${editingDiscountCode.value.id}`,
                discountCodeData,
            );
        } else {
            await axios.post("/discountcodes", discountCodeData);
        }
        await fetchDiscountCodes();
        closeModal();
    } catch (error) {
        console.error("Error saving discount code:", error);
    }
}

async function deleteDiscountCode(discountCodeId) {
    if (!confirm("Are you sure you want to delete this discount code?")) return;

    try {
        await axios.delete(`/discountcodes/${discountCodeId}`);
        await fetchDiscountCodes();
    } catch (error) {
        console.error("Error deleting discount code:", error);
    }
}

function closeModal() {
    showModal.value = false;
}
</script>
