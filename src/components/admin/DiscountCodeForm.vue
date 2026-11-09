<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
            <label for="code" class="block text-sm font-medium text-gray-700"
                >Code</label
            >
            <div class="mt-1 flex flex-col gap-2 sm:flex-row">
            <input
                type="text"
                id="code"
                v-model.trim="formData.code"
                required
                :disabled="saving"
                class="block w-full min-w-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <button
                type="button"
                :disabled="saving"
                @click="generateCode"
                class="shrink-0 rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 disabled:opacity-50"
            >
                Generate code
            </button>
            </div>
            <p class="mt-1 text-xs text-gray-500">Enter your own code or generate one, then save the coupon.</p>
            <p class="sr-only" role="status">{{ generationMessage }}</p>
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
                >{{ formData.type === 'percentage' ? 'Percentage off (%)' : 'Amount off (KES)' }}</label
            >
            <input
                type="number"
                id="value"
                v-model.number="formData.value"
                min="0.01"
                :max="formData.type === 'percentage' ? 100 : undefined"
                step="0.01"
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
                >Valid From (optional)</label
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
                >Valid Until (optional)</label
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
                :disabled="saving"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
                {{ saving ? 'Saving...' : 'Save coupon' }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
    discountCode: Object,
    saving: Boolean,
    existingCodes: { type: Array, default: () => [] },
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
const generationMessage = ref("");
const generateCode = () => {
    if (props.saving) return;
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const usedCodes = new Set(props.existingCodes.map((code) => code.trim().toUpperCase()));
    usedCodes.add(formData.value.code.toUpperCase());
    let code;
    do {
        const random = crypto.getRandomValues(new Uint8Array(4));
        code = `ESS-${Array.from(random, (byte) => alphabet[byte % alphabet.length]).join("")}`;
    } while (usedCodes.has(code));
    formData.value.code = code;
    delete errors.value.code;
    generationMessage.value = `Generated coupon code ${code}. Save the coupon to activate it.`;
};
const toLocalDateTime = (value) => {
    const date = new Date(value);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

onMounted(() => {
    if (props.discountCode) {
        isEditing.value = true;

        formData.value = {
            ...props.discountCode,
            validFrom: props.discountCode.validFrom
                ? toLocalDateTime(props.discountCode.validFrom)
                : null,
            validUntil: props.discountCode.validUntil
                ? toLocalDateTime(props.discountCode.validUntil)
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
                    ? toLocalDateTime(newDiscountCode.validFrom)
                    : null,
                validUntil: newDiscountCode.validUntil
                    ? toLocalDateTime(newDiscountCode.validUntil)
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

    if (!formData.value.code.trim()) {
        errors.value.code = "Code is required.";
        isValid = false;
    }

    if (!formData.value.type) {
        errors.value.type = "Type is required.";
        isValid = false;
    }

    if (!Number.isFinite(formData.value.value) || formData.value.value <= 0) {
        errors.value.value = "Value must be greater than 0.";
        isValid = false;
    }

    if (formData.value.type === 'percentage' && formData.value.value > 100) {
        errors.value.value = "Percentage must be 100 or less.";
        isValid = false;
    }
    if (formData.value.validFrom && formData.value.validUntil && new Date(formData.value.validUntil) <= new Date(formData.value.validFrom)) {
        errors.value.validUntil = "End date must be after the start date.";
        isValid = false;
    }
    return isValid;
};

const onSubmit = () => {
    if (!props.saving && validateForm()) {
        const { code, type, value, validFrom, validUntil, isActive } = formData.value;
        emit("save", {
            code: code.trim(), type, value, isActive,
            validFrom: validFrom ? new Date(validFrom).toISOString() : null,
            validUntil: validUntil ? new Date(validUntil).toISOString() : null,
        });
    }
};

const onCancel = () => {
    errors.value = {};
    emit("cancel");
};
</script>
