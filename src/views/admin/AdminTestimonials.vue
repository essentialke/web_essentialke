<template>
    <div class="container mx-auto px-4 py-8">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Testimonials</h1>
            <p class="mt-1 text-sm text-gray-500">Manage the customer testimonials displayed on the storefront.</p>
        </div>
        <div v-if="loading" class="flex justify-center py-12"><div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div></div>
        <div v-else class="overflow-hidden rounded-lg bg-white p-6 shadow-md">
            <ContentTestimonialsForm :content="content" @saved="onSaved" @cancel="loadTestimonials" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import ContentTestimonialsForm from "@/components/admin/ContentTestimonialsForm.vue";

const loading = ref(true);
const content = ref({ testimonials: [] });

const loadTestimonials = async () => {
    loading.value = true;
    try {
        const response = await axios.get("/contents/testimonials");
        content.value = response.data.content;
    } catch (error) {
        if (error.response?.status === 404) content.value = { testimonials: [] };
        else console.error("Error loading testimonials:", error);
    } finally { loading.value = false; }
};

const onSaved = (data) => {
    content.value = data.content;
    alert("Testimonials saved successfully!");
};

onMounted(loadTestimonials);
</script>
