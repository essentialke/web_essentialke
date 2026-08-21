<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Main Content -->
        <main v-if="post" class="container mx-auto px-4 py-8 max-w-4xl">
            <!-- Category and Reading Time -->
            <div class="mb-6 flex items-center gap-4 text-sm">
                <span
                    v-if="post.category"
                    class="bg-primary/10 text-primary px-3 py-1 rounded-full"
                >
                    {{ post.category }}
                </span>
                <span class="text-gray-600">
                    {{ formatReadingTime(post.content) }} min read
                </span>
            </div>

            <!-- Header -->
            <header class="mb-12">
                <h1
                    class="text-4xl md:text-5xl font-bold mb-6 font-display-serif leading-tight"
                >
                    {{ post.title }}
                </h1>

                <!-- Author Info -->
                <div class="flex items-center gap-4">
                    <img
                        v-if="post.author?.avatar"
                        :src="getImageUrl(post.author.avatar)"
                        :alt="post.author?.name"
                        class="w-12 h-12 rounded-full object-cover"
                    />
                    <div
                        v-else
                        class="w-12 h-12 rounded-full bg-gray-200"
                    ></div>
                    <div>
                        <div class="font-medium text-gray-900">
                            {{ post.author?.name }}
                        </div>
                        <div class="text-gray-600 text-sm">
                            <span>{{ formatDate(post.createdAt) }}</span>
                            <span
                                v-if="
                                    post.updatedAt &&
                                    post.updatedAt !== post.createdAt
                                "
                            >
                                • Updated {{ formatDate(post.updatedAt) }}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Featured Image -->
            <div v-if="post.imageUrl" class="mb-12">
                <div class="relative rounded-xl overflow-hidden shadow-xl">
                    <img
                        :src="getImageUrl(post.imageUrl)"
                        :alt="post.title"
                        class="w-full object-cover h-[400px] md:h-[600px]"
                    />
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                    ></div>
                </div>
                <p
                    v-if="post.imageCaption"
                    class="text-sm text-gray-500 mt-2 text-center"
                >
                    {{ post.imageCaption }}
                </p>
            </div>

            <!-- Content -->
            <article
                class="prose prose-lg max-w-none bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12"
                v-html="sanitizeHtml(post.content)"
            ></article>

            <!-- Tags -->
            <div v-if="post.tags?.length" class="mb-12">
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="tag in post.tags"
                        :key="tag"
                        class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        #{{ tag }}
                    </span>
                </div>
            </div>

            <!-- Share Section -->
            <div class="mb-12 border-t border-b border-gray-200 py-6">
                <h3 class="text-lg font-semibold mb-4">Share this article</h3>
                <div class="flex gap-4">
                    <button
                        v-for="social in socialShares"
                        :key="social.name"
                        @click="sharePost(social.url)"
                        class="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        :title="`Share on ${social.name}`"
                    >
                        <component
                            :is="social.icon"
                            class="w-5 h-5 text-gray-600"
                        />
                    </button>
                </div>
            </div>

            <!-- Navigation -->
            <div
                class="flex flex-col md:flex-row justify-between items-center gap-4"
            >
                <RouterLink
                    to="/blog"
                    class="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                    <span>←</span>
                    <span>Back to Blog</span>
                </RouterLink>

                <!-- Next/Previous Post Links -->
                <div
                    v-if="post.nextPost || post.previousPost"
                    class="flex gap-4"
                >
                    <RouterLink
                        v-if="post.previousPost"
                        :to="`/blog/${post.previousPost.id}`"
                        class="text-gray-600 hover:text-primary transition-colors"
                    >
                        ← Previous Post
                    </RouterLink>
                    <RouterLink
                        v-if="post.nextPost"
                        :to="`/blog/${post.nextPost.id}`"
                        class="text-gray-600 hover:text-primary transition-colors"
                    >
                        Next Post →
                    </RouterLink>
                </div>
            </div>

            <!-- Related Posts -->
            <div v-if="relatedPosts.length" class="mt-16">
                <h2 class="text-2xl font-bold mb-6">Related Posts</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        v-for="relatedPost in relatedPosts"
                        :key="relatedPost.id"
                        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                    >
                        <RouterLink :to="`/blog/${relatedPost.id}`">
                            <img
                                v-if="relatedPost.imageUrl"
                                :src="getImageUrl(relatedPost.imageUrl)"
                                :alt="relatedPost.title"
                                class="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 class="font-bold text-lg mb-2">
                                {{ relatedPost.title }}
                            </h3>
                            <p class="text-gray-600 text-sm">
                                {{ relatedPost.excerpt }}
                            </p>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </main>

        <!-- Loading State -->
        <div v-else-if="loading" class="container mx-auto px-4 py-8 max-w-4xl">
            <div class="animate-pulse space-y-8">
                <div class="h-4 bg-gray-200 rounded w-24"></div>
                <div class="space-y-4">
                    <div class="h-12 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div class="h-[400px] bg-gray-200 rounded-xl"></div>
                <div class="space-y-4">
                    <div class="h-4 bg-gray-200 rounded"></div>
                    <div class="h-4 bg-gray-200 rounded"></div>
                    <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else class="container mx-auto px-4 py-16 text-center">
            <div class="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8">
                <div class="text-red-500 mb-4">
                    <svg
                        class="w-16 h-16 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">
                    Post Not Found
                </h2>
                <p class="text-gray-600 mb-8">
                    The post you're looking for might have been removed or is
                    temporarily unavailable.
                </p>
                <RouterLink
                    to="/blog"
                    class="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Return to Blog
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import axios from "axios";
import DOMPurify from "dompurify";
import { useSnackbarStore } from "../stores/snackbar";

const route = useRoute();
const snackbarStore = useSnackbarStore();
const post = ref(null);
const loading = ref(true);
const relatedPosts = ref([]);

// Compute social share URLs
const socialShares = computed(() => {
    if (!post.value) return [];

    const currentUrl = window.location.href;
    const title = encodeURIComponent(post.value.title);

    return [
        {
            name: "Twitter",
            url: `https://twitter.com/intent/tweet?url=${currentUrl}&text=${title}`,
            icon: "TwitterIcon",
        },
        {
            name: "Facebook",
            url: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
            icon: "FacebookIcon",
        },
        {
            name: "LinkedIn",
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${title}`,
            icon: "LinkedInIcon",
        },
    ];
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

const fetchPost = async () => {
    loading.value = true;
    try {
        const response = await axios.get(`/general-posts/${route.params.id}`);
        post.value = response.data;
        document.title = `${post.value.title} | Your Blog Name`;

        // Fetch related posts
        if (post.value.tags?.length) {
            await fetchRelatedPosts();
        }
    } catch (error) {
        console.error("Error fetching post:", error);
        snackbarStore.addSnackbar({
            message: "Error loading blog post. Please try again later.",
            type: "error",
        });
        post.value = null;
    } finally {
        loading.value = false;
    }
};

const fetchRelatedPosts = async () => {
    try {
        const response = await axios.get("/general-posts", {
            params: {
                tags: post.value.tags.join(","),
                limit: 2,
                excludeId: post.value.id,
            },
        });
        relatedPosts.value = response.data.posts;
    } catch (error) {
        console.error("Error fetching related posts:", error);
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

const sharePost = (url) => {
    window.open(url, "_blank", "width=600,height=400");
};

const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            "b",
            "i",
            "em",
            "strong",
            "p",
            "br",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "ul",
            "ol",
            "li",
            "a",
            "blockquote",
            "code",
            "pre",
            "img",
            "figure",
            "figcaption",
        ],
        ALLOWED_ATTR: ["href", "target", "src", "alt", "class"],
        ALLOWED_CLASSES: {
            code: ["language-*"],
            pre: ["language-*"],
        },
    });
};

onMounted(() => {
    fetchPost();
});
</script>

<style scoped>
.prose {
    max-width: none;
}

.prose :deep(a) {
    color: theme("colors.primary");
    text-decoration: none;
}

.prose :deep(a:hover) {
    text-decoration: underline;
}

.prose :deep(blockquote) {
    border-left-color: theme("colors.primary");
    background-color: theme("colors.gray.50");
    padding: 1rem 1.5rem;
    margin: 2rem 0;
}

.prose :deep(code) {
    background-color: theme("colors.gray.100");
    padding: 0.2em 0.4em;
    border-radius: 0.25rem;
    font-size: 0.875em;
}

.prose :deep(pre) {
    background-color: theme("colors.gray.900");
    color: theme("colors.gray.100");
    padding: 1.5rem;
    border-radius: 0.5rem;
    overflow-x: auto;
}

.prose :deep(figure) {
    margin: 2rem 0;
}

.prose :deep(figcaption) {
    text-align: center;
    color: theme("colors.gray.600");
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

.prose :deep(img) {
    border-radius: 0.5rem;
}

.prose :deep(ul),
.prose :deep(ol) {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
}

.prose :deep(li) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}
</style>
