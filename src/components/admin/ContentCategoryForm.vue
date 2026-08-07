<template>
    <form @submit.prevent="saveContent" class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Categories Management</h3>
                <button
                    type="button"
                    @click="addCategory"
                    class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                    Add Category
                </button>
            </div>

            <!-- Categories Table -->
            <div class="border rounded-md overflow-hidden mb-6">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Name
                            </th>
                            <th
                                scope="col"
                                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Slug
                            </th>
                            <th
                                scope="col"
                                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Parent
                            </th>

                            <th
                                scope="col"
                                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Status
                            </th>
                            <th
                                scope="col"
                                class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr
                            v-for="(category, index) in formData.categories"
                            :key="index"
                            class="hover:bg-gray-50"
                        >
                            <td class="px-2 py-2 whitespace-nowrap">
                                <div class="flex items-center">
                                    <!-- Visual indication of nesting level -->
                                    <div
                                        v-if="getCategoryLevel(category.id) > 0"
                                        class="text-gray-400 mr-2"
                                        :style="{
                                            marginLeft: `${getCategoryLevel(category.id) * 12}px`,
                                        }"
                                    >
                                        ⤷
                                    </div>
                                    <input
                                        type="text"
                                        v-model="category.name"
                                        @input="handleNameInput(category)"
                                        class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </td>
                            <td class="px-2 py-2 whitespace-nowrap">
                                <input
                                    type="text"
                                    v-model="category.slug"
                                    @input="
                                        () => (category._slugManuallySet = true)
                                    "
                                    class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </td>
                            <td class="px-2 py-2 whitespace-nowrap">
                                <select
                                    v-model="category.parentId"
                                    class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                                >
                                    <option :value="null">None</option>
                                    <option
                                        v-for="parent in availableParents(
                                            category.id,
                                        )"
                                        :key="parent.id"
                                        :value="parent.id"
                                    >
                                        {{ parent.name }}
                                    </option>
                                </select>
                            </td>

                            <td class="px-2 py-2 whitespace-nowrap">
                                <select
                                    v-model="category.status"
                                    class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </td>
                            <td class="px-2 py-2 whitespace-nowrap text-right">
                                <button
                                    type="button"
                                    @click="removeCategory(index)"
                                    class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="formData.categories.length === 0">
                            <td
                                colspan="6"
                                class="px-3 py-4 text-center text-sm text-gray-500"
                            >
                                No categories added. Click "Add Category" to
                                create one.
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                {{ saving ? "Saving..." : "Save Categories" }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
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
    categories: [],
});

const snackbarStore = useSnackbarStore();

// Initialize form with passed content
onMounted(() => {
    if (props.content) {
        formData.value = JSON.parse(JSON.stringify(props.content));
        // Initialize the _slugManuallySet flag for all categories
        formData.value.categories.forEach((category) => {
            category._slugManuallySet = true; // Assume existing slugs were manually set
        });
    }
});

// Helper function to generate a slug from a name
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
};

// Helper function to add a new category
const addCategory = () => {
    const newId =
        formData.value.categories.length > 0
            ? Math.max(...formData.value.categories.map((c) => c.id)) + 1
            : 1;

    formData.value.categories.push({
        id: newId,
        name: "New Category",
        slug: "new-category",
        parentId: null,
        status: "active",
        _slugManuallySet: false,
    });
};

// Helper function to remove a category
const removeCategory = (index) => {
    const categoryToRemove = formData.value.categories[index];

    // Check if this category has children
    const hasChildren = formData.value.categories.some(
        (c) => c.parentId === categoryToRemove.id,
    );

    if (hasChildren) {
        if (
            confirm(
                "This category has subcategories. Removing it will set all children to have no parent. Continue?",
            )
        ) {
            // Update all children to have no parent
            formData.value.categories.forEach((category) => {
                if (category.parentId === categoryToRemove.id) {
                    category.parentId = null;
                }
            });

            // Remove the category
            formData.value.categories.splice(index, 1);
        }
    } else {
        // No children, just remove
        formData.value.categories.splice(index, 1);
    }
};

// Helper function to get available parent categories (prevent circular references)
const availableParents = (currentId) => {
    // Can't be its own parent or any of its descendants
    const descendants = getAllDescendantIds(currentId);
    return formData.value.categories.filter(
        (category) =>
            category.id !== currentId && !descendants.includes(category.id),
    );
};

// Helper function to get all descendant IDs to prevent circular references
const getAllDescendantIds = (categoryId) => {
    const descendantIds = [];
    const findDescendants = (parentId) => {
        const children = formData.value.categories.filter(
            (c) => c.parentId === parentId,
        );
        children.forEach((child) => {
            descendantIds.push(child.id);
            findDescendants(child.id);
        });
    };

    findDescendants(categoryId);
    return descendantIds;
};

// Get the level of a category in the hierarchy (for indentation)
const getCategoryLevel = (categoryId) => {
    let level = 0;
    let currentCategory = formData.value.categories.find(
        (c) => c.id === categoryId,
    );

    while (currentCategory && currentCategory.parentId) {
        level++;
        currentCategory = formData.value.categories.find(
            (c) => c.id === currentCategory.parentId,
        );
    }

    return level;
};

// Handle name input to update slug if not manually set
const handleNameInput = (category) => {
    if (!category._slugManuallySet) {
        category.slug = generateSlug(category.name);
    }
};

// Save the categories
const saveContent = async () => {
    saving.value = true;

    try {
        // Remove the temporary _slugManuallySet flag before saving
        const dataToSave = JSON.parse(JSON.stringify(formData.value));
        dataToSave.categories.forEach((category) => {
            delete category._slugManuallySet;
        });

        const formDataToSend = new FormData();
        formDataToSend.append("content", JSON.stringify(dataToSave));

        const response = await axios.put(
            "/contents/categories",
            formDataToSend,
        );
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

// Watch for content prop changes
watch(
    () => props.content,
    (newContent) => {
        if (newContent) {
            formData.value = JSON.parse(JSON.stringify(newContent));
            // Re-initialize the _slugManuallySet flag
            formData.value.categories.forEach((category) => {
                category._slugManuallySet = true;
            });
        }
    },
);
</script>

<style scoped>
/* Add some basic styling to make tables look better */
table {
    border-collapse: separate;
    border-spacing: 0;
}

th {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #f9fafb;
}

input,
select {
    transition: all 0.2s;
}

input:hover,
select:hover {
    border-color: #d1d5db;
}

input:focus,
select:focus {
    border-color: var(--primary-color, #3b82f6);
    box-shadow: 0 0 0 1px var(--primary-color, #3b82f6);
}

/* Highlight row on hover */
tr:hover td {
    background-color: rgba(249, 250, 251, 0.5);
}
</style>
