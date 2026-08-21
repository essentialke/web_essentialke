<template>
    <div class="container mx-auto">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">General Posts</h2>
            <button
                @click="openCreateModal"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
                Create General Post
            </button>
        </div>

        <Table :headers="generalPostHeaders" :items="generalPosts">
            <template #actions="{ item }">
                <div class="flex items-center space-x-2">
                    <button
                        @click="editGeneralPost(item)"
                        class="text-blue-500 hover:text-blue-700"
                    >
                        Edit
                    </button>
                    <button
                        @click="deleteGeneralPost(item.id)"
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
                        editingGeneralPost
                            ? "Edit General Post"
                            : "Create General Post"
                    }}
                </h3>
            </template>

            <GeneralPostForm
                :generalPost="editingGeneralPost"
                @save="saveGeneralPost"
                @cancel="closeModal"
            />
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Modal from "../../components/Modal.vue";
import GeneralPostForm from "../../components/admin/GeneralPostForm.vue";
import Table from "../../components/admin/Table.vue";

const generalPosts = ref([]);
const showModal = ref(false);
const editingGeneralPost = ref(null);

const generalPostHeaders = ref([
    { title: "ID", key: "id" },
    { title: "Title", key: "title" },
    { title: "Published", key: "published" },
    { title: "Created At", key: "createdAt" },
    { title: "Actions", key: "actions" },
]);

onMounted(async () => {
    await fetchGeneralPosts();
});

async function fetchGeneralPosts() {
    try {
        const response = await axios.get("/general-posts");
        generalPosts.value = response.data.posts.map((post) => ({
            ...post,
            createdAt: new Date(post.createdAt).toLocaleDateString(),
        }));
    } catch (error) {
        console.error("Error fetching general posts:", error);
    }
}

function openCreateModal() {
    editingGeneralPost.value = null;
    showModal.value = true;
}

function editGeneralPost(generalPost) {
    editingGeneralPost.value = { ...generalPost };
    showModal.value = true;
}

async function saveGeneralPost() {
    await fetchGeneralPosts();
    closeModal();
}

async function deleteGeneralPost(generalPostId) {
    if (!confirm("Are you sure you want to delete this general post?")) return;

    try {
        await axios.delete(`/general-posts/${generalPostId}`);
        await fetchGeneralPosts();
    } catch (error) {
        console.error("Error deleting general post:", error);
    }
}

function closeModal() {
    showModal.value = false;
}
</script>
