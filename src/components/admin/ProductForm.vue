<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Existing fields -->
        <div>
            <label for="title" class="block text-sm font-medium text-gray-700"
                >Title</label
            >
            <input
                type="text"
                id="title"
                v-model="formData.title"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="errors.title" class="text-red-500 text-xs">{{
                errors.title
            }}</span>
        </div>
        <div>
            <label for="barcode" class="block text-sm font-medium text-gray-700"
                >Barcode</label
            >
            <input
                type="text"
                id="barcode"
                v-model="formData.barcode"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="errors.barcode" class="text-red-500 text-xs">{{
                errors.barcode
            }}</span>
        </div>

        <!-- Category -->
        <div>
            <label
                for="category"
                class="block text-sm font-medium text-gray-700"
                >Category</label
            >
            <select
                id="category"
                v-model="formData.category"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
                <option value="">Select Category</option>
                <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.name"
                >
                    {{ category.name }}
                </option>
            </select>
            <span v-if="errors.category" class="text-red-500 text-xs">{{
                errors.category
            }}</span>
        </div>

        <!-- Cover Image with Preview -->
        <div>
            <label
                for="coverImage"
                class="block text-sm font-medium text-gray-700"
            >
                Cover Image
            </label>
            <div class="flex items-start space-x-4">
                <!-- Image Preview -->
                <div
                    v-if="imagePreviewUrl"
                    class="h-24 w-20 overflow-hidden rounded border border-gray-300 bg-gray-100"
                >
                    <img
                        :src="imagePreviewUrl"
                        alt="Cover preview"
                        class="h-full w-full object-cover"
                    />
                </div>
                <div class="flex-1">
                    <input
                        type="file"
                        id="coverImage"
                        ref="fileInput"
                        @change="onFileSelected"
                        class="mt-1 block w-full"
                    />
                    <span
                        v-if="errors.coverImage"
                        class="text-red-500 text-xs"
                        >{{ errors.coverImage }}</span
                    >
                </div>
            </div>
        </div>

        <!-- Description -->
        <div>
            <label
                for="description"
                class="block text-sm font-medium text-gray-700"
                >Description</label
            >
            <textarea
                id="description"
                v-model="formData.description"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            ></textarea>
            <span v-if="errors.description" class="text-red-500 text-xs">{{
                errors.description
            }}</span>
        </div>

        <!-- Price -->
        <div>
            <label for="price" class="block text-sm font-medium text-gray-700"
                >Price</label
            >
            <input
                type="text"
                id="price"
                v-model="formData.price"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="errors.price" class="text-red-500 text-xs">{{
                errors.price
            }}</span>
        </div>

        <!-- Quantity in Shop -->
        <div>
            <label
                for="quantityShop"
                class="block text-sm font-medium text-gray-700"
                >Quantity in Shop</label
            >
            <input
                type="number"
                id="quantityShop"
                v-model="formData.quantityShop"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="errors.quantityShop" class="text-red-500 text-xs">{{
                errors.quantityShop
            }}</span>
        </div>

        

        <!-- Featured (Checkbox) -->
        <div>
            <input
                type="checkbox"
                id="featured"
                v-model="formData.featured"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label for="featured" class="ml-2 text-sm font-medium text-gray-700"
                >Featured</label
            >
        </div>

        
        <!-- Status -->
        <div>
            <label for="status" class="block text-sm font-medium text-gray-700"
                >Status</label
            >
            <select
                id="status"
                v-model="formData.status"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
            <span v-if="errors.status" class="text-red-500 text-xs">{{
                errors.status
            }}</span>
        </div>

        <div class="flex justify-end space-x-4">
            <button
                type="button"
                @click="onCancel"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            >
                Cancel
            </button>
            <button
                type="submit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
                Save
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";

const props = defineProps({
    product: Object, // Book object being edited (if any)
    categories: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(["save", "cancel"]);

const isEditing = ref(false);
const formData = ref({
    title: "",
    category: "",
    coverImageUrl: "",
    description: "",
    price: null,
    quantityShop: 0,
    featured: false,
    barcode: Date.now(),
    status: "active",
    coverImage: null, // Property to hold the selected file
});

const errors = ref({});
const localImageUrl = ref(null);

// Compute image preview URL
const imagePreviewUrl = computed(() => {
    // If there's a local file selected, use that
    if (localImageUrl.value) {
        return localImageUrl.value;
    }

    // Otherwise use the existing coverImageUrl (if editing)
    if (formData.value.coverImageUrl) {
        if (formData.value.coverImageUrl.startsWith("http")) {
            return formData.value.coverImageUrl;
        } else {
            const baseUrl = import.meta.env.DEV
                ? "http://localhost:3000"
                : import.meta.env.VITE_ASSET_URL;
            return `${baseUrl}${formData.value.coverImageUrl}`;
        }
    }

    return null;
});

onMounted(() => {
    if (props.product) {
        isEditing.value = true;
        const productData = { ...props.product };
        if (productData.publicationDate) {
            // Format the date as YYYY-MM-DD for the input
            productData.publicationDate = new Date(productData.publicationDate)
                .toISOString()
                .split("T")[0];
        }
        formData.value = {
            ...productData,
            coverImage: null,
        };
    }
});

watch(
    () => props.product,
    (newBook) => {
        if (newBook) {
            isEditing.value = true;
            const productData = { ...newBook };
            if (productData.publicationDate) {
                // Format the date as YYYY-MM-DD for the input
                productData.publicationDate = new Date(
                    productData.publicationDate,
                )
                    .toISOString()
                    .split("T")[0];
            }
            formData.value = {
                ...productData,
                coverImage: null,
            };
            localImageUrl.value = null; // Reset local image
        } else {
            isEditing.value = false;
            formData.value = {
                title: "",
                author: "",
                isbn: "",
                category: "",
                barcode: "",
                coverImageUrl: "",
                description: "",
                price: null,
                quantityShop: 0,
                quantityLibraryTotal: 0,
                featured: false,
                ageRange: "",
                publicationDate: null,
                status: "active",
                coverImage: null,
            };
            localImageUrl.value = null; // Reset local image
        }
        errors.value = {};
    },
);

const validateForm = () => {
    errors.value = {};
    let isValid = true;

    if (!formData.value.title) {
        errors.value.title = "Title is required.";
        isValid = false;
    }

    if (!formData.value.author) {
        errors.value.author = "Author is required.";
        isValid = false;
    }

    if (formData.value.price === null) {
        errors.value.price = "Price is required.";
        isValid = false;
    }

    if (formData.value.quantityShop === null) {
        errors.value.quantityShop = "Quantity in shop is required.";
        isValid = false;
    }

    if (formData.value.quantityLibraryTotal === null) {
        errors.value.quantityLibraryTotal = "Quantity in library is required.";
        isValid = false;
    }

    if (!formData.value.category) {
        errors.value.category = "Category is required.";
        isValid = false;
    }

    return isValid;
};

const onFileSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
        formData.value.coverImage = file;
        // Create a local URL for preview
        localImageUrl.value = URL.createObjectURL(file);
    }
};

const onSubmit = () => {
    if (validateForm()) {
        // Create a FormData object to send file data
        const form = new FormData();

        // Format the date to include time component
        const formattedData = { ...formData.value };
        if (formattedData.publicationDate) {
            // Append time component to make it a valid ISO datetime
            formattedData.publicationDate = `${formattedData.publicationDate}T00:00:00.000Z`;
        }

        // Append all form fields to FormData
        for (const key in formattedData) {
            // Skip appending 'coverImage' if it's null (no new file selected in edit mode)
            if (key === "coverImage" && formattedData[key] === null) continue;
            form.append(key, formattedData[key]);
        }

        emit("save", form);
    }
};

const onCancel = () => {
    errors.value = {};

    // Clean up any created object URLs to prevent memory leaks
    if (localImageUrl.value) {
        URL.revokeObjectURL(localImageUrl.value);
        localImageUrl.value = null;
    }

    emit("cancel");
};
</script>
