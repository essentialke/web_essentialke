<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import ContentCategoryForm from "../../components/admin/ContentCategoryForm.vue";
import { copyDefaultCategories } from "../../config/catalog";

const content = ref(null);
const loading = ref(true);
const error = ref("");
const notice = ref("");
const route = useRoute();
const collectionOnly = computed(() => route.path === "/admin/collections");
const load = async () => {
    loading.value = true;
    error.value = "";
    notice.value = "";
    try {
        content.value = (await axios.get("/contents/categories")).data.content;
    } catch (err) {
        if (err.response?.status === 404) content.value = { categories: copyDefaultCategories() };
        else error.value = "Could not load categories. Please try again.";
    } finally {
        loading.value = false;
    }
};
const saved = (response) => {
    content.value = response.content;
    notice.value = "Categories saved.";
};
onMounted(load);
</script>

<template>
    <div class="container mx-auto space-y-4">
        <p v-if="loading" role="status">Loading categories...</p>
        <div v-else-if="error" role="alert" class="text-red-700">
            {{ error }} <button type="button" class="underline" @click="load">Retry</button>
        </div>
        <template v-else>
            <p v-if="notice" role="status" class="text-green-700">{{ notice }}</p>
            <ContentCategoryForm :content="content" :collection-only="collectionOnly" @saved="saved" @cancel="load" />
        </template>
    </div>
</template>
