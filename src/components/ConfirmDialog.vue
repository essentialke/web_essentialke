<template>
    <Modal v-model="isOpen" :title="title" class="confirm-dialog">
        <div class="p-4">
            <p class="text-gray-700">{{ message }}</p>
            <div class="mt-4 flex justify-end space-x-3">
                <button
                    @click="cancel"
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    @click="confirm"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                    Confirm
                </button>
            </div>
        </div>
    </Modal>
</template>

<script setup>
import { computed } from "vue";
import Modal from "./Modal.vue";

const props = defineProps({
    modelValue: Boolean,
    title: {
        type: String,
        default: "Confirm Action",
    },
    message: {
        type: String,
        default: "Are you sure you want to proceed?",
    },
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

function confirm() {
    emit("confirm");
    isOpen.value = false;
}

function cancel() {
    emit("cancel");
    isOpen.value = false;
}
</script>
