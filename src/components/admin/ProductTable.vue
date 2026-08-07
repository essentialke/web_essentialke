<template>
    <div class="bg-white shadow-md rounded-lg overflow-x-auto">
        <table class="min-w-full leading-normal">
            <thead>
                <tr>
                    <th
                        v-for="header in headers"
                        :key="header.key"
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                        {{ header.title }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items" :key="item.id">
                    <td
                        v-for="header in headers"
                        :key="header.key"
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                        <template v-if="header.key !== 'actions'">
                            <!-- Check if the key has nested properties -->
                            <span v-if="header.key.includes('.')">
                                {{ getNestedPropertyValue(item, header.key) }}
                            </span>
                            <!-- Quantity with visual indicators -->
                            <span
                                v-else-if="
                                    header.key === 'quantityShop' ||
                                    header.key === 'quantityLibraryTotal'
                                "
                                :class="{
                                    'text-red-600 font-bold':
                                        item[header.key] === 0,
                                    'text-orange-500 font-semibold':
                                        item[header.key] > 0 &&
                                        item[header.key] < 5,
                                }"
                            >
                                {{ item[header.key] }}
                            </span>
                            <!-- Regular key without nesting -->
                            <span v-else>
                                {{ formatValue(item[header.key], header.key) }}
                            </span>
                        </template>
                        <template v-else>
                            <slot name="actions" :item="item" />
                        </template>
                    </td>
                </tr>
                <tr v-if="items.length === 0">
                    <td
                        :colspan="headers.length"
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                    >
                        No records found
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Pagination Controls -->
        <div
            class="px-5 py-3 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between"
        >
            <span class="text-sm text-gray-900">
                Showing {{ startItem }} to {{ endItem }} of
                {{ totalItems }} entries
            </span>
            <div class="inline-flex mt-2 xs:mt-0" v-if="totalPages > 0">
                <button
                    @click="changePage(1)"
                    :disabled="currentPage === 1"
                    class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                >
                    First
                </button>
                <button
                    @click="changePage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border-l border-gray-200"
                >
                    Prev
                </button>
                <div class="flex">
                    <button
                        v-for="page in displayedPages"
                        :key="page"
                        @click="changePage(page)"
                        :class="[
                            'text-sm py-2 px-4 border-l border-r border-gray-300',
                            currentPage === page
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-300 hover:bg-gray-400 text-gray-800',
                        ]"
                    >
                        {{ page }}
                    </button>
                </div>
                <button
                    @click="changePage(currentPage + 1)"
                    :disabled="currentPage >= totalPages"
                    class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border-r border-gray-200"
                >
                    Next
                </button>
                <button
                    @click="changePage(totalPages)"
                    :disabled="currentPage >= totalPages"
                    class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                >
                    Last
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    headers: {
        type: Array,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    itemsPerPage: {
        type: Number,
        default: 10,
    },
    totalItems: {
        type: Number,
        required: true,
    },
    currentPage: {
        type: Number,
        default: 1,
    },
});

const emit = defineEmits(["page-changed"]);

const totalPages = computed(
    () => Math.ceil(props.totalItems / props.itemsPerPage) || 1,
);

// Calculate start and end item numbers for the current page
const startItem = computed(() => {
    if (props.totalItems === 0) return 0;
    return (props.currentPage - 1) * props.itemsPerPage + 1;
});

const endItem = computed(() =>
    Math.min(startItem.value + props.itemsPerPage - 1, props.totalItems),
);

// Determine which page numbers to display
const displayedPages = computed(() => {
    const pages = [];
    const maxDisplayedPages = 5; // Maximum number of page buttons to show

    let startPage = Math.max(
        1,
        props.currentPage - Math.floor(maxDisplayedPages / 2),
    );
    let endPage = startPage + maxDisplayedPages - 1;

    if (endPage > totalPages.value) {
        endPage = totalPages.value;
        startPage = Math.max(1, endPage - maxDisplayedPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return pages;
});

// Format values based on column type
function formatValue(value, key) {
    if (value === null || value === undefined) return "";

    // Format price as currency
    if (key === "price" && value !== null) {
        return `$${parseFloat(value).toFixed(2)}`;
    }

    // Format dates
    if (
        value instanceof Date ||
        (typeof key === "string" && key.toLowerCase().includes("date") && value)
    ) {
        return new Date(value).toLocaleDateString();
    }

    // Format boolean values
    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return value;
}

// Helper function to get nested property values
function getNestedPropertyValue(item, key) {
    return key
        .split(".")
        .reduce(
            (obj, k) => (obj && obj[k] !== undefined ? obj[k] : null),
            item,
        );
}

// Change page and emit event
function changePage(page) {
    if (page < 1 || page > totalPages.value || page === props.currentPage)
        return;
    emit("page-changed", page);
}
</script>
