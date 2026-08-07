<template>
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
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
                                    {{
                                        getNestedPropertyValue(item, header.key)
                                    }}
                                </span>
                                <!-- Regular key without nesting -->
                                <span v-else>
                                    {{
                                        formatValue(
                                            item[header.key],
                                            header.format,
                                        )
                                    }}
                                </span>
                            </template>
                            <template v-else>
                                <slot name="actions" :item="item" />
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Controls -->
        <div
            v-if="totalItems > 0"
            class="px-5 py-4 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between"
        >
            <div class="flex items-center">
                <span class="text-sm text-gray-700">
                    Showing <span class="font-medium">{{ startIndex }}</span> to
                    <span class="font-medium">{{ endIndex }}</span> of
                    <span class="font-medium">{{ totalItems }}</span> entries
                </span>
            </div>

            <div class="inline-flex mt-2 xs:mt-0">
                <button
                    @click="$emit('page-changed', currentPage - 1)"
                    :disabled="currentPage === 1"
                    :class="[
                        'text-sm py-2 px-4 rounded-l',
                        currentPage === 1
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold',
                    ]"
                >
                    Prev
                </button>

                <!-- Page numbers -->
                <div class="hidden sm:flex">
                    <template v-for="page in displayedPages" :key="page">
                        <button
                            v-if="page !== '...'"
                            @click="$emit('page-changed', page)"
                            :class="[
                                'text-sm py-2 px-4 border-t border-b border-gray-300',
                                currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300 hover:bg-gray-400 text-gray-800',
                            ]"
                        >
                            {{ page }}
                        </button>
                        <span
                            v-else
                            class="text-sm py-2 px-4 border-t border-b border-gray-300 bg-gray-200"
                        >
                            {{ page }}
                        </span>
                    </template>
                </div>

                <button
                    @click="$emit('page-changed', currentPage + 1)"
                    :disabled="currentPage >= totalPages"
                    :class="[
                        'text-sm py-2 px-4 rounded-r',
                        currentPage >= totalPages
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold',
                    ]"
                >
                    Next
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

const totalPages = computed(() =>
    Math.max(1, Math.ceil(props.totalItems / props.itemsPerPage)),
);

const startIndex = computed(() => {
    if (props.totalItems === 0) return 0;
    return (props.currentPage - 1) * props.itemsPerPage + 1;
});

const endIndex = computed(() => {
    return Math.min(
        startIndex.value + props.itemsPerPage - 1,
        props.totalItems,
    );
});

// Create a computed property to determine which page numbers to display
const displayedPages = computed(() => {
    const totalPages = Math.ceil(props.totalItems / props.itemsPerPage);
    if (totalPages <= 7) {
        // If we have 7 or fewer pages, show all pages
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always include first and last page
    const pages = [1];

    // Current page is near the beginning
    if (props.currentPage <= 3) {
        pages.push(2, 3, 4, "...", totalPages);
    }
    // Current page is near the end
    else if (props.currentPage >= totalPages - 2) {
        pages.push(
            "...",
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        );
    }
    // Current page is in the middle
    else {
        pages.push(
            "...",
            props.currentPage - 1,
            props.currentPage,
            props.currentPage + 1,
            "...",
            totalPages,
        );
    }

    return pages;
});

// Helper function to get nested property values
function getNestedPropertyValue(item, key) {
    return key
        .split(".")
        .reduce(
            (obj, k) => (obj && obj[k] !== undefined ? obj[k] : null),
            item,
        );
}

// Helper function to format values based on type
function formatValue(value, format) {
    if (value === undefined || value === null) return "-";

    // If no format specified or value is not a valid type, return as is
    if (!format) return value;

    switch (format) {
        case "date":
            return new Date(value).toLocaleDateString();
        case "datetime":
            return new Date(value).toLocaleString();
        case "currency":
            return typeof value === "number"
                ? `KSh ${value.toFixed(2)}`
                : value;
        case "percentage":
            return typeof value === "number" ? `${value.toFixed(2)}%` : value;
        default:
            return value;
    }
}
</script>
