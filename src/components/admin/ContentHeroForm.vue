<template>
    <form @submit.prevent="saveContent" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Section Form -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold mb-4">Left Section</h3>

                <!-- Title Fields -->
                <div class="mb-6">
                    <h4 class="font-medium mb-2">Title</h4>

                    <div class="mb-3">
                        <label
                            for="mainText"
                            class="block text-sm font-medium text-gray-700"
                            >Main Text</label
                        >
                        <input
                            type="text"
                            id="mainText"
                            v-model="formData.leftSection.title.mainText"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div class="mb-3">
                        <label
                            for="highlightedText"
                            class="block text-sm font-medium text-gray-700"
                            >Highlighted Text</label
                        >
                        <input
                            type="text"
                            id="highlightedText"
                            v-model="formData.leftSection.title.highlightedText"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div class="mb-3">
                        <label
                            for="endText"
                            class="block text-sm font-medium text-gray-700"
                            >End Text</label
                        >
                        <input
                            type="text"
                            id="endText"
                            v-model="formData.leftSection.title.endText"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>

                <!-- Description -->
                <div class="mb-6">
                    <label
                        for="description"
                        class="block text-sm font-medium text-gray-700"
                        >Description</label
                    >
                    <textarea
                        id="description"
                        v-model="formData.leftSection.description"
                        rows="3"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    ></textarea>
                </div>

                <!-- Buttons -->
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-medium">Buttons</h4>
                        <button
                            type="button"
                            @click="addButton"
                            class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            Add Button
                        </button>
                    </div>

                    <div
                        v-for="(button, index) in formData.leftSection.buttons"
                        :key="index"
                        class="border rounded-md p-3 mb-3"
                    >
                        <div class="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700"
                                    >Text</label
                                >
                                <input
                                    type="text"
                                    v-model="button.text"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700"
                                    >Link</label
                                >
                                <input
                                    type="text"
                                    v-model="button.link"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label
                                class="block text-sm font-medium text-gray-700"
                                >Type</label
                            >
                            <select
                                v-model="button.type"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            >
                                <option value="primary">Primary</option>
                                <option value="secondary">Secondary</option>
                            </select>
                        </div>

                        <div class="flex justify-end">
                            <button
                                type="button"
                                @click="removeButton(index)"
                                class="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Features -->
                <div>
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-medium">Features</h4>
                        <button
                            type="button"
                            @click="addFeature"
                            class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            Add Feature
                        </button>
                    </div>

                    <div
                        v-for="(feature, index) in formData.leftSection
                            .features"
                        :key="index"
                        class="border rounded-md p-3 mb-3"
                    >
                        <div class="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700"
                                    >Icon</label
                                >
                                <select
                                    v-model="feature.icon"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                >
                                    <option value="users">Users</option>
                                    <option value="shopping-bag">
                                        Shopping Bag
                                    </option>
                                    <option value="book">Book</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700"
                                    >Title</label
                                >
                                <input
                                    type="text"
                                    v-model="feature.title"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label
                                class="block text-sm font-medium text-gray-700"
                                >Description</label
                            >
                            <input
                                type="text"
                                v-model="feature.description"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div class="mb-3">
                            <label
                                class="block text-sm font-medium text-gray-700"
                                >Link</label
                            >
                            <input
                                type="text"
                                v-model="feature.link"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div class="flex justify-end">
                            <button
                                type="button"
                                @click="removeFeature(index)"
                                class="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Section Form -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">Slides</h3>
                    <button
                        type="button"
                        @click="addSlide"
                        class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                    >
                        Add Slide
                    </button>
                </div>

                <div
                    v-for="(slide, index) in formData.rightSection.slides"
                    :key="slide.id"
                    class="border rounded-md p-3 mb-4"
                >
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-medium">Slide {{ index + 1 }}</h4>
                        <button
                            v-if="formData.rightSection.slides.length > 1"
                            type="button"
                            @click="removeSlide(index)"
                            class="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm"
                        >
                            Remove
                        </button>
                    </div>

                    <!-- Image Upload -->
                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700"
                            >Image</label
                        >
                        <div class="mt-1 flex items-center">
                            <div
                                v-if="getImagePreview(slide)"
                                class="w-24 h-16 mr-4 border rounded overflow-hidden"
                            >
                                <img
                                    :src="getImagePreview(slide)"
                                    class="w-full h-full object-cover"
                                    alt="Preview"
                                />
                            </div>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                @change="(e) => handleImageChange(e, index)"
                                class="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary"
                            />
                        </div>
                        <p class="mt-2 text-xs text-gray-500">
                            Use a landscape image at least 1600 × 900 px; 1920 × 1080 px or larger is recommended.
                        </p>
                    </div>

                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700"
                            >Alt Text</label
                        >
                        <input
                            type="text"
                            v-model="slide.alt"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <!-- Statistics -->
                    <div>
                        <h5 class="font-medium mb-2">Statistics</h5>
                        <div class="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700"
                                    >Label 1</label
                                >
                                <input
                                    type="text"
                                    v-model="slide.stats.label1"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700"
                                    >Value 1</label
                                >
                                <input
                                    type="text"
                                    v-model="slide.stats.value1"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700"
                                    >Label 2</label
                                >
                                <input
                                    type="text"
                                    v-model="slide.stats.label2"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700"
                                    >Value 2</label
                                >
                                <input
                                    type="text"
                                    v-model="slide.stats.value2"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-end space-x-4">
            <button
                type="button"
                @click="$emit('cancel')"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                Cancel
            </button>
            <button
                type="submit"
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
                :disabled="saving"
            >
                {{ saving ? "Saving..." : "Save Content" }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import axios from "axios";
import { useSnackbarStore } from "../../stores/snackbar";

const props = defineProps({
    content: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(["saved", "cancel"]);

const saving = ref(false);
const formData = ref({
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
            {
                text: "Explore Books",
                link: "/products",
                type: "secondary",
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
                alt: "Products",
                stats: {
                    label1: "Available Products",
                    value1: "10,000+",
                    label2: "Categories",
                    value2: "50+",
                },
            },
        ],
    },
});

// Track file URLs for cleanup
const objectUrls = ref([]);

const snackbarStore = useSnackbarStore();

// Initialize form with passed content
onMounted(() => {
    if (props.content) {
        formData.value = JSON.parse(JSON.stringify(props.content));
    }
});

// Helper functions for the form
const addButton = () => {
    formData.value.leftSection.buttons.push({
        text: "New Button",
        link: "/",
        type: "secondary",
    });
};

const removeButton = (index) => {
    formData.value.leftSection.buttons.splice(index, 1);
};

const addFeature = () => {
    formData.value.leftSection.features.push({
        icon: "book",
        title: "New Feature",
        description: "Feature description",
        link: "/",
    });
};

const removeFeature = (index) => {
    formData.value.leftSection.features.splice(index, 1);
};

const addSlide = () => {
    const newId =
        Math.max(0, ...formData.value.rightSection.slides.map((s) => s.id)) + 1;
    formData.value.rightSection.slides.push({
        id: newId,
        image: "/placeholder.jpg",
        alt: "New Slide",
        stats: {
            label1: "Stat Label 1",
            value1: "0",
            label2: "Stat Label 2",
            value2: "0",
        },
    });
};

const removeSlide = (index) => {
    if (formData.value.rightSection.slides.length > 1) {
        const slide = formData.value.rightSection.slides[index];
        if (slide.objectUrl) {
            URL.revokeObjectURL(slide.objectUrl);
        }
        formData.value.rightSection.slides.splice(index, 1);
    }
};

const getImageDimensions = (file) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        const url = URL.createObjectURL(file);
        image.onload = () => {
            resolve({ width: image.naturalWidth, height: image.naturalHeight });
            URL.revokeObjectURL(url);
        };
        image.onerror = () => {
            reject(new Error("Could not read the selected image."));
            URL.revokeObjectURL(url);
        };
        image.src = url;
    });

const handleImageChange = async (event, index) => {
    const file = event.target.files[0];
    if (file) {
        try {
            const { width, height } = await getImageDimensions(file);
            if (width < 1600 || height < 900) {
                event.target.value = "";
                snackbarStore.addSnackbar({
                    message: `Hero image is ${width} × ${height} px. Please use at least 1600 × 900 px.`,
                    type: "error",
                });
                return;
            }
        } catch (error) {
            event.target.value = "";
            snackbarStore.addSnackbar({
                message: error.message,
                type: "error",
            });
            return;
        }

        // Store the original path
        const originalPath = formData.value.rightSection.slides[index].image;

        // Create a URL for preview
        const objectUrl = URL.createObjectURL(file);
        objectUrls.value.push(objectUrl);

        // Update the slide with file and preview URL
        formData.value.rightSection.slides[index] = {
            ...formData.value.rightSection.slides[index],
            image: file,
            objectUrl,
            originalPath,
        };
    }
};

const getImagePreview = (slide) => {
    try {
        // If this slide has an object URL from file upload
        if (slide.objectUrl) {
            return slide.objectUrl;
        }

        // If the slide has a path string
        if (typeof slide.image === "string") {
            // Check if it's an absolute URL
            if (slide.image.startsWith("http")) {
                return slide.image;
            } else {
                // For relative paths - use your existing API URL approach
                const baseUrl = import.meta.env.DEV
                    ? "http://localhost:3000"
                    : import.meta.env.VITE_ASSET_URL;
                return `${baseUrl}${slide.image}`;
            }
        }

        return "/placeholder.jpg";
    } catch (error) {
        console.error("Error in getImagePreview:", error);
        return "/placeholder.jpg";
    }
};

const saveContent = async () => {
    saving.value = true;

    try {
        const formDataToSend = new FormData();

        // Create a deep copy without blob URLs
        const contentToSend = JSON.parse(JSON.stringify(formData.value));

        // Process slides to handle files and remove blob URLs
        if (contentToSend.rightSection && contentToSend.rightSection.slides) {
            contentToSend.rightSection.slides.forEach((slide, i) => {
                // Remove any objectUrl properties
                if (slide.objectUrl) {
                    delete contentToSend.rightSection.slides[i].objectUrl;
                }

                // Check if slide.image is a blob URL and replace it
                if (
                    typeof slide.image === "string" &&
                    slide.image.startsWith("blob:")
                ) {
                    contentToSend.rightSection.slides[i].image =
                        slide.originalPath || "/placeholder.jpg";
                }

                // Handle file uploads
                const originalSlide = formData.value.rightSection.slides[i];
                if (originalSlide.image instanceof File) {
                    // Add file to FormData
                    formDataToSend.append(
                        `rightSection.slides[${i}].image`,
                        originalSlide.image,
                    );

                    // Replace file object with placeholder or original path
                    contentToSend.rightSection.slides[i].image =
                        originalSlide.originalPath || "/placeholder.jpg";
                }
            });
        }

        // Add the cleaned content JSON
        formDataToSend.append("content", JSON.stringify(contentToSend));

        // Send to API
        const response = await axios.put("/contents/hero", formDataToSend, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        emit("saved", response.data);
    } catch (error) {
        console.error("Error saving content:", error);
        snackbarStore.addSnackbar({
            message: "Failed to save content. Please try again.",
            type: "error"
        });
    } finally {
        saving.value = false;
    }
};

// Clean up object URLs when component is destroyed
onBeforeUnmount(() => {
    objectUrls.value.forEach((url) => {
        URL.revokeObjectURL(url);
    });
});

// Watch for content prop changes
watch(
    () => props.content,
    (newContent) => {
        if (newContent) {
            formData.value = JSON.parse(JSON.stringify(newContent));
        }
    },
);
</script>
