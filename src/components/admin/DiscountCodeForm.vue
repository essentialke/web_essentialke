<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
            <label for="code" class="block text-sm font-medium text-gray-700"
                >Code</label
            >
            <input
                type="text"
                id="code"
                v-model="formData.code"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="errors.code" class="text-red-500 text-xs">{{
                errors.code
            }}</span>
        </div>

        <div>
            <label for="type" class="block text-sm font-medium text-gray-700"
                >Type</label
            >
            <select
                id="type"
                v-model="formData.type"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
            </select>
            <span v-if="errors.type" class="text-red-500 text-xs">{{
                errors.type
            }}</span>
        </div>

        <div>
            <label for="value" class="block text-sm font-medium text-gray-700"
                >Value</label
            >
            <input
                type="number"
                id="value"
                v-model="formData.value"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="errors.value" class="text-red-500 text-xs">{{
                errors.value
            }}</span>
        </div>

        <div>
            <label
                for="validFrom"
                class="block text-sm font-medium text-gray-700"
                >Valid From</label
            >
            <input
                type="datetime-local"
                id="validFrom"
                v-model="formData.validFrom"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="errors.validFrom" class="text-red-500 text-xs">{{
                errors.validFrom
            }}</span>
        </div>

        <div>
            <label
                for="validUntil"
                class="block text-sm font-medium text-gray-700"
                >Valid Until</label
            >
            <input
                type="datetime-local"
                id="validUntil"
                v-model="formData.validUntil"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="errors.validUntil" class="text-red-500 text-xs">{{
                errors.validUntil
            }}</span>
        </div>

        <!-- isActive Checkbox -->
        <div>
            <input
                type="checkbox"
                id="isActive"
                v-model="formData.isActive"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label for="isActive" class="ml-2 text-sm font-medium text-gray-700"
                >Is Active</label
            >
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
import { ref, watch, onMounted } from "vue";

const props = defineProps({
    discountCode: Object,
});

const emit = defineEmits(["save", "cancel"]);

const isEditing = ref(false);
const formData = ref({
    code: "",
    type: "percentage",
    value: null,
    validFrom: null,
    validUntil: null,
    isActive: true,
});

const errors = ref({});

onMounted(() => {
    if (props.discountCode) {
        isEditing.value = true;

        formData.value = {
            ...props.discountCode,
            validFrom: props.discountCode.validFrom
                ? new Date(props.discountCode.validFrom)
                      .toISOString()
                      .slice(0, 16)
                : null,
            validUntil: props.discountCode.validUntil
                ? new Date(props.discountCode.validUntil)
                      .toISOString()
                      .slice(0, 16)
                : null,
        };
    }
});

watch(
    () => props.discountCode,
    (newDiscountCode) => {
        if (newDiscountCode) {
            isEditing.value = true;
            formData.value = {
                ...newDiscountCode,
                validFrom: newDiscountCode.validFrom
                    ? new Date(newDiscountCode.validFrom)
                          .toISOString()
                          .slice(0, 16)
                    : null,
                validUntil: newDiscountCode.validUntil
                    ? new Date(newDiscountCode.validUntil)
                          .toISOString()
                          .slice(0, 16)
                    : null,
            };
        } else {
            isEditing.value = false;
            formData.value = {
                code: "",
                type: "percentage",
                value: null,
                validFrom: null,
                validUntil: null,
                isActive: true,
            };
        }
        errors.value = {};
    },
);

const validateForm = () => {
    errors.value = {};
    let isValid = true;

    if (!formData.value.code) {
        errors.value.code = "Code is required.";
        isValid = false;
    }

    if (!formData.value.type) {
        errors.value.type = "Type is required.";
        isValid = false;
    }

    if (formData.value.value === null || formData.value.value <= 0) {
        errors.value.value = "Value must be greater than 0.";
        isValid = false;
    }

    return isValid;
};

const onSubmit = () => {
    if (validateForm()) {
        emit("save", formData.value);
    }
};

const onCancel = () => {
    errors.value = {};
    emit("cancel");
};
</script>
