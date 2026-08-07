<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Website Configuration</h2>
        </div>

        <!-- Section Tabs -->
        <div class="border-b border-gray-200 mb-6">
            <nav class="flex -mb-px">
                <button
                    @click="currentSection = 'hero'"
                    class="py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-200"
                    :class="
                        currentSection === 'hero'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    "
                >
                    Hero Section
                </button>
                <button
                    @click="currentSection = 'footer'"
                    class="py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-200"
                    :class="
                        currentSection === 'footer'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    "
                >
                    Footer
                </button>
                <button
                    @click="currentSection = 'categories'"
                    class="py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-200"
                    :class="
                        currentSection === 'categories'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    "
                >
                    Categories
                </button>
            </nav>
        </div>

        <div v-if="loading" class="flex justify-center my-8">
            <div
                class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
            ></div>
        </div>

        <template v-else>
            <!-- Preview Section (only for visual sections, not for categories) -->
            <div
                v-if="currentSection !== 'categories'"
                class="bg-gray-50 p-6 rounded-lg shadow-sm mb-8"
            >
                <h3 class="text-lg font-semibold mb-4">Preview</h3>

                <!-- Using actual components for preview -->
                <div
                    class="bg-white rounded-lg overflow-auto shadow max-h-[400px]"
                >
                    <!-- Hero Preview -->
                    <div
                        v-if="currentSection === 'hero'"
                        class="preview-container"
                    >
                        <HeroSection :content="content" />
                    </div>

                    <!-- Footer Preview -->
                    <div
                        v-if="currentSection === 'footer'"
                        class="preview-container bg-gray-900"
                    >
                        <!-- Create a mini-preview of the footer that fits well in the admin panel -->
                        <Footer :content="content" :preview-mode="true" />
                    </div>
                </div>
            </div>

            <!-- Edit Form -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="px-6 py-4 bg-gray-50 border-b">
                    <h3 class="text-lg font-semibold">Edit Content</h3>
                </div>

                <div class="p-6">
                    <ContentHeroForm
                        v-if="currentSection === 'hero'"
                        :content="content"
                        @saved="onContentSaved"
                        @cancel="loadContent"
                    />
                    <ContentFooterForm
                        v-if="currentSection === 'footer'"
                        :content="content"
                        @saved="onContentSaved"
                        @cancel="loadContent"
                    />
                    <ContentCategoryForm
                        v-if="currentSection === 'categories'"
                        :content="content"
                        @saved="onContentSaved"
                        @cancel="loadContent"
                    />
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { copyDefaultCategories } from "../../config/catalog";
import ContentHeroForm from "@/components/admin/ContentHeroForm.vue";
import ContentFooterForm from "@/components/admin/ContentFooterForm.vue";
import ContentCategoryForm from "@/components/admin/ContentCategoryForm.vue";

// Import actual components for preview
import HeroSection from "@/components/sections/HeroSection.vue";
import Footer from "@/components/Footer.vue";

const loading = ref(true);
const currentSection = ref("hero");
const content = ref(null);
const currentSlide = ref(0);

// Load content data
const loadContent = async () => {
    loading.value = true;

    try {
        const response = await axios.get(`/contents/${currentSection.value}`);
        content.value = response.data.content;
        currentSlide.value = 0;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Initialize default content if none exists
            if (currentSection.value === "hero") {
                content.value = getDefaultHeroContent();
            } else if (currentSection.value === "footer") {
                content.value = getDefaultFooterContent();
            } else if (currentSection.value === "categories") {
                content.value = getDefaultCategoriesContent();
            }
        } else {
            console.error("Error loading content:", error);
        }
    } finally {
        loading.value = false;
    }
};

// Get default hero content
const getDefaultHeroContent = () => {
    return {
        leftSection: {
            title: {
                mainText: "",
                highlightedText: "",
                endText: "",
            },
            description:
                "",
            buttons: [
                {
                    text: "Get Started",
                    link: "/register",
                    type: "primary",
                },
                
            ],
            features: [
               
                {
                    icon: "shopping-bag",
                    title: "Shop",
                    description: "Purchase your favorite products",
                    link: "/products",
                },
            ],
        },
        rightSection: {
            slides: [
                {
                    id: 1,
                    image: "/placeholder.jpg",
                    alt: "Library Books",
                    stats: {
                        label1: "",
                        value1: "",
                        label2: "",
                        value2: "",
                    },
                },
            ],
        },
    };
};

// Get default footer content
const getDefaultFooterContent = () => {
    return {
        brand: {
            description: "",
            tagline: "Find yourself through meaningful jewelry",
        },
        socialLinks: [
            {
                name: "Facebook",
                url: "#",
                icon: ["fab", "facebook-f"],
            },
            {
                name: "Twitter",
                url: "#",
                icon: ["fab", "twitter"],
            },
            {
                name: "Instagram",
                url: "#",
                icon: ["fab", "instagram"],
            },
            {
                name: "TikTok",
                url: "#",
                icon: ["fab", "tiktok"],
            },
        ],
        quickLinks: [
            { name: "Shop", url: "/products" },
            { name: "About Us", url: "/about" },
            { name: "Contact", url: "/contact" },
        ],
        helpLinks: [
            { name: "FAQ", url: "/faq" },
            { name: "Shipping Information", url: "/shipping" },
            { name: "Returns Policy", url: "/returns" },
            { name: "Privacy Policy", url: "/privacy" },
            { name: "Terms & Conditions", url: "/terms" },
        ],
        legalLinks: [
            { name: "Privacy Policy", url: "/privacy" },
            { name: "Terms of Service", url: "/terms" },
            { name: "Cookie Policy", url: "/cookies" },
        ],
        location: "Nairobi, Moi Avenue",
        contactNumber: "+254 123456789",
        newsletter: {
            title: "Stay Connected",
            description:
                "Join our newsletter for the latest updates and exclusive offers.",
        },
    };
};

// Get default categories content
const getDefaultCategoriesContent = () => {
    return {
        categories: copyDefaultCategories(),
    };
};

// Handle content saved
const onContentSaved = (data) => {
    content.value = data.content;
    alert("Content saved successfully!");
};

// Watch for section changes
watch(currentSection, () => {
    loadContent();
});

// Load content on component mount
onMounted(() => {
    loadContent();
});
</script>

<style scoped>
.preview-container {
    /* Add styles to constrain the preview components to look good in the admin panel */
    max-height: 600px;
    overflow: auto;
}

/* Footer preview specific styles */
.preview-container.bg-gray-900 {
    color: white;
}
</style>
