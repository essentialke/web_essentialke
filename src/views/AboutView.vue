<template>
    <div class="container mx-auto px-4 py-12">
        <div v-if="loading" class="animate-pulse">
            <div class="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div class="space-y-4">
                <div class="h-4 bg-gray-200 rounded w-full"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                <div class="h-4 bg-gray-200 rounded w-4/6"></div>
                <div class="h-64 bg-gray-200 rounded w-full my-8"></div>
                <div class="h-4 bg-gray-200 rounded w-full"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
        </div>

        <div v-else-if="error" class="text-center py-16">
            <div class="text-red-500 text-xl font-semibold mb-4">
                {{ error }}
            </div>
            <button
                @click="fetchAboutPage"
                class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
            >
                Try Again
            </button>
        </div>

        <div v-else-if="pageContent" class="max-w-4xl mx-auto">
            <!-- Featured Image (if available) -->
            <div v-if="pageContent.imageUrl" class="mb-10">
                <img
                    :src="getImageUrl(pageContent.imageUrl)"
                    :alt="pageContent.title"
                    class="w-full h-auto rounded-lg shadow-md"
                />
            </div>

            <!-- Page Title -->
            <h1
                class="text-4xl font-display-serif font-bold mb-8 text-gray-800"
            >
                {{ pageContent.title }}
            </h1>

            <!-- Page Content -->
            <div
                class="prose prose-lg max-w-none"
                v-html="sanitizedContent"
            ></div>
        </div>

        <div v-else class="text-center py-16">
            <p class="text-gray-600">No page content found.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import DOMPurify from "dompurify";
import { useSnackbarStore } from "../stores/snackbar";

const snackbarStore = useSnackbarStore();
const pageContent = ref(null);
const loading = ref(true);
const error = ref(null);

// Configure DOMPurify for safer content rendering
const sanitizedContent = computed(() => {
    if (!pageContent.value?.content) return "";

    return DOMPurify.sanitize(pageContent.value.content, {
        ALLOWED_TAGS: [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "p",
            "div",
            "span",
            "ul",
            "ol",
            "li",
            "blockquote",
            "pre",
            "code",
            "a",
            "strong",
            "em",
            "b",
            "i",
            "u",
            "strike",
            "br",
            "hr",
            "table",
            "thead",
            "tbody",
            "tr",
            "th",
            "td",
        ],
        ALLOWED_ATTR: ["href", "target", "rel", "class", "id", "style"],
    });
});

const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) {
        return imageUrl;
    } else {
        const baseUrl = import.meta.env.DEV
            ? "http://localhost:3000"
            : import.meta.env.VITE_ASSET_URL;
        return `${baseUrl}${imageUrl}`;
    }
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const fetchAboutPage = async () => {
    loading.value = true;
    error.value = null;

    try {
        // This endpoint should be the one that gets a single page by kind/slug
        const response = await axios.get("/general-posts/dynamic-content", {
            params: {
                kind: "page",
                slug: "about-us",
            },
        });

        if (response.data) {
            pageContent.value = response.data;
        } else {
            error.value = "About page content not found";
        }
    } catch (err) {
        console.error("Error fetching about page:", err);
        error.value = "Failed to load about page content";
        snackbarStore.addSnackbar({
            message: "Error loading about page. Please try again later.",
            type: "error",
        });
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchAboutPage();
});
</script>

<style scoped>
.prose :deep(h1) {
    font-size: 2.25rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
    line-height: 1.2;
}

.prose :deep(h2) {
    font-size: 1.875rem;
    font-weight: 600;
    margin-top: 1.75rem;
    margin-bottom: 1rem;
    line-height: 1.3;
}

.prose :deep(h3) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
}

.prose :deep(p) {
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 1.7;
}

.prose :deep(ul),
.prose :deep(ol) {
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
}

.prose :deep(li) {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
}

.prose :deep(blockquote) {
    border-left: 4px solid #e2e8f0;
    padding-left: 1rem;
    font-style: italic;
    margin: 1.5rem 0;
}

.prose :deep(a) {
    color: #4f46e5;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
}

.prose :deep(a:hover) {
    text-decoration-thickness: 2px;
}

.prose :deep(pre) {
    background-color: #1e293b;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 0.375rem;
    overflow-x: auto;
    margin: 1.5rem 0;
}

.prose :deep(hr) {
    margin: 2rem 0;
    border-top: 1px solid #e2e8f0;
}

.prose :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
}

.prose :deep(th),
.prose :deep(td) {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
}

.prose :deep(th) {
    background-color: #f8fafc;
    font-weight: 600;
}
</style>
