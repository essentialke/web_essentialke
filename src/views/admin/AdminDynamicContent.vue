<template>
    <div class="container mx-auto">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Dynamic Content</h2>
            <button
                @click="openCreateModal"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
                Create Dynamic Content
            </button>
        </div>

        <Table :headers="dynamicContentHeaders" :items="dynamicContents">
            <template #actions="{ item }">
                <div class="flex items-center space-x-2">
                    <button
                        @click="editDynamicContent(item)"
                        class="text-blue-500 hover:text-blue-700"
                    >
                        Edit
                    </button>
                    <button
                        @click="deleteDynamicContent(item.id)"
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
                        editingDynamicContent
                            ? "Edit Dynamic Content"
                            : "Create Dynamic Content"
                    }}
                </h3>
            </template>

            <DynamicContentForm
                :generalPost="editingDynamicContent"
                @save="saveDynamicContent"
                @cancel="closeModal"
            />
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Modal from "../../components/Modal.vue";
import DynamicContentForm from "../../components/admin/DynamicContentForm.vue"; // Import new form!
import Table from "../../components/admin/Table.vue";

const dynamicContents = ref([]);
const showModal = ref(false);
const editingDynamicContent = ref(null);

const dynamicContentHeaders = ref([
    { title: "ID", key: "id" },
    { title: "Title", key: "title" },
    { title: "Kind", key: "kind" },
    { title: "Slug", key: "slug" },
    { title: "Created At", key: "createdAt" },
    { title: "Actions", key: "actions" },
]);

onMounted(async () => {
    await fetchDynamicContent();
});

async function fetchDynamicContent() {
    try {
        const response = await axios.get("/general-posts"); // Fetching all general posts for now
        dynamicContents.value = response.data.posts.map((post) => ({
            ...post,
            createdAt: new Date(post.createdAt).toLocaleDateString(),
        }));
    } catch (error) {
        console.error("Error fetching dynamic content:", error);
    }
}

function openCreateModal() {
    editingDynamicContent.value = null;
    showModal.value = true;
}

function editDynamicContent(dynamicContent) {
    editingDynamicContent.value = { ...dynamicContent };
    showModal.value = true;
}

async function saveDynamicContent() {
    await fetchDynamicContent();
    closeModal();
}

async function deleteDynamicContent(dynamicContentId) {
    if (!confirm("Are you sure you want to delete this dynamic content?"))
        return;

    try {
        await axios.delete(`/general-posts/${dynamicContentId}`);
        await fetchDynamicContent();
    } catch (error) {
        console.error("Error deleting dynamic content:", error);
    }
}

function closeModal() {
    showModal.value = false;
}
</script>
