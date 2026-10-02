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
            <label for="salePrice" class="block text-sm font-medium text-gray-700">Sale Price <span class="font-normal text-gray-500">(optional)</span></label>
            <input id="salePrice" v-model="formData.salePrice" type="number" min="0" step="0.01" placeholder="Leave blank when not on sale" class="number-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            <p class="mt-1 text-xs text-gray-500">Must be lower than the regular price. Clearing it removes the product from Sale.</p>
            <span v-if="errors.salePrice" class="text-red-500 text-xs">{{ errors.salePrice }}</span>
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
                    v-for="category in categoryOptions"
                    :key="category.id"
                    :value="category.name"
                >
                    {{ category.name }}
                </option>
            </select>
                <button v-if="isEditing && parentCategory" type="button" class="mt-2 text-sm underline" @click="addingSubcategory = true">+ Add subcategory</button>
                <div v-if="addingSubcategory" class="mt-3">
                    <CategoryEditor :parent-id="parentCategory.id" @saved="subcategorySaved" @cancel="addingSubcategory = false" />
                </div>
            <span v-if="errors.category" class="text-red-500 text-xs">{{
                errors.category
            }}</span>
        </div>

        <div>
            <label for="collection" class="block text-sm font-medium text-gray-700">Collection</label>
            <select id="collection" v-model="formData.collection" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                <option value="">No collection</option>
                <option v-for="collection in availableCollections" :key="collection.id" :value="collection.name">{{ collection.name }}</option>
            </select>
        </div>

        <fieldset class="space-y-2">
            <legend class="block text-sm font-medium text-gray-700">Available finishes</legend>
            <div class="flex flex-wrap gap-5">
                <label v-for="color in ['Gold', 'Silver']" :key="color" class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input v-model="formData.colors" type="checkbox" :value="color" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    {{ color }}
                </label>
            </div>
            <p class="text-xs text-gray-500">Select the finishes customers can choose on the product page.</p>
        </fieldset>

        <!-- Cover Image with Preview -->
        <div>
            <label
                for="coverImage"
                class="block text-sm font-medium text-gray-700"
            >
                Product photo
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
                        accept="image/jpeg,image/png,image/gif"
                        @change="onFileSelected"
                        class="mt-1 block w-full"
                    />
                    <p class="mt-1 text-xs text-gray-500">Choose a JPG, PNG or GIF up to 2 MB. Preview it here before saving.</p>
                    <span
                        v-if="errors.coverImage"
                        class="text-red-500 text-xs"
                        >{{ errors.coverImage }}</span
                    >
                </div>
            </div>
        </div>

        <div class="space-y-3">
            <label for="galleryImages" class="block text-sm font-medium text-gray-700">Additional product photos</label>
            <input id="galleryImages" type="file" accept="image/jpeg,image/png,image/gif" multiple @change="onGalleryFilesSelected" class="block w-full text-sm" />
            <p class="text-xs text-gray-500">Up to 8 additional photos, 2 MB each.</p>
            <span v-if="errors.galleryImages" role="alert" class="text-red-500 text-xs">{{ errors.galleryImages }}</span>
            <div v-if="existingGalleryImages.length || galleryFiles.length" class="flex flex-wrap gap-3">
                <div v-for="(image, index) in existingGalleryImages" :key="image.publicId" class="relative h-20 w-20 overflow-hidden rounded border border-gray-300">
                    <img :src="resolveAssetUrl(image.url, { width: 160 })" :alt="`${formData.title} photo ${index + 1}`" class="h-full w-full object-cover" />
                    <button type="button" :aria-label="`Remove saved photo ${index + 1}`" class="absolute right-1 top-1 rounded bg-white px-1 text-xs text-red-700 shadow" @click="removeExistingGalleryImage(index)">Remove</button>
                </div>
                <div v-for="(image, index) in galleryFiles" :key="image.url" class="relative h-20 w-20 overflow-hidden rounded border border-gray-300">
                    <img :src="image.url" :alt="`${formData.title} new photo ${index + 1}`" class="h-full w-full object-cover" />
                    <button type="button" :aria-label="`Remove new photo ${index + 1}`" class="absolute right-1 top-1 rounded bg-white px-1 text-xs text-red-700 shadow" @click="removeNewGalleryImage(index)">Remove</button>
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
                class="number-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
                :disabled="addingSubcategory"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
                {{ isEditing ? 'Save product changes' : 'Add product' }}
            </button>
        </div>
    </form>
</template>

<style scoped>
.number-input::-webkit-inner-spin-button,
.number-input::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
}

.number-input {
    -moz-appearance: textfield;
}
</style>

<script setup>
import { ref, watch, onBeforeUnmount, computed } from "vue";
import CategoryEditor from "./CategoryEditor.vue";
import { activeLeafCategories, collectionCategories } from "../../config/catalog";
import { resolveAssetUrl } from "../../utils/assetUrl";

const props = defineProps({
    product: Object, // Book object being edited (if any)
    categories: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(["save", "cancel", "categories-saved"]);
const addingSubcategory = ref(false);
const savedCategories = ref(null);
const categoryCatalog = computed(() => savedCategories.value || props.categories);
const categoryOptions = computed(() => activeLeafCategories(categoryCatalog.value).filter((category) => !collectionCategories(categoryCatalog.value).some((collection) => collection.id === category.id)));
const normalizeCollection = (value) => {
    if (typeof value !== "string") return "";
    const collection = value.trim();
    return ["null", "undefined"].includes(collection.toLowerCase()) ? "" : collection;
};
const availableCollections = computed(() => {
    const collections = collectionCategories(categoryCatalog.value);
    const currentCollection = normalizeCollection(formData.value.collection);
    return currentCollection && !collections.some((collection) => collection.name === currentCollection)
        ? [...collections, { id: `current-${currentCollection}`, name: currentCollection }]
        : collections;
});
const parentCategory = computed(() => categoryCatalog.value.find((category) => category.name === formData.value.category && category.status === "active"));
function subcategorySaved(response, category) {
    savedCategories.value = response.content.categories;
    formData.value.category = category.name;
    addingSubcategory.value = false;
    errors.value.category = null;
    emit("categories-saved", response);
}
const isEditing = ref(false);
const formData = ref({
    title: "",
    category: "",
    collection: "",
    colors: [],
    coverImageUrl: "",
    description: "",
    price: null,
    salePrice: null,
    quantityShop: 0,
    featured: false,
    status: "active",
    coverImage: null, // Property to hold the selected file
});

const errors = ref({});
const localImageUrl = ref(null);
const existingGalleryImages = ref([]);
const galleryFiles = ref([]);
const MAX_GALLERY_IMAGES = 8;

function galleryImagesFor(product) {
    return Array.isArray(product?.galleryImages)
        ? product.galleryImages.filter(image => image && typeof image.url === "string" && typeof image.publicId === "string")
        : [];
}

function clearGalleryFiles() {
    galleryFiles.value.forEach(image => URL.revokeObjectURL(image.url));
    galleryFiles.value = [];
}

function removeExistingGalleryImage(index) {
    existingGalleryImages.value = existingGalleryImages.value.filter((_, imageIndex) => imageIndex !== index);
}

function removeNewGalleryImage(index) {
    const [removed] = galleryFiles.value.splice(index, 1);
    if (removed) URL.revokeObjectURL(removed.url);
}

function onGalleryFilesSelected(event) {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    errors.value.galleryImages = null;
    if (existingGalleryImages.value.length + galleryFiles.value.length + selectedFiles.length > MAX_GALLERY_IMAGES) {
        errors.value.galleryImages = `Choose no more than ${MAX_GALLERY_IMAGES} additional photos.`;
        return;
    }
    const invalidFile = selectedFiles.find(file =>
        !["image/jpeg", "image/png", "image/gif"].includes(file.type) || file.size > 2 * 1024 * 1024,
    );
    if (invalidFile) {
        errors.value.galleryImages = invalidFile.size > 2 * 1024 * 1024
            ? "Each additional photo must be 2 MB or smaller."
            : "Choose JPG, PNG or GIF photos.";
        return;
    }
    galleryFiles.value.push(...selectedFiles.map(file => ({ file, url: URL.createObjectURL(file) })));
}

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
                collection: normalizeCollection(productData.collection),
                colors: Array.isArray(productData.colors) ? productData.colors : [],
                coverImage: null,
            };
            clearGalleryFiles();
            existingGalleryImages.value = galleryImagesFor(productData);
            localImageUrl.value = null; // Reset local image
        } else {
                clearGalleryFiles();
                existingGalleryImages.value = [];
            isEditing.value = false;
            formData.value = {
                title: "",
                isbn: "",
                category: "",
                collection: "",
                colors: [],
                coverImageUrl: "",
                description: "",
                price: null,
                salePrice: null,
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
    { immediate: true },
);

const validateForm = () => {
    errors.value = {};
    let isValid = true;

    if (!formData.value.title) {
        errors.value.title = "Title is required.";
        isValid = false;
    }

    if (formData.value.price === null) {
        errors.value.price = "Price is required.";
        isValid = false;
    }

    if (formData.value.salePrice !== null && formData.value.salePrice !== "") {
        const regularPrice = Number(formData.value.price);
        const salePrice = Number(formData.value.salePrice);
        if (salePrice <= 0 || salePrice >= regularPrice) {
            errors.value.salePrice = "Sale price must be lower than the regular price.";
            isValid = false;
        }
    }

    if (formData.value.quantityShop === null) {
        errors.value.quantityShop = "Quantity in shop is required.";
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
        if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
            errors.value.coverImage = "Choose a JPG, PNG or GIF image.";
            event.target.value = "";
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            errors.value.coverImage = "Cover image must be 2 MB or smaller.";
            event.target.value = "";
            return;
        }

        errors.value.coverImage = null;
        formData.value.coverImage = file;
        // Create a local URL for preview
        if (localImageUrl.value) URL.revokeObjectURL(localImageUrl.value);
        localImageUrl.value = URL.createObjectURL(file);
    }
};

const onSubmit = () => {
    if (addingSubcategory.value) return;
    if (validateForm()) {
        // Create a FormData object to send file data
        const form = new FormData();

        // Format the date to include time component
        const formattedData = { ...formData.value };
        // Barcode is a legacy database field and is no longer part of product management.
        delete formattedData.barcode;
        delete formattedData.galleryImages;
        delete formattedData.colors;
        formattedData.collection ??= "";
        if (formattedData.publicationDate) {
            // Append time component to make it a valid ISO datetime
            formattedData.publicationDate = `${formattedData.publicationDate}T00:00:00.000Z`;
        }

        // Append all form fields to FormData
        for (const key in formattedData) {
            // Skip appending 'coverImage' if it's null (no new file selected in edit mode)
            if (key === "coverImage" && formattedData[key] === null) continue;
            form.append(key, formattedData[key] ?? "");
        }
        form.append("galleryImagesToKeep", JSON.stringify(existingGalleryImages.value));
        galleryFiles.value.forEach(image => form.append("galleryImages", image.file));
        form.append("colors", JSON.stringify(formData.value.colors || []));

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
    clearGalleryFiles();

    emit("cancel");
};

onBeforeUnmount(clearGalleryFiles);
</script>
