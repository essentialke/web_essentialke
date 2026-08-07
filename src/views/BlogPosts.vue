<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold font-display-serif">
                Latest Articles
            </h1>
        </div>

        <!-- Blog Posts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
                v-for="post in posts"
                :key="post.id"
                class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 flex flex-col h-full"
            >
                <!-- Image Section -->
                <div class="relative h-[280px] overflow-hidden">
                    <RouterLink
                        :to="`/blog/${post.id}/${post.slug}`"
                        class="absolute inset-0"
                    >
                        <img
                            v-if="post.imageUrl"
                            :src="getImageUrl(post.imageUrl)"
                            :alt="post.title"
                            class="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                            loading="lazy"
                        />
                        <div
                            v-else
                            class="w-full h-full bg-gray-200 flex items-center justify-center"
                        >
                            <span class="text-gray-400"
                                >No image available</span
                            >
                        </div>
                        <!-- Hover Overlay -->
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        ></div>
                    </RouterLink>
                </div>

                <!-- Content Section -->
                <div class="p-6 flex flex-col flex-grow">
                    <!-- Category and Reading Time -->
                    <div class="text-primary text-sm mb-2">
                        <span>{{ post.category }}</span>
                        <span class="mx-2">•</span>
                        <span
                            >{{ formatReadingTime(post.content) }} min
                            read</span
                        >
                    </div>

                    <!-- Title -->
                    <h2 class="text-xl font-bold mb-3 line-clamp-2">
                        <RouterLink
                            :to="`/blog/${post.id}/${post.slug}`"
                            class="hover:text-primary transition-colors"
                        >
                            {{ post.title }}
                        </RouterLink>
                    </h2>

                    <!-- Excerpt -->
                    <div
                        class="text-gray-600 text-sm line-clamp-3 mb-4 prose prose-sm"
                        v-html="sanitizeHtml(post.content)"
                    ></div>

                    <!-- Author Info -->
                    <div
                        class="mt-auto pt-4 border-t border-gray-100 flex items-center"
                    >
                        <img
                            v-if="post.author?.avatar"
                            :src="getImageUrl(post.author.avatar)"
                            :alt="post.author.name"
                            class="w-10 h-10 rounded-full mr-3"
                        />
                        <div
                            v-else
                            class="w-10 h-10 rounded-full mr-3 bg-gray-200"
                        ></div>
                        <div>
                            <div class="font-medium">
                                {{ post.author?.name }}
                            </div>
                            <div class="text-sm text-gray-500">
                                {{ formatDate(post.createdAt) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && posts.length === 0" class="text-center py-12">
            <p class="text-gray-600">No blog posts available.</p>
        </div>

        <!-- Loading State -->
        <div
            v-if="loading"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <div v-for="n in 6" :key="n" class="animate-pulse">
                <div class="bg-gray-200 h-[280px] rounded-t-lg"></div>
                <div class="p-6 bg-white rounded-b-lg">
                    <div class="h-6 bg-gray-200 rounded mb-3"></div>
                    <div class="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div class="space-y-2">
                        <div class="h-3 bg-gray-200 rounded"></div>
                        <div class="h-3 bg-gray-200 rounded"></div>
                        <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && totalPages > 1" class="mt-8 flex justify-center">
            <nav class="flex items-center gap-2">
                <button
                    @click="changePage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    Previous
                </button>
                <div class="flex gap-1">
                    <button
                        v-for="page in displayedPages"
                        :key="page"
                        @click="changePage(page)"
                        :class="[
                            'px-4 py-2 rounded-md transition-colors',
                            currentPage === page
                                ? 'bg-primary text-white'
                                : 'hover:bg-gray-50',
                        ]"
                    >
                        {{ page }}
                    </button>
                </div>
                <button
                    @click="changePage(currentPage + 1)"
                    :disabled="currentPage >= totalPages"
                    class="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    Next
                </button>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import axios from "axios";
import DOMPurify from "dompurify";
import { useSnackbarStore } from "../stores/snackbar";

const snackbarStore = useSnackbarStore();
const posts = ref([]);
const currentPage = ref(1);
const totalPosts = ref(0);
const postsPerPage = 9;
const loading = ref(true);

const totalPages = computed(() => Math.ceil(totalPosts.value / postsPerPage));

// Calculate displayed page numbers
const displayedPages = computed(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages.value; i++) {
        if (
            i === 1 ||
            i === totalPages.value ||
            (i >= currentPage.value - delta && i <= currentPage.value + delta)
        ) {
            range.push(i);
        }
    }

    range.forEach((i) => {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push("...");
            }
        }
        rangeWithDots.push(i);
        l = i;
    });

    return rangeWithDots;
});

const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) {
        return imageUrl;
    } else {
        const baseUrl = import.meta.env.DEV
            ? "http://localhost:3000"
            : "https://u888w80wkcwg8g0wc444so0o.cloud.elevatika.com";
        return `${baseUrl}${imageUrl}`;
    }
};

const fetchPosts = async (page) => {
    loading.value = true;
    try {
        const response = await axios.get("/general-posts", {
            params: {
                page,
                limit: postsPerPage,
                kind: "blog",
            },
        });
        posts.value = response.data.posts;
        totalPosts.value = response.data.totalCount;
    } catch (error) {
        console.error("Error fetching posts:", error);
        snackbarStore.addSnackbar({
            message: "Error loading blog posts. Please try again later.",
            type: "error",
        });
    } finally {
        loading.value = false;
    }
};

const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        currentPage.value = newPage;
        fetchPosts(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const formatReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
};

const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
        ALLOWED_ATTR: [],
    });
};

onMounted(() => {
    fetchPosts(1);
});
</script>

<style scoped>
.line-clamp-2 {
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.prose :deep(p) {
    margin: 0;
}
</style>
