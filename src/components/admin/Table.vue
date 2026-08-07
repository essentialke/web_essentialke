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
                            <!-- Regular key without nesting -->
                            <span v-else>
                                {{ item[header.key] }}
                            </span>
                        </template>
                        <template v-else>
                            <slot name="actions" :item="item" />
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Pagination Controls -->
        <div
            class="px-5 py-3 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between"
        >
            <div class="inline-flex mt-2 xs:mt-0">
                <button
                    @click="$emit('page-changed', currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                >
                    Prev
                </button>
                <button
                    @click="$emit('page-changed', currentPage + 1)"
                    :disabled="currentPage >= totalPages"
                    class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

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
    Math.ceil(props.totalItems / props.itemsPerPage),
);

// Helper function to get nested property values
function getNestedPropertyValue(item, key) {
    return key
        .split(".")
        .reduce(
            (obj, k) => (obj && obj[k] !== undefined ? obj[k] : null),
            item,
        );
}
</script>
